// History.js
// (Optional) Shows past readings
import React from 'react';

const History = ({ data }) => {
  return (
    <div>
      <h3>History</h3>
      <ul>
        {data && data.length > 0 ? (
          data.map((entry, idx) => (
            <li key={idx}>
              Temp: {entry.temperature} °C, Humidity: {entry.humidity} %, Time: {entry.time}
            </li>
          ))
        ) : (
          <li>No history data available.</li>
        )}
      </ul>
    </div>
  );
};

export default History;
