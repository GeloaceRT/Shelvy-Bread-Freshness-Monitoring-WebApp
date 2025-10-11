import React from "react";
import { useTelemetry } from "../hooks/TelemetryProvider";

function formatTimestamp(isoDate) {
  if (!isoDate) {
    return "--";
  }

  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

export default function LogsHistoryPage() {
  const telemetry = useTelemetry();
  const logs = telemetry?.logs || [];
  const devices = telemetry?.devices || [];

  const resolveDevice = (deviceId) => devices.find((device) => device.id === deviceId);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Logs &amp; History</h1>
      </div>

      <div className="page-main-content">
        <div className="logs-list">
          {logs.length === 0 && (
            <div className="log-item log-info">
              <div>
                <p className="log-message">No events captured yet.</p>
                <p className="log-meta">Start the telemetry stream to generate log entries.</p>
              </div>
            </div>
          )}

          {logs.map((log) => {
            const device = resolveDevice(log.deviceId);
            const deviceLabel = device ? `${device.name} · ${device.location}` : log.deviceId;
            const logClass = log.type === "alert" ? "log-alert" : log.type === "metric" ? "log-metric" : "log-info";

            return (
              <div className={`log-item ${logClass}`} key={log.id}>
                <div>
                  <p className="log-message">{log.event}</p>
                  <p className="log-meta">{deviceLabel}</p>
                </div>
                <span className="log-timestamp">{formatTimestamp(log.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
