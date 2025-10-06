// Alerts.js
// Shows alerts when critical levels are reached
import React from 'react';

const Alerts = ({ temperature, humidity }) => {
  const tempCritical = temperature > 30;
  const humidityCritical = humidity > 80;

  return (
    <div>
      <h3>Alerts</h3>
      {tempCritical && <p style={{color: 'red'}}>Temperature is too high!</p>}
      {humidityCritical && <p style={{color: 'red'}}>Humidity is too high!</p>}
      {!tempCritical && !humidityCritical && <p>All parameters are normal.</p>}
    </div>
  );
};

export default Alerts;
