import React from "react";

export default function HomePage({ user }) {
  const isCasing1Active = false; // toggle to true to restore active monitoring visuals

  return (
    <>
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="content-wrapper">
        {/* Monitor Cards */}
        <div className="monitor-cards-section">
          <div className="monitor-card humidity-card">
            <div className="card-header">
              <h3>Humidity</h3>
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>Live</span>
              </div>
            </div>
            <div className="card-content">
              <div className="icon-section">
                <svg width="32" height="32" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.48348 22.3327C12.4168 22.3327 14.8168 19.8927 14.8168 16.9327C14.8168 15.386 14.0568 13.9193 12.5368 12.6793C11.0168 11.4393 9.87015 9.59935 9.48348 7.66602C9.09681 9.59935 7.96348 11.4527 6.43015 12.6793C4.89681 13.906 4.15015 15.3993 4.15015 16.9327C4.15015 19.8927 6.55015 22.3327 9.48348 22.3327Z" stroke="#3D2914" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.8967 9.39931C17.8137 7.93414 18.4638 6.31804 18.8167 4.62598C19.4834 7.95931 21.4834 11.1593 24.15 13.2926C26.8167 15.426 28.15 17.9593 28.15 20.626C28.1576 22.469 27.6178 24.2729 26.5991 25.8088C25.5803 27.3447 24.1284 28.5435 22.4275 29.2533C20.7266 29.9631 18.8532 30.1519 17.0449 29.7957C15.2366 29.4395 13.5747 28.5544 12.27 27.2526" stroke="#3D2914" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="measurement-type">Relative Humidity</p>
              <h2 className="measurement-value">60%</h2>
            </div>
            <p className="optimal-range">Optimal range: 50-70%</p>
            <div className="timestamp">
              <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.75 6.59961V12.5996L16.75 14.5996" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.75 22.5996C18.2728 22.5996 22.75 18.1225 22.75 12.5996C22.75 7.07676 18.2728 2.59961 12.75 2.59961C7.22715 2.59961 2.75 7.07676 2.75 12.5996C2.75 18.1225 7.22715 22.5996 12.75 22.5996Z" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>2 minutes ago</span>
            </div>
          </div>

          <div className="monitor-card temperature-card">
            <div className="card-header">
              <h3>Temperature</h3>
              <div className="trend-indicator">
                <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.3252 7.59961H22.3252V13.5996" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22.3252 7.59961L13.8252 16.0996L8.8252 11.0996L2.3252 17.5996" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>+2°C</span>
              </div>
            </div>
            <div className="card-content">
              <div className="icon-section">
                <svg width="32" height="32" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.1294 5.93327V19.9866C20.1462 20.5736 20.9408 21.4797 21.3901 22.5644C21.8394 23.6491 21.9182 24.8517 21.6143 25.9858C21.3105 27.1198 20.6409 28.1219 19.7095 28.8366C18.778 29.5513 17.6368 29.9387 16.4627 29.9387C15.2887 29.9387 14.1474 29.5513 13.216 28.8366C12.2846 28.1219 11.615 27.1198 11.3111 25.9858C11.0073 24.8517 11.0861 23.6491 11.5354 22.5644C11.9847 21.4797 12.7793 20.5736 13.7961 19.9866V5.93327C13.7961 5.22602 14.077 4.54775 14.5771 4.04765C15.0772 3.54755 15.7555 3.2666 16.4627 3.2666C17.17 3.2666 17.8483 3.54755 18.3483 4.04765C18.8484 4.54775 19.1294 5.22602 19.1294 5.93327Z" stroke="#F54900" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="measurement-type">Air Temperature</p>
              <h2 className="measurement-value">25°C</h2>
            </div>
            <p className="optimal-range">Optimal range: 20-30°C</p>
            <div className="timestamp">
              <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0625 6.59961V12.5996L16.0625 14.5996" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.0625 22.5996C17.5853 22.5996 22.0625 18.1225 22.0625 12.5996C22.0625 7.07676 17.5853 2.59961 12.0625 2.59961C6.53965 2.59961 2.0625 7.07676 2.0625 12.5996C2.0625 18.1225 6.53965 22.5996 12.0625 22.5996Z" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>2 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Device Connected Section */}
        <div className="device-section">
          <h2>Current Device Connected</h2>
          
          <div className="device-list">
            {/* Device 1 */}
            <div className={`device-item ${isCasing1Active ? "active-device" : ""}`}>
              <div className="device-header">
                <div className="device-info">
                  <div className={`device-icon ${isCasing1Active ? "active" : ""}`}>
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2002 8.39932C21.1998 8.04859 21.1073 7.70413 20.9317 7.40048C20.7562 7.09683 20.5039 6.84468 20.2002 6.66932L13.2002 2.66932C12.8962 2.49378 12.5513 2.40137 12.2002 2.40137C11.8491 2.40137 11.5042 2.49378 11.2002 2.66932L4.2002 6.66932C3.89646 6.84468 3.64418 7.09683 3.46866 7.40048C3.29314 7.70413 3.20056 8.04859 3.2002 8.39932V16.3993C3.20056 16.75 3.29314 17.0945 3.46866 17.3982C3.64418 17.7018 3.89646 17.954 4.2002 18.1293L11.2002 22.1293C11.5042 22.3049 11.8491 22.3973 12.2002 22.3973C12.5513 22.3973 12.8962 22.3049 13.2002 22.1293L20.2002 18.1293C20.5039 17.954 20.7562 17.7018 20.9317 17.3982C21.1073 17.0945 21.1998 16.75 21.2002 16.3993V8.39932Z" stroke={isCasing1Active ? "#D97706" : "#78716C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.50024 7.39941L12.2002 12.3994L20.9002 7.39941" stroke={isCasing1Active ? "#D97706" : "#78716C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.2002 22.3994V12.3994" stroke={isCasing1Active ? "#D97706" : "#78716C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="device-details">
                    <h4>Casing 1</h4>
                    {isCasing1Active && (
                      <div className="connection-status">
                        <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.4502 20.3994H12.4602" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.4502 9.21907C5.20031 6.7593 8.76053 5.39941 12.4502 5.39941C16.1399 5.39941 19.7001 6.7593 22.4502 9.21907" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.4502 13.258C7.31948 11.4257 9.83267 10.3994 12.4502 10.3994C15.0677 10.3994 17.5809 11.4257 19.4502 13.258" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.9502 16.8287C9.88484 15.9126 11.1414 15.3994 12.4502 15.3994C13.759 15.3994 15.0156 15.9126 15.9502 16.8287" stroke="#3D2914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Connected</span>
                      </div>
                    )}
                    <p className="device-location">📍 Bakery Floor - Section A</p>
                  </div>
                </div>
              </div>
              <div className="device-readings">
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.667 3.53288V12.3162C12.3025 12.6831 12.7991 13.2494 13.0799 13.9274C13.3607 14.6053 13.41 15.3569 13.2201 16.0657C13.0302 16.7745 12.6117 17.4008 12.0295 17.8475C11.4474 18.2942 10.7341 18.5363 10.0003 18.5363C9.26655 18.5363 8.55327 18.2942 7.97112 17.8475C7.38898 17.4008 6.97049 16.7745 6.78057 16.0657C6.59066 15.3569 6.63992 14.6053 6.92073 13.9274C7.20153 13.2494 7.69819 12.6831 8.33366 12.3162V3.53288C8.33366 3.09085 8.50926 2.66693 8.82182 2.35437C9.13438 2.04181 9.5583 1.86621 10.0003 1.86621C10.4424 1.86621 10.8663 2.04181 11.1788 2.35437C11.4914 2.66693 11.667 3.09085 11.667 3.53288Z" stroke="#F54900" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Temp:</span>
                  </div>
                  <span className="reading-value">25°C</span>
                </div>
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83358 14.3825C7.66691 14.3825 9.16691 12.8575 9.16691 11.0075C9.16691 10.0408 8.69191 9.12415 7.74191 8.34915C6.79191 7.57415 6.07524 6.42415 5.83358 5.21582C5.59191 6.42415 4.88358 7.58249 3.92524 8.34915C2.96691 9.11582 2.50024 10.0492 2.50024 11.0075C2.50024 12.8575 4.00024 14.3825 5.83358 14.3825Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.4669 6.29876C11.04 5.38303 11.4463 4.37297 11.6669 3.31543C12.0835 5.39876 13.3335 7.39876 15.0002 8.7321C16.6669 10.0654 17.5002 11.6488 17.5002 13.3154C17.505 14.4673 17.1676 15.5947 16.5309 16.5547C15.8941 17.5146 14.9867 18.2639 13.9236 18.7075C12.8606 19.1511 11.6897 19.2691 10.5595 19.0465C9.4293 18.8239 8.39064 18.2707 7.5752 17.4571" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Humidity:</span>
                  </div>
                  <span className="reading-value">60%</span>
                </div>
              </div>
              {isCasing1Active && (
                <div className="device-status">
                  <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2877 18.5329C14.8901 18.5329 18.621 14.8019 18.621 10.1995C18.621 5.59717 14.8901 1.86621 10.2877 1.86621C5.68531 1.86621 1.95435 5.59717 1.95435 10.1995C1.95435 14.8019 5.68531 18.5329 10.2877 18.5329Z" stroke="#D97706" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.7876 10.1989L9.45426 11.8656L12.7876 8.53223" stroke="#D97706" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Active Monitoring Device</span>
                </div>
              )}
            </div>

            {/* Device 2 */}
            <div className="device-item">
              <div className="device-header">
                <div className="device-info">
                  <div className="device-icon">
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2002 8.39932C21.1998 8.04859 21.1073 7.70413 20.9317 7.40048C20.7562 7.09683 20.5039 6.84468 20.2002 6.66932L13.2002 2.66932C12.8962 2.49378 12.5513 2.40137 12.2002 2.40137C11.8491 2.40137 11.5042 2.49378 11.2002 2.66932L4.2002 6.66932C3.89646 6.84468 3.64418 7.09683 3.46866 7.40048C3.29314 7.70413 3.20056 8.04859 3.2002 8.39932V16.3993C3.20056 16.75 3.29314 17.0945 3.46866 17.3982C3.64418 17.7018 3.89646 17.954 4.2002 18.1293L11.2002 22.1293C11.5042 22.3049 11.8491 22.3973 12.2002 22.3973C12.5513 22.3973 12.8962 22.3049 13.2002 22.1293L20.2002 18.1293C20.5039 17.954 20.7562 17.7018 20.9317 17.3982C21.1073 17.0945 21.1998 16.75 21.2002 16.3993V8.39932Z" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.50024 7.39941L12.2002 12.3994L20.9002 7.39941" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.2002 22.3994V12.3994" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="device-details">
                    <h4>Casing 2</h4>
                    <p className="device-location">📍 Section B</p>
                  </div>
                </div>
              </div>
              <div className="device-readings">
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.667 3.53288V12.3162C12.3025 12.6831 12.7991 13.2494 13.0799 13.9274C13.3607 14.6053 13.41 15.3569 13.2201 16.0657C13.0302 16.7745 12.6117 17.4008 12.0295 17.8475C11.4474 18.2942 10.7341 18.5363 10.0003 18.5363C9.26655 18.5363 8.55327 18.2942 7.97112 17.8475C7.38898 17.4008 6.97049 16.7745 6.78057 16.0657C6.59066 15.3569 6.63992 14.6053 6.92073 13.9274C7.20153 13.2494 7.69819 12.6831 8.33366 12.3162V3.53288C8.33366 3.09085 8.50926 2.66693 8.82182 2.35437C9.13438 2.04181 9.5583 1.86621 10.0003 1.86621C10.4424 1.86621 10.8663 2.04181 11.1788 2.35437C11.4914 2.66693 11.667 3.09085 11.667 3.53288Z" stroke="#F54900" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Temp:</span>
                  </div>
                  <span className="reading-value">23°C</span>
                </div>
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83358 14.3825C7.66691 14.3825 9.16691 12.8575 9.16691 11.0075C9.16691 10.0408 8.69191 9.12415 7.74191 8.34915C6.79191 7.57415 6.07524 6.42415 5.83358 5.21582C5.59191 6.42415 4.88358 7.58249 3.92524 8.34915C2.96691 9.11582 2.50024 10.0492 2.50024 11.0075C2.50024 12.8575 4.00024 14.3825 5.83358 14.3825Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.4669 6.29876C11.04 5.38303 11.4463 4.37297 11.6669 3.31543C12.0835 5.39876 13.3335 7.39876 15.0002 8.7321C16.6669 10.0654 17.5002 11.6488 17.5002 13.3154C17.505 14.4673 17.1676 15.5947 16.5309 16.5547C15.8941 17.5146 14.9867 18.2639 13.9236 18.7075C12.8606 19.1511 11.6897 19.2691 10.5595 19.0465C9.4293 18.8239 8.39064 18.2707 7.5752 17.4571" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Humidity:</span>
                  </div>
                  <span className="reading-value">58%</span>
                </div>
              </div>
            </div>

            {/* Device 3 */}
            <div className="device-item">
              <div className="device-header">
                <div className="device-info">
                  <div className="device-icon">
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2002 8.79971C21.1998 8.44898 21.1073 8.10452 20.9317 7.80087C20.7562 7.49722 20.5039 7.24507 20.2002 7.06971L13.2002 3.06971C12.8962 2.89417 12.5513 2.80176 12.2002 2.80176C11.8491 2.80176 11.5042 2.89417 11.2002 3.06971L4.2002 7.06971C3.89646 7.24507 3.64418 7.49722 3.46866 7.80087C3.29314 8.10452 3.20056 8.44898 3.2002 8.79971V16.7997C3.20056 17.1504 3.29314 17.4949 3.46866 17.7985C3.64418 18.1022 3.89646 18.3543 4.2002 18.5297L11.2002 22.5297C11.5042 22.7052 11.8491 22.7977 12.2002 22.7977C12.5513 22.7977 12.8962 22.7052 13.2002 22.5297L20.2002 18.5297C20.5039 18.3543 20.7562 18.1022 20.9317 17.7985C21.1073 17.4949 21.1998 17.1504 21.2002 16.7997V8.79971Z" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.50024 7.7998L12.2002 12.7998L20.9002 7.7998" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.2002 22.7998V12.7998" stroke="#78716C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="device-details">
                    <h4>Casing 3</h4>
                    <p className="device-location">📍 Section C</p>
                  </div>
                </div>
              </div>
              <div className="device-readings">
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.667 3.93327V12.7166C12.3025 13.0835 12.7991 13.6498 13.0799 14.3277C13.3607 15.0057 13.41 15.7573 13.2201 16.4661C13.0302 17.1749 12.6117 17.8012 12.0295 18.2479C11.4474 18.6946 10.7341 18.9367 10.0003 18.9367C9.26655 18.9367 8.55327 18.6946 7.97112 18.2479C7.38898 17.8012 6.97049 17.1749 6.78057 16.4661C6.59066 15.7573 6.63992 15.0057 6.92073 14.3277C7.20153 13.6498 7.69819 13.0835 8.33366 12.7166V3.93327C8.33366 3.49124 8.50926 3.06732 8.82182 2.75476C9.13438 2.4422 9.5583 2.2666 10.0003 2.2666C10.4424 2.2666 10.8663 2.4422 11.1788 2.75476C11.4914 3.06732 11.667 3.49124 11.667 3.93327Z" stroke="#F54900" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Temp:</span>
                  </div>
                  <span className="reading-value">28°C</span>
                </div>
                <div className="reading-row">
                  <div className="reading-label">
                    <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83358 13.7829C7.66691 13.7829 9.16691 12.2579 9.16691 10.4079C9.16691 9.44121 8.69191 8.52454 7.74191 7.74954C6.79191 6.97454 6.07524 5.82454 5.83358 4.61621C5.59191 5.82454 4.88358 6.98288 3.92524 7.74954C2.96691 8.51621 2.50024 9.44954 2.50024 10.4079C2.50024 12.2579 4.00024 13.7829 5.83358 13.7829Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.4669 5.69915C11.04 4.78342 11.4463 3.77336 11.6669 2.71582C12.0835 4.79915 13.3335 6.79915 15.0002 8.13249C16.6669 9.46582 17.5002 11.0492 17.5002 12.7158C17.505 13.8677 17.1676 14.9951 16.5309 15.9551C15.8941 16.915 14.9867 17.6643 13.9236 18.1079C12.8606 18.5515 11.6897 18.6695 10.5595 18.4469C9.4293 18.2243 8.39064 17.6711 7.5752 16.8575" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Humidity:</span>
                  </div>
                  <span className="reading-value">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="alerts-section">
          <div className="alerts-header">
            <h3>Alerts</h3>
            <p>Recent notifications</p>
          </div>
          
          <div className="alerts-list">
            <div className="alert-item">
              <div className="alert-icon warning">
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3085 15.3993L11.6418 3.73261C11.4964 3.47611 11.2856 3.26277 11.0309 3.11433C10.7762 2.9659 10.4866 2.8877 10.1918 2.8877C9.89698 2.8877 9.60743 2.9659 9.3527 3.11433C9.09797 3.26277 8.88717 3.47611 8.7418 3.73261L2.07514 15.3993C1.92821 15.6537 1.85116 15.9425 1.85181 16.2364C1.85246 16.5302 1.93078 16.8187 2.07884 17.0725C2.2269 17.3263 2.43943 17.5364 2.69488 17.6816C2.95034 17.8268 3.23964 17.9019 3.53347 17.8993H16.8668C17.1592 17.899 17.4464 17.8217 17.6995 17.6753C17.9527 17.5289 18.1628 17.3185 18.3089 17.0652C18.455 16.8119 18.5318 16.5246 18.5318 16.2322C18.5317 15.9398 18.4547 15.6525 18.3085 15.3993Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 7.89941V11.2327" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 14.5664H10.2085" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>High Humidity detected in Casing 1</h4>
                <div className="alert-meta">
                  <span className="alert-time">5 minutes ago</span>
                  <span className="alert-value">65%</span>
                </div>
              </div>
            </div>

            <div className="alert-item">
              <div className="alert-icon warning">
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3085 15.5995L11.6418 3.9328C11.4964 3.67631 11.2856 3.46296 11.0309 3.31453C10.7762 3.1661 10.4866 3.08789 10.1918 3.08789C9.89698 3.08789 9.60743 3.1661 9.3527 3.31453C9.09797 3.46296 8.88717 3.67631 8.7418 3.9328L2.07514 15.5995C1.92821 15.8539 1.85116 16.1427 1.85181 16.4366C1.85246 16.7304 1.93078 17.0188 2.07884 17.2727C2.2269 17.5265 2.43943 17.7366 2.69488 17.8818C2.95034 18.027 3.23964 18.1021 3.53347 18.0995H16.8668C17.1592 18.0992 17.4464 18.0219 17.6995 17.8755C17.9527 17.7291 18.1628 17.5187 18.3089 17.2654C18.455 17.0121 18.5318 16.7248 18.5318 16.4324C18.5317 16.14 18.4547 15.8527 18.3085 15.5995Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 8.09961V11.4329" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 14.7666H10.2085" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>Temperature dropped below 20°C in Casing 2</h4>
                <div className="alert-meta">
                  <span className="alert-time">15 minutes ago</span>
                  <span className="alert-value">18°C</span>
                </div>
              </div>
            </div>

            <div className="alert-item">
              <div className="alert-icon success">
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.2003 19.1335C14.8026 19.1335 18.5336 15.4025 18.5336 10.8001C18.5336 6.19776 14.8026 2.4668 10.2003 2.4668C5.5979 2.4668 1.86694 6.19776 1.86694 10.8001C1.86694 15.4025 5.5979 19.1335 10.2003 19.1335Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.7002 10.7995L9.36686 12.4661L12.7002 9.13281" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>Casing 3 conditions optimal</h4>
                <div className="alert-meta">
                  <span className="alert-time">1 hour ago</span>
                  <span className="alert-value">Perfect</span>
                </div>
              </div>
            </div>

            <div className="alert-item">
              <div className="alert-icon warning">
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3085 14.9989L11.6418 3.33222C11.4964 3.07572 11.2856 2.86237 11.0309 2.71394C10.7762 2.56551 10.4866 2.4873 10.1918 2.4873C9.89698 2.4873 9.60743 2.56551 9.3527 2.71394C9.09797 2.86237 8.88717 3.07572 8.7418 3.33222L2.07514 14.9989C1.92821 15.2534 1.85116 15.5421 1.85181 15.836C1.85246 16.1298 1.93078 16.4183 2.07884 16.6721C2.2269 16.9259 2.43943 17.136 2.69488 17.2812C2.95034 17.4264 3.23964 17.5015 3.53347 17.4989H16.8668C17.1592 17.4986 17.4464 17.4214 17.6995 17.275C17.9527 17.1286 18.1628 16.9181 18.3089 16.6648C18.455 16.4115 18.5318 16.1242 18.5318 15.8318C18.5317 15.5394 18.4547 15.2521 18.3085 14.9989Z" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 7.49902V10.8324" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.2002 14.166H10.2085" stroke="#3D2914" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="alert-content">
                <h4>Low battery warning - Casing 2</h4>
                <div className="alert-meta">
                  <span className="alert-time">2 hours ago</span>
                  <span className="alert-value">15%</span>
                </div>
              </div>
            </div>
          </div>

          <button className="view-all-alerts-btn">
            View All Alerts
          </button>
        </div>
      </div>
    </>
  );
}
