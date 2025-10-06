// SensorData.js
// Displays current sensor readings
import React from 'react';

const SensorData = ({ temperature, humidity }) => {
  return (
    <div>
      <h3>Sensor Data</h3>
      <p>Temperature: {temperature} °C</p>
      <p>Humidity: {humidity} %</p>
    </div>
  );
};

export default SensorData;
