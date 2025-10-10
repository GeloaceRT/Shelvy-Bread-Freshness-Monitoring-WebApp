import React, { useState } from 'react';
import './App.css';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SidebarMenu from './components/SidebarMenu';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setMenuOpen] = useState(false);

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
    return (
      <div className="App" style={{ background: '#FAF8F4', minHeight: '100vh' }}>
        {/* Header with burger menu */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px',
            borderBottom: '2px solid #FBBF24',
            background: '#FFF8E1',
          }}
        >
          <h1
            style={{
              color: '#3D2914',
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🍞 Shelvy Dashboard
          </h1>
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3D2914',
            }}
          >
            ☰
          </button>
        </div>

        {/* Dashboard content */}
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              maxWidth: '600px',
              margin: '2rem auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ color: '#D97706', marginBottom: '1rem' }}>
              Welcome, {user.name}! 👋
            </h2>
            <p style={{ color: '#78716C', marginBottom: '2rem' }}>
              You're successfully logged in to your bakery monitoring system.
            </p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Users registered:</strong> {users.length}</p>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Sidebar for Logs & History */}
        <SidebarMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    );
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
