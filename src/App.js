import React, { useState } from 'react';
import './App.css';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Simulate user database

  const handleLogin = (email, password, rememberMe) => {
    console.log('Login attempt:', { email, password, rememberMe });

    // Simple authentication simulation
    const existingUser = users.find(u => u.email === email && u.password === password);

    if (existingUser) {
      setUser({ email, name: existingUser.name });
      alert(`Welcome back, ${existingUser.name}!`);
    } else {
      alert('Invalid credentials. Please sign up first or check your details.');
    }
  };

  const handleSignUp = (email, password, fullName) => {
    console.log('Sign up attempt:', { email, password, fullName });

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      alert('User already exists! Please login instead.');
      setPage('login');
    } else {
      // Add new user
      const newUser = { email, password, name: fullName };
      setUsers(prev => [...prev, newUser]);
      setUser({ email, name: fullName });
      alert(`Welcome to Shelvy, ${fullName}!`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('login');
  };

  const handleNavigateToSignup = () => {
    setPage('signup');
  };

  const handleNavigateToLogin = () => {
    setPage('login');
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="App">
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: '#FAF8F4',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h1 style={{
            color: '#3D2914',
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            🍞 Shelvy Dashboard
          </h1>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#D97706', marginBottom: '1rem' }}>
              Welcome, {user.name}! 👋
            </h2>
            <p style={{ color: '#78716C', marginBottom: '2rem' }}>
              You're successfully logged in to your bakery monitoring system.
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Users registered:</strong> {users.length}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FB923C 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Render appropriate page */}
      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={handleNavigateToSignup}
        />
      )}
      {page === 'signup' && (
        <SignupPage
          onSignUp={handleSignUp}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}
    </div>
  );
}

export default App;
