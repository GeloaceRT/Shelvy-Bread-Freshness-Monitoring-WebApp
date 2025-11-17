import React, { useMemo, useState } from "react";
import { useTelemetry } from "../hooks/TelemetryProvider";

function formatRelativeTime(isoDate) {
  if (!isoDate) {
    return "just now";
  }

  const diffMs = Math.max(0, Date.now() - new Date(isoDate).getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "moments ago";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function getStatusLabel(device) {
  if (device.isActive && device.status === "online") {
    return "Live";
  }

  if (device.status === "online") {
    return "Standby";
  }

  return "Offline";
}

const BATTERY_STATUS = {
  high: 70,
  medium: 30,
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "standby", label: "Standby" },
  { value: "offline", label: "Offline" },
];

const categorizeBattery = (value) => {
  if (value === null || value === undefined) {
    return "unknown";
  }
  if (value >= BATTERY_STATUS.high) {
    return "high";
  }
  if (value >= BATTERY_STATUS.medium) {
    return "medium";
  }
  return "low";
};

export default function DevicesPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { devices = [], setActiveDevice, summary, refresh } = useTelemetry();
  const canRefresh = typeof refresh === "function";
  const handleRefresh = canRefresh ? refresh : () => {};
  const activeDeviceId = summary?.deviceId;

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesFilter = (() => {
        if (filter === "all") {
          return true;
        }
        if (filter === "live") {
          return device.status === "online" && device.isActive;
        }
        if (filter === "standby") {
          return device.status === "online" && !device.isActive;
        }
        if (filter === "offline") {
          return device.status !== "online";
        }
        return true;
      })();

      const matchesSearch = search
        ? device.name.toLowerCase().includes(search.toLowerCase()) ||
          device.location.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesFilter && matchesSearch;
    });
  }, [devices, filter, search]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Devices</h1>
        <div className="page-header-actions">
          <button type="button" className="toolbar-button" onClick={handleRefresh} disabled={!canRefresh}>
            Refresh
          </button>
        </div>
      </div>

      <div className="page-main-content">
        <div className="devices-toolbar">
          <div className="devices-toolbar-group">
            <p className="devices-count">{devices.length} device{devices.length === 1 ? "" : "s"} connected</p>
            <div className="device-filters">
              <select className="device-filter-select" value={filter} onChange={(event) => setFilter(event.target.value)}>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="search"
                className="device-filter-search"
                placeholder="Search devices"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <button type="button" className="add-device-button" disabled>
            + Add device
          </button>
        </div>

        <div className="devices-grid">
          {filteredDevices.map((device) => {
            const isActiveDevice = device.id === activeDeviceId;
            // Treat the selected active device as live in the UI immediately
            const statusLabel = getStatusLabel({ ...device, isActive: isActiveDevice, status: isActiveDevice ? 'online' : device.status });
            const isLive = isActiveDevice;
            const batteryCategory = categorizeBattery(device.battery);

            return (
              <div className={`device-card ${isActiveDevice ? "device-card-active" : ""}`} key={device.id}>
                <div className="device-card-header">
                  <div>
                    <h2 className="device-card-title">{device.name}</h2>
                    <p className="device-card-location">{device.location}</p>
                  </div>
                  <span className={`device-status-pill ${isLive ? "device-status-live" : ""}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="device-metrics">
                  <div className="device-metric">
                    <span className="device-metric-label">Temperature</span>
                    <span className="device-metric-value">{device.temperature}°C</span>
                  </div>
                  <div className="device-metric">
                    <span className="device-metric-label">Humidity</span>
                    <span className="device-metric-value">{device.humidity}%</span>
                  </div>
                  <div className="device-metric">
                    <span className="device-metric-label">Battery</span>
                    <span className={`device-metric-value battery-${batteryCategory}`}>
                      {device.battery !== null && device.battery !== undefined ? `${device.battery}%` : "—"}
                    </span>
                  </div>
                </div>

                <div className="device-card-footer">
                  <span className="device-last-update">Updated {formatRelativeTime(device.lastUpdated)}</span>
                </div>

                {setActiveDevice && (
                  <button
                    className="device-select-button"
                    type="button"
                    onClick={() => setActiveDevice(device.id)}
                    disabled={isActiveDevice}
                  >
                    {isActiveDevice ? "Active on dashboard" : "Set as active"}
                  </button>
                )}
              </div>
            );
          })}

          {filteredDevices.length === 0 && (
            <div className="page-content-container">
              <div className="page-icon-container">
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35.31 14.2534C35.3094 13.6689 35.1551 13.0948 34.8626 12.5887C34.57 12.0826 34.1496 11.6624 33.6433 11.3701L21.9767 4.70342C21.4699 4.41086 20.8951 4.25684 20.31 4.25684C19.7249 4.25684 19.1501 4.41086 18.6433 4.70342L6.97666 11.3701C6.47044 11.6624 6.04996 12.0826 5.75743 12.5887C5.4649 13.0948 5.3106 13.6689 5.31 14.2534V27.5868C5.3106 28.1713 5.4649 28.7454 5.75743 29.2515C6.04996 29.7576 6.47044 30.1778 6.97666 30.4701L18.6433 37.1368C19.1501 37.4293 19.7249 37.5833 20.31 37.5833C20.8951 37.5833 21.4699 37.4293 21.9767 37.1368L33.6433 30.4701C34.1496 30.1778 34.57 29.7576 34.8626 29.2515C35.1551 28.7454 35.3094 28.1713 35.31 27.5868V14.2534Z" stroke="#D97706" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.81 12.5869L20.31 20.9202L34.81 12.5869" stroke="#D97706" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.31 37.5866V20.9199" stroke="#D97706" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="page-description">No devices match the current filters. Adjust search or connect a device.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
