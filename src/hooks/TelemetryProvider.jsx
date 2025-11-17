import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createApiClient, DEFAULT_API_BASE_URL } from "../services/apiClient";
import MockTelemetryService from "../services/mockTelemetryService";

const TelemetryContext = createContext(null);

const HISTORY_LIMIT = 60;
const LOG_LIMIT = 40;

const BASE_DEVICE = {
  id: "shelvy-sensor",
  name: "Shelvy Shelf Sensor",
  location: "Bakery Floor",
};

const ensureIsoString = (value) => {
  try {
    return new Date(value || Date.now()).toISOString();
  } catch (_error) {
    return new Date().toISOString();
  }
};

const createInitialSummary = () => ({
  temperature: null,
  humidity: null,
  temperatureTrend: 0,
  humidityTrend: 0,
  lastUpdated: null,
  deviceId: null,
});

const createInitialState = () => ({
  summary: createInitialSummary(),
  devices: [],
  alerts: [],
  logs: [],
  history: [],
  activeDeviceId: null,
  lastUpdated: null,
  banner: null,
  status: "idle",
  error: null,
});

const mapAlertHistory = (alertHistory, capturedAtIso) => {
  if (!alertHistory || !Array.isArray(alertHistory.alerts)) {
    return [];
  }
  return alertHistory.alerts
    .map((alert) => {
      const timestamp = ensureIsoString(alert.createdAt || capturedAtIso);
      const severity = (alert.level || "critical").toLowerCase();

      return {
        id: alert.id || `alert-${timestamp}`,
        deviceId: alert.deviceId || BASE_DEVICE.id,
        level: alert.level || "critical",
        severity,
        timestamp,
        title: alert.type === "sensor_threshold" ? "Sensor threshold exceeded" : alert.type || "Alert",
        message: alert.message || "Sensor alert",
        value: [
          alert.temperature !== undefined ? `${alert.temperature}°C` : null,
          alert.humidity !== undefined ? `${alert.humidity}%` : null,
        ]
          .filter(Boolean)
          .join(" · ") || null,
        temperature: alert.temperature,
        humidity: alert.humidity,
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export function TelemetryProvider({
  children,
  token,
  baseUrl = DEFAULT_API_BASE_URL,
  pollInterval = 12000,
}) {
  const clientRef = useRef(createApiClient(baseUrl));
  const pollTimerRef = useRef(null);
  const pollRef = useRef(null);
  const tokenRef = useRef(token || null);
  const previousReadingRef = useRef(null);
  const dismissedBannerIdsRef = useRef(new Set());
  const mockServiceRef = useRef(null);
  const mockHandlerRef = useRef(null);
  const modeRef = useRef("live");
  const [state, setState] = useState(() => createInitialState());
  const [mode, setMode] = useState("live");

  useEffect(() => {
    clientRef.current = createApiClient(baseUrl);
  }, [baseUrl]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const deactivateMock = useCallback(() => {
    if (modeRef.current !== "mock") {
      return;
    }

    const service = mockServiceRef.current;
    if (service && mockHandlerRef.current) {
      service.unsubscribe(mockHandlerRef.current);
      mockHandlerRef.current = null;
    }

    if (service) {
      service.stop();
    }

    modeRef.current = "live";
    setMode("live");
    setState(createInitialState());
  }, []);

  const activateMock = useCallback(() => {
    if (modeRef.current === "mock") {
      return;
    }

    stopPolling();

    if (!mockServiceRef.current) {
      mockServiceRef.current = new MockTelemetryService();
    }
    const service = mockServiceRef.current;
    if (mockHandlerRef.current) {
      service.unsubscribe(mockHandlerRef.current);
    }

    const handler = (snapshot) => {
      // Build a candidate banner from mock alerts (show warnings/critical)
      const alertsArray = Array.isArray(snapshot.alerts) ? snapshot.alerts : [];
      let candidateBanner = null;
      if (alertsArray.length > 0) {
        const first = alertsArray[0];
        const timestamp = first.timestamp || snapshot.lastUpdated || new Date().toISOString();
        const severity = (first.severity || 'critical').toLowerCase();
        // Only surface warnings or criticals as banners
        if (severity === 'critical' || severity === 'warning') {
          // try to find device info in snapshot.devices
          const device = Array.isArray(snapshot.devices) ? snapshot.devices.find(d => d.id === first.deviceId) : null;
          candidateBanner = {
            id: `${timestamp}:${first.id ?? 'mock'}`,
            severity: severity === 'critical' ? 'critical' : 'warning',
            title: first.title || 'Critical freshness alert',
            message: first.value || first.title || 'Sensor alert',
            timestamp,
            deviceId: first.deviceId || (device ? device.id : BASE_DEVICE.id),
            deviceName: device ? device.name : (first.deviceId || BASE_DEVICE.name),
            deviceLocation: device ? device.location : BASE_DEVICE.location,
          };
        }
      }

      const resolvedBanner = (() => {
        if (!candidateBanner) return null;
        if (dismissedBannerIdsRef.current.has(candidateBanner.id)) return null;
        return candidateBanner;
      })();

      // ensure persistent alert/log entries so the Alerts (Logs & History) tab retains the banner
      const nextAlerts = Array.isArray(snapshot.alerts) ? [...snapshot.alerts] : [];
      const nextLogs = Array.isArray(snapshot.logs) ? [...snapshot.logs] : [];

      if (resolvedBanner) {
        const alertRecord = {
          id: resolvedBanner.id,
          deviceId: resolvedBanner.deviceId || BASE_DEVICE.id,
          title: resolvedBanner.title,
          severity: resolvedBanner.severity || 'critical',
          timestamp: resolvedBanner.timestamp || new Date().toISOString(),
          value: resolvedBanner.message || resolvedBanner.title,
        };

        if (!nextAlerts.find((a) => a.id === alertRecord.id)) {
          nextAlerts.unshift(alertRecord);
        }

        nextLogs.unshift({
          id: `log-${Date.now()}`,
          timestamp: alertRecord.timestamp,
          deviceId: alertRecord.deviceId,
          event: alertRecord.title,
          type: 'alert',
        });
      }

      setState({
        ...snapshot,
        alerts: nextAlerts,
        logs: nextLogs.slice(0, LOG_LIMIT),
        banner: resolvedBanner,
        status: "mock",
        error: null,
      });
    };

    mockHandlerRef.current = handler;
    service.subscribe(handler);
    service.start();
    // Emit an immediate tick so UI shows readings right after activating mock mode
    if (typeof service.tick === 'function') {
      service.tick();
    }

    modeRef.current = "mock";
    setMode("mock");
  }, [stopPolling]);

  useEffect(() => {
    tokenRef.current = token || null;
    if (!token) {
      previousReadingRef.current = null;
      dismissedBannerIdsRef.current.clear();
      activateMock();
      return;
    }
    deactivateMock();
    previousReadingRef.current = null;
    dismissedBannerIdsRef.current.clear();
    setState(createInitialState());
  }, [token, activateMock, deactivateMock]);

  useEffect(() => {
    return () => {
      stopPolling();
      const service = mockServiceRef.current;
      if (service && mockHandlerRef.current) {
        service.unsubscribe(mockHandlerRef.current);
      }
      if (service) {
        service.stop();
      }
    };
  }, [stopPolling]);

  const applyReadingUpdate = useCallback((readingPayload, alertMessagesPayload, alertHistoryPayload) => {
    if (!readingPayload) {
      setState((current) => ({
        ...current,
        status: "error",
        error: "Telemetry reading payload was empty.",
      }));
      return;
    }

    const capturedAtIso = ensureIsoString(readingPayload.capturedAt);
    const temperature = Number.isFinite(readingPayload.temperature)
      ? Number(readingPayload.temperature)
      : null;
    const humidity = Number.isFinite(readingPayload.humidity)
      ? Number(readingPayload.humidity)
      : null;

    const previous = previousReadingRef.current;
    const previousIso = previous ? ensureIsoString(previous.capturedAt) : null;
    const isNewReading = !previousIso || previousIso !== capturedAtIso;

    const temperatureTrend = previous && Number.isFinite(previous.temperature) && Number.isFinite(temperature)
      ? Number((temperature - previous.temperature).toFixed(2))
      : 0;
    const humidityTrend = previous && Number.isFinite(previous.humidity) && Number.isFinite(humidity)
      ? Number((humidity - previous.humidity).toFixed(2))
      : 0;

    previousReadingRef.current = {
      temperature,
      humidity,
      capturedAt: capturedAtIso,
    };

    const alertMessages = Array.isArray(alertMessagesPayload?.alerts) ? alertMessagesPayload.alerts : [];
    const convertedAlerts = mapAlertHistory(alertHistoryPayload, capturedAtIso);
      const nextDevices = [
        {
          ...BASE_DEVICE,
          temperature,
          humidity,
          battery: null,
          status: "online",
          isActive: true,
          lastUpdated: capturedAtIso,
        },
      ];

      const candidateBanner = alertMessages.length
      ? {
          id: `${capturedAtIso}:${alertMessages.join("|")}`,
          severity: "critical",
          title: "Critical freshness alert",
          message: alertMessages[0],
          // attach device info when available
            deviceId: nextDevices && nextDevices[0] ? nextDevices[0].id : BASE_DEVICE.id,
            deviceName: nextDevices && nextDevices[0] ? nextDevices[0].name : BASE_DEVICE.name,
            deviceLocation: nextDevices && nextDevices[0] ? nextDevices[0].location : BASE_DEVICE.location,
          timestamp: capturedAtIso,
        }
      : null;

    setState((current) => {
      const readingEntryId = `reading-${capturedAtIso}`;
      const nextHistory = isNewReading
        ? [
            {
              id: readingEntryId,
              deviceId: BASE_DEVICE.id,
              temperature,
              humidity,
              timestamp: capturedAtIso,
            },
            ...current.history.filter((entry) => entry.id !== readingEntryId),
          ].slice(0, HISTORY_LIMIT)
        : current.history;
      // reuse `nextDevices` computed above

      const resolvedBanner = (() => {
        if (!candidateBanner) {
          return null;
        }
        if (dismissedBannerIdsRef.current.has(candidateBanner.id)) {
          return current.banner && current.banner.id === candidateBanner.id ? null : current.banner;
        }
        if (current.banner && current.banner.id === candidateBanner.id) {
          return current.banner;
        }
        return candidateBanner;
      })();

      const nextLogs = (() => {
        const logMap = new Map(current.logs.map((entry) => [entry.id, entry]));

        if (isNewReading) {
          const readingLogId = `reading-log-${capturedAtIso}`;
          logMap.set(readingLogId, {
            id: readingLogId,
            timestamp: capturedAtIso,
            severity: alertMessages.length ? "critical" : "info",
            category: "reading",
            title: "Latest telemetry reading",
            message:
              temperature !== null && humidity !== null
                ? `Temperature ${temperature.toFixed(1)}°C · Humidity ${humidity.toFixed(1)}%`
                : "Sensor values updated.",
            deviceId: BASE_DEVICE.id,
            temperature,
            humidity,
          });
        }

        convertedAlerts.forEach((alert) => {
          logMap.set(alert.id, {
            id: alert.id,
            timestamp: alert.timestamp,
            severity: alert.severity === "critical" ? "critical" : "warning",
            category: "alert",
            title: alert.title,
            message: alert.message,
            deviceId: alert.deviceId,
            temperature: alert.temperature,
            humidity: alert.humidity,
            value: alert.value,
          });
        });

        nextHistory.slice(0, 6).forEach((entry) => {
          const historyLogId = `history-${entry.id}`;
          if (!logMap.has(historyLogId)) {
            logMap.set(historyLogId, {
              id: historyLogId,
              timestamp: entry.timestamp,
              severity: "info",
              category: "trend",
              title: "Historical reading",
              message: `Temperature ${entry.temperature}°C · Humidity ${entry.humidity}%`,
              deviceId: entry.deviceId,
              temperature: entry.temperature,
              humidity: entry.humidity,
            });
          }
        });

        return Array.from(logMap.values())
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, LOG_LIMIT);
      })();

      return {
        summary: {
          temperature,
          humidity,
          temperatureTrend,
          humidityTrend,
          lastUpdated: capturedAtIso,
          deviceId: BASE_DEVICE.id,
        },
        devices: nextDevices,
        alerts: convertedAlerts,
        logs: nextLogs,
        history: nextHistory,
        activeDeviceId: BASE_DEVICE.id,
        lastUpdated: capturedAtIso,
        banner: resolvedBanner,
        status: "online",
        error: null,
      };
    });
  }, []);

  const pollTelemetry = useCallback(async () => {
    if (modeRef.current === "mock") {
      return;
    }
    const activeToken = tokenRef.current;
    if (!activeToken) {
      return;
    }

    const client = clientRef.current;

    setState((current) => (current.status === "idle" ? { ...current, status: "loading", error: null } : current));

    try {
      const [readingPayload, alertMessagesPayload, alertHistoryPayload] = await Promise.all([
        client.fetchCurrentReading(activeToken),
        client.fetchAlertMessages(activeToken),
        client.fetchAlertHistory(activeToken, { limit: 24 }),
      ]);

      if (activeToken !== tokenRef.current) {
        return;
      }

      applyReadingUpdate(readingPayload, alertMessagesPayload, alertHistoryPayload);
    } catch (error) {
      if (activeToken !== tokenRef.current) {
        return;
      }

      setState((current) => ({
        ...current,
        status: "error",
        error: error?.message || "Unable to reach telemetry service.",
      }));
      activateMock();
    }
  }, [activateMock, applyReadingUpdate]);

  useEffect(() => {
    pollRef.current = pollTelemetry;
  }, [pollTelemetry]);

  useEffect(() => {
    if (!token) {
      return () => {};
    }

    deactivateMock();
    pollTelemetry();

    pollTimerRef.current = setInterval(() => {
      if (pollRef.current) {
        pollRef.current();
      }
    }, pollInterval);

    return () => {
      stopPolling();
    };
  }, [token, pollInterval, pollTelemetry, deactivateMock, stopPolling]);

  const setActiveDevice = useCallback((deviceId) => {
    if (!deviceId) {
      return;
    }
    // If in mock mode, call the mock service but also update local state optimistically
    if (modeRef.current === "mock") {
      const service = mockServiceRef.current;
      if (service && typeof service.setActiveDevice === "function") {
        try {
          service.setActiveDevice(deviceId);
        } catch (err) {
          // ignore service errors
        }
      }

      // Optimistically update UI so device switch feels immediate
      setState((current) => {
        if (!current.devices || !current.devices.some((d) => d.id === deviceId)) {
          return current;
        }

        if (current.activeDeviceId === deviceId) return current;

        return {
          ...current,
          devices: current.devices.map((device) => ({
            ...device,
            isActive: device.id === deviceId,
            status: device.id === deviceId ? "online" : device.status,
          })),
          activeDeviceId: deviceId,
          summary: {
            ...current.summary,
            deviceId,
            // attempt to set summary readings to the selected device readings
            temperature: (current.devices.find((d) => d.id === deviceId) || {}).temperature ?? current.summary.temperature,
            humidity: (current.devices.find((d) => d.id === deviceId) || {}).humidity ?? current.summary.humidity,
          },
        };
      });

      return;
    }

    // live mode: update state to mark the chosen device as active
    setState((current) => {
      if (!current.devices.some((device) => device.id === deviceId)) {
        return current;
      }

      if (current.activeDeviceId === deviceId) {
        return current;
      }

      const selected = current.devices.find((d) => d.id === deviceId) || {};

      return {
        ...current,
        devices: current.devices.map((device) => ({
          ...device,
          isActive: device.id === deviceId,
          status: device.id === deviceId ? "online" : device.status,
        })),
        activeDeviceId: deviceId,
        summary: {
          ...current.summary,
          deviceId,
          temperature: selected.temperature ?? current.summary.temperature,
          humidity: selected.humidity ?? current.summary.humidity,
        },
      };
    });
  }, []);

  const dismissBanner = useCallback((bannerId) => {
    if (!bannerId) {
      return;
    }

    dismissedBannerIdsRef.current.add(bannerId);
    setState((current) => (current.banner && current.banner.id === bannerId ? { ...current, banner: null } : current));
  }, []);

  const refresh = useCallback(() => {
    if (modeRef.current === "mock") {
      const service = mockServiceRef.current;
      if (service && typeof service.tick === "function") {
        service.tick();
      }
      return;
    }

    if (!tokenRef.current) {
      return;
    }

    setState((current) => ({ ...current, status: "loading", error: null }));

    if (pollRef.current) {
      pollRef.current();
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      ...state,
      mode,
      setActiveDevice,
      dismissBanner,
      refresh,
      // Expose controls so UI can force mock/live modes
      forceMock: activateMock,
      forceLive: deactivateMock,
    }),
    [mode, state, setActiveDevice, dismissBanner, refresh, activateMock, deactivateMock]
  );

  return <TelemetryContext.Provider value={contextValue}>{children}</TelemetryContext.Provider>;
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);

  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }

  return context;
}
