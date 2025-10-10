import React, { useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [showLogs, setShowLogs] = useState(false);

  const logs = [
    { event: "Humidity back to normal", time: "02:45 PM" },
    { event: "Sensor calibration check", time: "02:45 PM" },
    { event: "New batch started", time: "02:45 PM" },
    { event: "Sensor calibration check", time: "02:44 PM" },
    { event: "Humidity back to normal", time: "02:44 PM" },
    { event: "New batch started", time: "02:44 PM" },
  ];

  return (
    <div className="dashboard">
      <header className="header">
        <h2>🍞 Shelvy Dashboard</h2>
        <button className="menu-btn" onClick={() => setShowLogs(!showLogs)}>
          ☰
        </button>
      </header>

      {!showLogs ? (
        <div className="monitor-section">
          <h3>Monitor Levels</h3>
          <div className="monitor-cards">
            <div className="card humidity">
              <h4>46%</h4>
              <p>Humidity</p>
              <small>Optimal: 45–65%</small>
            </div>
            <div className="card temperature">
              <h4>24°C</h4>
              <p>Temperature</p>
              <small>Optimal: 18–23°C</small>
            </div>
          </div>

          <div className="bread-list">
            <div className="bread-card">
              <strong>Sourdough</strong>
              <p>Humidity: 55%</p>
              <p>Temp: 22°C</p>
              <p>Freshness: 85%</p>
            </div>
            <div className="bread-card">
              <strong>Whole Wheat</strong>
              <p>Humidity: 45%</p>
              <p>Temp: 24°C</p>
              <p>Freshness: 70%</p>
            </div>
            <div className="bread-card">
              <strong>Artisan Loaf</strong>
              <p>Humidity: 60%</p>
              <p>Temp: 21°C</p>
              <p>Freshness: 90%</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="logs-section">
          <h3>Logs & History</h3>
          <div className="logs-list">
            {logs.map((log, index) => (
              <div key={index} className="log-item">
                <p>{log.event}</p>
                <small>{log.time}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
