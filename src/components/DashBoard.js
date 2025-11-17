import React, { useMemo, useState } from "react";
import "../styles/DashBoard.css";
import HomePage from "./HomePage";
import DevicesPage from "./DevicesPage";
import MonitoringPage from "./MonitoringPage";
import LogsHistoryPage from "./LogsHistoryPage";
import SettingsPage from "./SettingsPage";
import { TelemetryProvider, useTelemetry } from "../hooks/TelemetryProvider";

const NAVIGATION_ITEMS = [
  {
    key: "home",
    label: "Home",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5 18.2998V11.6331C12.5 11.4121 12.4122 11.2002 12.2559 11.0439C12.0996 10.8876 11.8877 10.7998 11.6667 10.7998H8.33333C8.11232 10.7998 7.90036 10.8876 7.74408 11.0439C7.5878 11.2002 7.5 11.4121 7.5 11.6331V18.2998"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 9.13289C2.49994 8.89044 2.55278 8.65091 2.65482 8.43098C2.75687 8.21106 2.90566 8.01605 3.09083 7.85955L8.92417 2.85955C9.22499 2.60531 9.60613 2.46582 10 2.46582C10.3939 2.46582 10.775 2.60531 11.0758 2.85955L16.9092 7.85955C17.0943 8.01605 17.2431 8.21106 17.3452 8.43098C17.4472 8.65091 17.5001 8.89044 17.5 9.13289V16.6329C17.5 17.0749 17.3244 17.4988 17.0118 17.8114C16.6993 18.124 16.2754 18.2996 15.8333 18.2996H4.16667C3.72464 18.2996 3.30072 18.124 2.98816 17.8114C2.67559 17.4988 2.5 17.0749 2.5 16.6329V9.13289Z"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "devices",
    label: "Devices",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.5 7.46606C17.4997 7.17379 17.4225 6.88674 17.2763 6.6337C17.13 6.38066 16.9198 6.17053 16.6667 6.0244L10.8333 2.69106C10.58 2.54478 10.2926 2.46777 10 2.46777C9.70744 2.46777 9.42003 2.54478 9.16667 2.69106L3.33333 6.0244C3.08022 6.17053 2.86998 6.38066 2.72372 6.6337C2.57745 6.88674 2.5003 7.17379 2.5 7.46606V14.1327C2.5003 14.425 2.57745 14.7121 2.72372 14.9651C2.86998 15.2181 3.08022 15.4283 3.33333 15.5744L9.16667 18.9077C9.42003 19.054 9.70744 19.131 10 19.131C10.2926 19.131 10.58 19.054 10.8333 18.9077L16.6667 15.5744C16.9198 15.4283 17.13 15.2181 17.2763 14.9651C17.4225 14.7121 17.4997 14.425 17.5 14.1327V7.46606Z"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.75 6.63281L10 10.7995L17.25 6.63281"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 19.1331V10.7998"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "monitoring",
    label: "Monitoring",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.3334 10.8001H16.2667C15.9026 10.7994 15.5481 10.9179 15.2577 11.1376C14.9672 11.3573 14.7567 11.6661 14.6584 12.0168L12.7001 18.9835C12.6875 19.0267 12.6611 19.0648 12.6251 19.0918C12.589 19.1188 12.5452 19.1335 12.5001 19.1335C12.455 19.1335 12.4111 19.1188 12.3751 19.0918C12.339 19.0648 12.3127 19.0267 12.3001 18.9835L7.70008 2.6168C7.68746 2.57352 7.66114 2.53551 7.62508 2.50846C7.58902 2.48142 7.54516 2.4668 7.50008 2.4668C7.455 2.4668 7.41114 2.48142 7.37508 2.50846C7.33902 2.53551 7.3127 2.57352 7.30008 2.6168L5.34175 9.58346C5.2438 9.93276 5.03457 10.2406 4.7458 10.4601C4.45704 10.6797 4.10451 10.7991 3.74175 10.8001H1.66675"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "logs",
    label: "Logs & History",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.4999 2.4668H4.99992C4.55789 2.4668 4.13397 2.64239 3.82141 2.95495C3.50885 3.26751 3.33325 3.69144 3.33325 4.13346V17.4668C3.33325 17.9088 3.50885 18.3327 3.82141 18.6453C4.13397 18.9579 4.55789 19.1335 4.99992 19.1335H14.9999C15.4419 19.1335 15.8659 18.9579 16.1784 18.6453C16.491 18.3327 16.6666 17.9088 16.6666 17.4668V6.63346L12.4999 2.4668Z"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6667 2.4668V5.80013C11.6667 6.24216 11.8423 6.66608 12.1549 6.97864C12.4675 7.2912 12.8914 7.4668 13.3334 7.4668H16.6667"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.33341 8.2998H6.66675" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3334 11.6328H6.66675" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3334 14.9668H6.66675" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.05918 4.24692C8.10509 3.76387 8.32945 3.31529 8.68843 2.98882C9.0474 2.66235 9.5152 2.48145 10.0004 2.48145C10.4857 2.48145 10.9535 2.66235 11.3124 2.98882C11.6714 3.31529 11.8958 3.76387 11.9417 4.24692C11.9693 4.55897 12.0716 4.85977 12.2401 5.12387C12.4086 5.38797 12.6382 5.6076 12.9096 5.76415C13.1809 5.92071 13.486 6.00959 13.7989 6.02327C14.1119 6.03696 14.4235 5.97504 14.7075 5.84276C15.1484 5.64257 15.6481 5.61361 16.1092 5.76149C16.5703 5.90938 16.9599 6.22355 17.2021 6.64284C17.4443 7.06214 17.5219 7.55657 17.4197 8.0299C17.3175 8.50323 17.0429 8.9216 16.6492 9.20359C16.3928 9.38346 16.1836 9.62243 16.0391 9.90028C15.8946 10.1781 15.8192 10.4867 15.8192 10.7998C15.8192 11.113 15.8946 11.4216 16.0391 11.6994C16.1836 11.9772 16.3928 12.2162 16.6492 12.3961C17.0429 12.6781 17.3175 13.0964 17.4197 13.5698C17.5219 14.0431 17.4443 14.5375 17.2021 14.9568C16.9599 15.3761 16.5703 15.6903 16.1092 15.8382C15.6481 15.9861 15.1484 15.9571 14.7075 15.7569C14.4235 15.6246 14.1119 15.5627 13.7989 15.5764C13.486 15.5901 13.1809 15.679 12.9096 15.8355C12.6382 15.9921 12.4086 16.2117 12.2401 16.4758C12.0716 16.7399 11.9693 17.0407 11.9417 17.3528C11.8958 17.8358 11.6714 18.2844 11.3124 18.6109C10.9535 18.9373 10.4857 19.1182 10.0004 19.1182C9.5152 19.1182 9.0474 18.9373 8.68843 18.6109C8.32945 18.2844 8.10509 17.8358 8.05918 17.3528C8.03163 17.0406 7.92926 16.7397 7.76073 16.4755C7.5922 16.2113 7.36249 15.9916 7.09104 15.835C6.81959 15.6785 6.5144 15.5896 6.20133 15.576C5.88825 15.5624 5.57651 15.6245 5.29251 15.7569C4.85158 15.9571 4.35195 15.9861 3.89084 15.8382C3.42974 15.6903 3.04015 15.3761 2.79791 14.9568C2.55567 14.5375 2.47811 14.0431 2.58031 13.5698C2.68251 13.0964 2.95718 12.6781 3.35084 12.3961C3.60719 12.2162 3.81645 11.9772 3.96092 11.6994C4.10538 11.4216 4.1808 11.113 4.1808 10.7998C4.1808 10.4867 4.10538 10.1781 3.96092 9.90028C3.81645 9.62243 3.60719 9.38346 3.35084 9.20359C2.95773 8.92146 2.68355 8.50325 2.58159 8.03024C2.47964 7.55723 2.55718 7.06321 2.79916 6.64418C3.04114 6.22516 3.43027 5.91107 3.89092 5.76296C4.35157 5.61484 4.85083 5.64329 5.29168 5.84276C5.57564 5.97504 5.8873 6.03696 6.20026 6.02327C6.51322 6.00959 6.81829 5.92071 7.08962 5.76415C7.36096 5.6076 7.59059 5.38797 7.75906 5.12387C7.92754 4.85977 8.02991 4.55897 8.05751 4.24692"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.2998C11.3807 13.2998 12.5 12.1805 12.5 10.7998C12.5 9.41909 11.3807 8.2998 10 8.2998C8.61929 8.2998 7.5 9.41909 7.5 10.7998C7.5 12.1805 8.61929 13.2998 10 13.2998Z"
          stroke="#3D2914"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function DashboardContent({ user, onLogout }) {
  function TelemetryToggle() {
    const telemetry = useTelemetry();
    if (!telemetry) return null;

    const { mode, forceMock, forceLive } = telemetry;

    const handleToggle = () => {
      if (mode === 'mock') {
        if (typeof forceLive === 'function') forceLive();
      } else {
        if (typeof forceMock === 'function') forceMock();
      }
    };

    return (
      <button type="button" className="toolbar-button" onClick={handleToggle}>
        {mode === 'mock' ? 'Use Live Telemetry' : 'Use Mock Telemetry'}
      </button>
    );
  }
  const [activePage, setActivePage] = useState("home");
  const telemetry = useTelemetry();

  const pageContent = useMemo(() => {
    switch (activePage) {
      case "devices":
        return <DevicesPage />;
      case "monitoring":
        return <MonitoringPage />;
      case "logs":
        return <LogsHistoryPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage user={user} />;
    }
  }, [activePage, user]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.80083 5.75638C6.53833 4.50149 7.65512 3.31878 9.06743 2.27612L9.21668 2.27511L10.4435 2.27441M7.47578 2.49325C7.59712 2.4687 7.71947 2.44642 7.84271 2.42645C11.1052 3.80307 13.6331 5.77866 14.9552 7.97877M12.7648 2.27441L13.3211 2.27503C13.6153 2.27502 13.9066 2.28855 14.1939 2.31499C15.5813 3.34854 16.6792 4.51727 17.4074 5.75638M8.65625 7.97877C9.95018 5.83279 12.3992 3.90113 15.5606 2.53337C15.6999 2.56268 15.8378 2.59533 15.9742 2.63089M21.3843 8.35791L21.6461 9.37027C22.2068 11.5387 20.9034 13.7512 18.735 14.3119C18.4034 14.3976 18.0623 14.441 17.7198 14.441L5.21377 14.4413C2.974 14.4413 1.1582 12.6257 1.1582 10.3859C1.1582 10.0434 1.20159 9.70219 1.28734 9.37054L1.54906 8.35841C2.47508 4.7771 5.70594 2.27534 9.40505 2.27515H13.5285C17.2274 2.27515 20.4583 4.7767 21.3843 8.35791Z" fill="white"/>
              </svg>
            </div>
            <h1 className="logo-text">Shelvy</h1>
          </div>
        </div>

        <div className="welcome-section">
          <p className="greeting">Hello! 👋</p>
          <h3 className="welcome-title">Welcome back</h3>
          <p className="dashboard-subtitle">{user?.displayName || user?.username || "Baker Dashboard"}</p>
        </div>

        <nav className="navigation">
          {NAVIGATION_ITEMS.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${activePage === item.key ? "active" : ""}`}
              onClick={() => setActivePage(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="logout-section">
          <div className="nav-item logout" onClick={onLogout}>
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3333 14.3665L17.4999 10.1999L13.3333 6.0332" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 10.2002H7.5" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 17.7002H4.16667C3.72464 17.7002 3.30072 17.5246 2.98816 17.212C2.67559 16.8995 2.5 16.4756 2.5 16.0335V4.36686C2.5 3.92483 2.67559 3.50091 2.98816 3.18835C3.30072 2.87579 3.72464 2.7002 4.16667 2.7002H7.5" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '8px 16px'}}>
          {/* Manual mock toggle for development/testing */}
          <TelemetryToggle />
        </div>
        {telemetry.banner && (
          <div className={`alert-banner ${telemetry.banner.severity}`}>
            <div>
              <strong>{telemetry.banner.title}</strong>
              <span>{telemetry.banner.message}</span>
              {telemetry.banner.deviceName && (
                <div className="banner-device">
                  <small>{telemetry.banner.deviceName} — {telemetry.banner.deviceLocation}</small>
                </div>
              )}
            </div>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <button
                type="button"
                className="view-alerts-btn"
                onClick={() => {
                  if (typeof telemetry.setActiveDevice === 'function' && telemetry.banner.deviceId) {
                    telemetry.setActiveDevice(telemetry.banner.deviceId);
                  }
                  setActivePage('logs');
                }}
              >
                View Alerts
              </button>
              <button type="button" onClick={() => telemetry.dismissBanner(telemetry.banner.id)}>
                Dismiss
              </button>
            </div>
          </div>
        )}

        {telemetry.status === "error" && telemetry.error && (
          <div className="alert-banner warning">
            <div>
              <strong>Telemetry disconnected</strong>
              <span>{telemetry.error}</span>
            </div>
            <button type="button" onClick={telemetry.refresh}>
              Retry
            </button>
          </div>
        )}

        {pageContent}
      </div>
    </div>
  );
}

export default function Dashboard({ user, token, apiBaseUrl, onLogout }) {
  return (
    <TelemetryProvider token={token} baseUrl={apiBaseUrl}>
      <DashboardContent user={user} onLogout={onLogout} />
    </TelemetryProvider>
  );
}
