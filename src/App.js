import React, { useState } from 'react';
import './App.css';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/DashBoard';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const handleLogin = (email, password) => {
    const existingUser = users.find(u => u.email === email && u.password === password);
    if (existingUser) {
      setUser({ email, name: existingUser.name });
    } else {
      alert('Invalid credentials.');
    }
  };

  const handleSignUp = (email, password, fullName) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      alert('User already exists.');
      setPage('login');
    } else {
      const newUser = { email, password, name: fullName };
      setUsers(prev => [...prev, newUser]);
      setUser({ email, name: fullName });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {page === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setPage('signup')} />
      )}
      {page === 'signup' && (
        <SignupPage onSignUp={handleSignUp} onNavigateToLogin={() => setPage('login')} />
      )}
    </div>
  );
}

export default App;
