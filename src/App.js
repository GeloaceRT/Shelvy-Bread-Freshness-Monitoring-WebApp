
import './App.css';
import Dashboard from './components/Dashboard';
import SensorData from './components/SensorData';
import ConnectDevice from './components/ConnectDevice';
import Alerts from './components/Alerts';
import History from './components/History';


function App() {
  // Simulated sensor data and history for prototype
  const temperature = 28;
  const humidity = 65;
  const historyData = [
    { temperature: 27, humidity: 60, time: '10:00 AM' },
    { temperature: 28, humidity: 65, time: '11:00 AM' },
    { temperature: 29, humidity: 70, time: '12:00 PM' },
  ];

  return (
    <div className="App">
      <h1>Shelvy Bread Freshness Monitoring</h1>
      <ConnectDevice />
      <Dashboard />
      <SensorData temperature={temperature} humidity={humidity} />
      <Alerts temperature={temperature} humidity={humidity} />
      <History data={historyData} />
    </div>
  );
}

export default App;
