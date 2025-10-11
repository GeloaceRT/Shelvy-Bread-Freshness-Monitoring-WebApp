const DEVICE_TEMPLATES = [
  {
    id: "casing-1",
    name: "Casing 1",
    location: "Bakery Floor - Section A",
    temperature: 25,
    humidity: 60,
    battery: 84,
    status: "online",
    isActive: true,
  },
  {
    id: "casing-2",
    name: "Casing 2",
    location: "Proofing Room",
    temperature: 23,
    humidity: 58,
    battery: 62,
    status: "standby",
    isActive: false,
  },
  {
    id: "casing-3",
    name: "Casing 3",
    location: "Storage - Section C",
    temperature: 28,
    humidity: 65,
    battery: 47,
    status: "standby",
    isActive: false,
  },
];

const HUMIDITY_RANGE = { min: 45, max: 75 };
const TEMPERATURE_RANGE = { min: 18, max: 32 };
const HISTORY_LIMIT = 60;
const ALERT_LIMIT = 6;
const LOG_LIMIT = 20;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round(value, digits = 1) {
  const power = 10 ** digits;
  return Math.round(value * power) / power;
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function formatValue(value, unit) {
  return `${value}${unit}`;
}

export default class MockTelemetryService {
  constructor() {
    this.intervalMs = 5000;
    this.subscribers = new Set();
    this.alertCounter = 0;
    this.logCounter = 0;
    this.readingCounter = 0;
    this.timer = null;
    this.state = this.createInitialState();
  }

  createInitialState() {
    const now = new Date().toISOString();
    const devices = DEVICE_TEMPLATES.map((device) => ({
      ...device,
      temperature: round(device.temperature, 1),
      humidity: round(device.humidity, 1),
      battery: round(device.battery, 0),
      lastUpdated: now,
    }));

    const activeDevice = devices.find((device) => device.isActive) || devices[0];
    const activeDeviceId = activeDevice ? activeDevice.id : null;

    const alerts = [
      {
        id: `alert-${++this.alertCounter}`,
        deviceId: "casing-1",
        title: "High humidity resolved",
        severity: "success",
        timestamp: now,
        value: "Back in range",
      },
    ];

    const logs = [
      {
        id: `log-${++this.logCounter}`,
        timestamp: now,
        deviceId: "casing-1",
        event: "Telemetry stream started",
        type: "info",
      },
    ];

    const history = devices.map((device) => ({
      id: `reading-${++this.readingCounter}`,
      deviceId: device.id,
      temperature: device.temperature,
      humidity: device.humidity,
      timestamp: now,
    }));

    return {
      summary: {
        temperature: activeDevice.temperature,
        humidity: activeDevice.humidity,
        temperatureTrend: 0,
        humidityTrend: 0,
        lastUpdated: now,
        deviceId: activeDeviceId,
      },
      devices,
      alerts,
      logs,
      history,
      activeDeviceId,
      lastUpdated: now,
    };
  }

  start() {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  subscribe(handler) {
    this.subscribers.add(handler);
    handler(this.state);
  }

  unsubscribe(handler) {
    this.subscribers.delete(handler);
  }

  getSnapshot() {
    return this.state;
  }

  tick() {
    const previousState = this.state;
    const now = new Date().toISOString();
    const activeDeviceId = previousState.activeDeviceId;

    const devices = previousState.devices.map((device) => {
      const temperatureDelta = randomInRange(-0.8, 0.9);
      const humidityDelta = randomInRange(-2.5, 2.5);
      const batteryDelta = randomInRange(0.05, 0.3);

      let temperature = clamp(device.temperature + temperatureDelta, TEMPERATURE_RANGE.min, TEMPERATURE_RANGE.max);
      let humidity = clamp(device.humidity + humidityDelta, HUMIDITY_RANGE.min - 5, HUMIDITY_RANGE.max + 5);
      let battery = clamp(device.battery - batteryDelta, 10, 100);

      if (battery < 15 && Math.random() > 0.7) {
        battery = clamp(battery - randomInRange(0.5, 1.5), 5, 100);
      }

      const status = device.id === activeDeviceId ? "online" : device.status;
      const isActive = device.id === activeDeviceId;

      return {
        ...device,
        temperature: round(temperature, 1),
        humidity: round(humidity, 1),
        battery: round(battery, 0),
        status,
        isActive,
        lastUpdated: now,
      };
    });

    let activeDevice = devices.find((device) => device.id === activeDeviceId) || devices[0] || null;
    let nextActiveDeviceId = activeDevice ? activeDevice.id : null;
    if (activeDevice && !activeDevice.isActive) {
      activeDevice = { ...activeDevice, isActive: true, status: "online" };
    }

    const updatedDevices = devices.map((device) =>
      device.id === nextActiveDeviceId ? { ...activeDevice } : device
    );

    const temperatureTrend = activeDevice
      ? round(activeDevice.temperature - previousState.summary.temperature, 1)
      : 0;
    const humidityTrend = activeDevice
      ? round(activeDevice.humidity - previousState.summary.humidity, 1)
      : 0;

    const summaryDevice = activeDevice || previousState.devices[0] || null;

    const historyEntries = updatedDevices.map((device) => ({
      id: `reading-${++this.readingCounter}`,
      deviceId: device.id,
      temperature: device.temperature,
      humidity: device.humidity,
      timestamp: now,
    }));

    const history = [...historyEntries, ...previousState.history].slice(0, HISTORY_LIMIT);

  const alerts = this.buildAlerts(previousState.alerts, summaryDevice, now, temperatureTrend, humidityTrend);
  const latestAlertId = alerts[0] ? alerts[0].id : null;
  const previousLatestAlertId = previousState.alerts[0] ? previousState.alerts[0].id : null;
  const hasNewAlert = latestAlertId !== previousLatestAlertId;
  const logs = this.buildLogs(previousState.logs, summaryDevice, now, hasNewAlert);

    this.state = {
      summary: {
        temperature: summaryDevice ? summaryDevice.temperature : previousState.summary.temperature,
        humidity: summaryDevice ? summaryDevice.humidity : previousState.summary.humidity,
        temperatureTrend,
        humidityTrend,
        lastUpdated: now,
        deviceId: summaryDevice ? summaryDevice.id : previousState.summary.deviceId,
      },
      devices: updatedDevices,
      alerts,
      logs,
      history,
      activeDeviceId: nextActiveDeviceId,
      lastUpdated: now,
    };

    this.emit();
  }

  setActiveDevice(deviceId) {
    if (!deviceId) {
      return;
    }

    const previousState = this.state;
    if (!previousState.devices.some((device) => device.id === deviceId)) {
      return;
    }

    if (previousState.activeDeviceId === deviceId) {
      return;
    }

    const devices = previousState.devices.map((device) => ({
      ...device,
      isActive: device.id === deviceId,
      status: device.id === deviceId ? "online" : device.status,
    }));

    const activeDevice = devices.find((device) => device.id === deviceId);
    const now = new Date().toISOString();

    this.state = {
      ...previousState,
      devices,
      activeDeviceId: deviceId,
      summary: {
        ...previousState.summary,
        temperature: activeDevice ? activeDevice.temperature : previousState.summary.temperature,
        humidity: activeDevice ? activeDevice.humidity : previousState.summary.humidity,
        temperatureTrend: 0,
        humidityTrend: 0,
        lastUpdated: activeDevice ? activeDevice.lastUpdated : now,
        deviceId,
      },
      lastUpdated: now,
    };

    this.emit();
  }

  buildAlerts(previousAlerts, activeDevice, timestamp, temperatureTrend, humidityTrend) {
    if (!activeDevice) {
      return previousAlerts.slice(0, ALERT_LIMIT);
    }

    const alerts = [...previousAlerts];
    const humidityHigh = activeDevice.humidity > HUMIDITY_RANGE.max;
    const humidityLow = activeDevice.humidity < HUMIDITY_RANGE.min;
    const temperatureHigh = activeDevice.temperature > TEMPERATURE_RANGE.max - 1;
    const temperatureLow = activeDevice.temperature < TEMPERATURE_RANGE.min + 1;

    const conditions = [];

    if (humidityHigh) {
      conditions.push({
        title: `High humidity (${activeDevice.humidity}%)` ,
        severity: "warning",
        value: formatValue(activeDevice.humidity, "%"),
      });
    } else if (humidityLow) {
      conditions.push({
        title: `Low humidity (${activeDevice.humidity}%)`,
        severity: "warning",
        value: formatValue(activeDevice.humidity, "%"),
      });
    }

    if (temperatureHigh) {
      conditions.push({
        title: `High temperature (${activeDevice.temperature}°C)`,
        severity: "warning",
  value: formatValue(activeDevice.temperature, "\u00B0C"),
      });
    } else if (temperatureLow) {
      conditions.push({
        title: `Low temperature (${activeDevice.temperature}°C)`,
        severity: "warning",
  value: formatValue(activeDevice.temperature, "\u00B0C"),
      });
    }

    if (Math.abs(temperatureTrend) <= 0.2 && Math.abs(humidityTrend) <= 0.5 && conditions.length === 0) {
      if (!alerts[0] || alerts[0].severity !== "success") {
        alerts.unshift({
          id: `alert-${++this.alertCounter}`,
          deviceId: activeDevice.id,
          title: "Conditions stable",
          severity: "success",
          timestamp,
          value: "All metrics nominal",
        });
      }
    } else {
      conditions.forEach((condition) => {
        alerts.unshift({
          id: `alert-${++this.alertCounter}`,
          deviceId: activeDevice.id,
          title: `${condition.title} detected`,
          severity: condition.severity,
          timestamp,
          value: condition.value,
        });
      });
    }

    return alerts.slice(0, ALERT_LIMIT);
  }

  buildLogs(previousLogs, activeDevice, timestamp, hasNewAlert) {
    if (!activeDevice) {
      return previousLogs.slice(0, LOG_LIMIT);
    }

    const logs = [...previousLogs];

    logs.unshift({
      id: `log-${++this.logCounter}`,
      timestamp,
      deviceId: activeDevice.id,
      event: `Telemetry ping: ${activeDevice.temperature}°C / ${activeDevice.humidity}%`,
      type: "metric",
    });

    if (hasNewAlert) {
      logs.unshift({
        id: `log-${++this.logCounter}`,
        timestamp,
        deviceId: activeDevice.id,
        event: "Alert generated from live reading",
        type: "alert",
      });
    }

    return logs.slice(0, LOG_LIMIT);
  }

  emit() {
    this.subscribers.forEach((handler) => handler(this.state));
  }
}
