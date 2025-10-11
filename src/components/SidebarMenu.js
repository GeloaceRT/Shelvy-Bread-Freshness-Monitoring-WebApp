import React from 'react';

export default function SidebarMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.25)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 999,
        }}
        aria-hidden={isOpen ? 'false' : 'true'}
      />

      {/* Sliding panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(110%)',
          width: 'min(320px, 85vw)',
          height: '100%',
          background: '#FFF8E1',
          boxShadow: isOpen ? '0 0 20px rgba(0,0,0,0.2)' : 'none',
          transition: 'transform 0.3s ease',
          padding: '20px',
          zIndex: 1000,
          willChange: 'transform',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Logs & History"
      >
        <h3 style={{ marginBottom: '10px', color: '#3D2914' }}>Logs & History</h3>
        <div
          style={{
            height: '80%',
            overflowY: 'auto',
            borderTop: '1px solid #e0e0e0',
            paddingTop: '10px',
          }}
        >
          <p><b>Humidity back to normal</b><br /><small>02:45 PM</small></p>
          <p><b>Sensor calibration check</b><br /><small>02:44 PM</small></p>
          <p><b>New batch started</b><br /><small>02:42 PM</small></p>
          <p><b>Humidity back to normal</b><br /><small>02:40 PM</small></p>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            background: '#F59E0B',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </>
  );
}
