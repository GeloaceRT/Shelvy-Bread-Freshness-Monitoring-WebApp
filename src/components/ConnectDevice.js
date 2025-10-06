// ConnectDevice.js
// Simulates device connection (Bluetooth/WiFi)
import React, { useState } from 'react';

const ConnectDevice = () => {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  return (
    <div>
      <h3>Connect Device</h3>
      {connected ? (
        <p>Device Connected!</p>
      ) : (
        <button onClick={handleConnect}>Connect via Bluetooth/WiFi</button>
      )}
    </div>
  );
};

export default ConnectDevice;
