import React, { useMemo } from "react";
import { useTelemetry } from "../hooks/TelemetryProvider";
import LiveWebcam from './LiveWebcam';

function formatClock(isoDate) {
  if (!isoDate) {
    return '--';
  }

  const date = new Date(isoDate);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatSigned(value, unit) {
  if (value === null || value === undefined) {
    return `0${unit}`;
  }

  const rounded = Math.abs(value) < 0.05 ? 0 : Number(value.toFixed(1));

  if (rounded === 0) {
    return `0${unit}`;
  }

  const prefix = rounded > 0 ? '+' : '';
  return `${prefix}${rounded}${unit}`;
}

function formatRelativeTime(isoDate) {
  if (!isoDate) {
    return 'moments ago';
  }

  const diffMs = Math.max(0, Date.now() - new Date(isoDate).getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'moments ago';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export default function MonitoringPage() {
  const telemetry = useTelemetry();
  const { devices = [], history = [], summary, logs = [], refresh, status } = telemetry || {};
  const canRefresh = typeof refresh === "function";
  const handleRefresh = canRefresh ? refresh : () => {};

  const activeDevice = devices.find((device) => device.isActive) || devices[0];

  const activeHistory = useMemo(() => {
    if (!activeDevice) {
      return [];
    }

    return history.filter((entry) => entry.deviceId === activeDevice.id).slice(0, 12);
  }, [history, activeDevice]);

  const recentEvents = useMemo(() => logs.slice(0, 12), [logs]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Monitoring</h1>
      </div>

      <div className="page-main-content">
        <div className="page-toolbar">
          <button
            type="button"
            className="toolbar-button"
            onClick={handleRefresh}
            disabled={!canRefresh || status === "loading"}
          >
            {status === "loading" ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="monitoring-overview">

          <div className="monitoring-card">
            <h2 className="monitoring-card-title">Live Feed</h2>
            <LiveWebcam />
          </div>
          
          <div className="monitoring-card">
            <h2 className="monitoring-card-title">Live Snapshot</h2>
            {summary && activeDevice ? (
              <div className="monitoring-snapshot">
                <div>
                  <span className="monitoring-label">Active device</span>
                  <span className="monitoring-value">{activeDevice.name}</span>
                </div>
                <div>
                  <span className="monitoring-label">Temperature</span>
                  <span className="monitoring-value">{summary.temperature}°C</span>
                </div>
                <div>
                  <span className="monitoring-label">Humidity</span>
                  <span className="monitoring-value">{summary.humidity}%</span>
                </div>
                <div>
                  <span className="monitoring-label">Trend (temp)</span>
                  <span className="monitoring-value">{formatSigned(summary.temperatureTrend, '°C')}</span>
                </div>
                <div>
                  <span className="monitoring-label">Trend (humidity)</span>
                  <span className="monitoring-value">{formatSigned(summary.humidityTrend, '%')}</span>
                </div>
                <div>
                  <span className="monitoring-label">Last ping</span>
                  <span className="monitoring-value">{formatClock(summary.lastUpdated)}</span>
                </div>
              </div>
            ) : (
              <p className="page-description">No live telemetry yet. Start the stream to monitor readings.</p>
            )}
          </div>

          <div className="monitoring-card">
            <h2 className="monitoring-card-title">Recent Readings</h2>
            <div className="monitoring-history">
              {activeHistory.length === 0 && <p className="monitoring-empty">No readings recorded for the active device.</p>}
              {activeHistory.map((entry) => (
                <div className="monitoring-history-row" key={entry.id}>
                  <div>
                    <span className="monitoring-history-time">{formatClock(entry.timestamp)}</span>
                    <span className="monitoring-history-relative">{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                  <div className="monitoring-history-values">
                    <span>{entry.temperature}°C</span>
                    <span>{entry.humidity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="monitoring-card">
          <h2 className="monitoring-card-title">All Device Pings</h2>
          <div className="monitoring-event-stream">
            {recentEvents.length === 0 && <p className="monitoring-empty">Waiting for telemetry updates...</p>}
            {recentEvents.map((entry) => {
              const device = devices.find((item) => item.id === entry.deviceId);
              const severityClass = entry.severity ? entry.severity.toLowerCase() : "info";
              return (
                <div className={`monitoring-event-row ${severityClass}`} key={entry.id}>
                  <div>
                    <span className="monitoring-event-device">{device ? device.name : entry.deviceId}</span>
<<<<<<< Updated upstream
                    <span className="monitoring-event-location">{device ? device.location : 'Unknown location'}</span>
=======
                    <span className="monitoring-event-location">{device ? device.location : "Unknown location"}</span>
                    <span className={`monitoring-event-tag ${severityClass}`}>{entry.category || entry.severity || "INFO"}</span>
>>>>>>> Stashed changes
                  </div>
                  <div className="monitoring-event-values">
                    <span>{entry.temperature !== undefined && entry.temperature !== null ? `${entry.temperature}°C` : "—"}</span>
                    <span>{entry.humidity !== undefined && entry.humidity !== null ? `${entry.humidity}%` : "—"}</span>
                    <span>{formatClock(entry.timestamp)}</span>
                  </div>
                  <p className="monitoring-event-message">{entry.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}