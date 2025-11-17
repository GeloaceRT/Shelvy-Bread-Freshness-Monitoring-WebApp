import React, { useMemo, useState } from "react";
import { useTelemetry } from "../hooks/TelemetryProvider";

const formatTimestamp = (isoDate) => {
  if (!isoDate) {
    return "--";
  }

  const date = new Date(isoDate);
  const day = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { label: `${day} · ${time}`, raw: date.getTime() };
};

const groupByDay = (entries) => {
  const groups = new Map();
  entries.forEach((entry) => {
    const dayKey = new Date(entry.timestamp).toDateString();
    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }
    groups.get(dayKey).push(entry);
  });

  return Array.from(groups.entries()).map(([dayKey, values]) => ({
    day: dayKey,
    values: values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  }));
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "alert", label: "Alerts" },
  { value: "trend", label: "Trends" },
  { value: "reading", label: "Readings" },
];

const SEVERITY_CLASS_MAP = {
  critical: "log-critical",
  warning: "log-warning",
  success: "log-success",
  info: "log-info",
};

export default function LogsHistoryPage() {
  const telemetry = useTelemetry();
  const logs = telemetry?.logs || [];
  const alerts = telemetry?.alerts || [];
  const devices = telemetry?.devices || [];
  const { refresh } = telemetry || {};
  const canRefresh = typeof refresh === "function";
  const handleRefresh = canRefresh ? refresh : () => {};
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    // Merge explicit alerts into the timeline so the Alerts filter shows alert records
    const alertsAsLogs = (alerts || []).map((a) => ({
      id: a.id,
      timestamp: a.timestamp,
      deviceId: a.deviceId,
      event: a.title,
      title: a.title,
      message: a.value || a.message || "",
      type: "alert",
      category: "alert",
      severity: a.severity || "critical",
    }));

    // Build a map to avoid duplicates (prefer logs entries over alertsAsLogs when id matches)
    const mergedMap = new Map();
    logs.forEach((l) => mergedMap.set(l.id, l));
    alertsAsLogs.forEach((a) => {
      if (!mergedMap.has(a.id)) {
        mergedMap.set(a.id, a);
      }
    });

    const combined = Array.from(mergedMap.values());

    return combined.filter((log) => {
      const typeKey = (log.category || log.type || "").toLowerCase();
      const matchesFilter =
        filter === "all" || (filter === "alert" ? typeKey === "alert" : typeKey === filter);
      const matchesSearch = search
        ? (log.message || "").toLowerCase().includes(search.toLowerCase()) ||
          (log.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (log.deviceId || "").toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [logs, alerts, filter, search]);

  const groupedLogs = useMemo(() => groupByDay(filteredLogs), [filteredLogs]);

  const resolveDevice = (deviceId) => devices.find((device) => device.id === deviceId);

  const findAlertForLog = (log) => {
    if (!log || !alerts || alerts.length === 0) return null;
    // match by id first
    const byId = alerts.find((a) => a.id === log.id);
    if (byId) return byId;
    // otherwise match by device and timestamp (within 5s)
    const logTs = log.timestamp ? new Date(log.timestamp).getTime() : null;
    if (logTs) {
      const match = alerts.find((a) => {
        if (!a.timestamp || a.deviceId !== log.deviceId) return false;
        const aTs = new Date(a.timestamp).getTime();
        return Math.abs(aTs - logTs) <= 5000;
      });
      if (match) return match;
    }
    // lastly try by deviceId and title similarity
    return alerts.find((a) => a.deviceId === log.deviceId && a.title && log.event && a.title.includes(log.event)) || null;
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Logs &amp; History</h1>
          <p className="page-subtitle">Review sensor readings, alerts, and stability markers in one place.</p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="toolbar-button" onClick={handleRefresh} disabled={!canRefresh}>
            Refresh
          </button>
        </div>
      </div>

      <div className="page-main-content">
        <div className="logs-controls">
          <div className="logs-filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`logs-filter-chip ${filter === option.value ? "active" : ""}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="logs-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
          />
        </div>

        <div className="logs-timeline">
          {groupedLogs.length === 0 && (
            <div className="logs-empty">
              <p>No log entries captured yet. Adjust filters or wait for new telemetry events.</p>
            </div>
          )}

          {groupedLogs.map((group) => (
            <section className="logs-day-section" key={group.day}>
              <header className="logs-day-header">
                <h2>{group.day}</h2>
                <span>{group.values.length} event{group.values.length === 1 ? "" : "s"}</span>
              </header>

              <div className="logs-timeline-list">
                {group.values.map((log) => {
                  const device = resolveDevice(log.deviceId);
                  const deviceLabel = device ? `${device.name} · ${device.location}` : log.deviceId;
                  const timestampInfo = formatTimestamp(log.timestamp);
                  // If this is an alert log, prefer showing the alert record details
                  const matchedAlert = findAlertForLog(log);
                  const severity = (matchedAlert?.severity || log.severity || "info").toLowerCase();
                  const categoryLabel = (matchedAlert ? "ALERT" : (log.category || log.type || "EVENT")).toUpperCase();
                  const badgeClass = SEVERITY_CLASS_MAP[severity] || "log-info";

                  return (
                    <article className={`log-timeline-item ${badgeClass}`} key={log.id}>
                      <div className="log-timestamp-stack">
                        <span className="log-time-label">{timestampInfo.label}</span>
                        <span className="log-device">{deviceLabel}</span>
                      </div>

                      <div className="log-body">
                        <span className={`log-badge ${badgeClass}`}>{categoryLabel}</span>
                        <div className="log-copy">
                          <p className="log-title">{matchedAlert?.title || log.title || log.event || "Telemetry event"}</p>
                          <p className="log-message">{matchedAlert?.value || log.message || ""}</p>
                        </div>
                      </div>

                      {(log.temperature !== undefined || log.humidity !== undefined || log.value) && (
                        <div className="log-metrics">
                          {log.temperature !== undefined && log.temperature !== null && (
                            <span>Temp {log.temperature}°C</span>
                          )}
                          {log.humidity !== undefined && log.humidity !== null && (
                            <span>Humidity {log.humidity}%</span>
                          )}
                          {log.value && <span>{log.value}</span>}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
