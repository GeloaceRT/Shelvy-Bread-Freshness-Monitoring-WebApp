import React, { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/DashBoard';
import { DEFAULT_API_BASE_URL, createApiClient } from './services/apiClient';

const STORAGE_KEY = 'shelvy.session';

const safeTrim = (value) => (typeof value === 'string' ? value.trim() : '');

const loadStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.token) {
      return null;
    }

    return { ...parsed, remember: true };
  } catch (error) {
    return null;
  }
};

const formatDisplayName = (candidate, identifier) => {
  const preferred = safeTrim(candidate);
  if (preferred) {
    return preferred;
  }

  const normalizedIdentifier = safeTrim(identifier);
  if (!normalizedIdentifier) {
    return 'Baker Dashboard';
  }

  const base = normalizedIdentifier.includes('@')
    ? normalizedIdentifier.split('@')[0]
    : normalizedIdentifier;

  if (!base) {
    return 'Baker Dashboard';
  }

  return base.charAt(0).toUpperCase() + base.slice(1);
};

function App() {
  const [view, setView] = useState('login');
  const [session, setSession] = useState(() => loadStoredSession());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (session?.token && session.remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  useEffect(() => {
    setAuthError('');
  }, [view]);

  const establishSession = ({ id, username, displayName, token }, remember) => ({
    token: token ?? null,
    apiToken: token ?? null,
    user: {
      id: id || `local-${Date.now()}`,
      username,
      displayName,
    },
    remember: Boolean(remember),
  });

  const handleLogin = async (identifier, password, rememberMe) => {
    setLoading(true);
    setAuthError('');

    const trimmedIdentifier = safeTrim(identifier) || 'baker';

    try {
      // If a backend URL is configured, attempt real auth against it
      if (DEFAULT_API_BASE_URL) {
        const client = createApiClient(DEFAULT_API_BASE_URL);
        const resp = await client.authLogin(trimmedIdentifier, password);
        if (resp && resp.token) {
          const user = resp.user || {};
          setSession(
            establishSession(
              {
                id: user.id || null,
                username: user.username || trimmedIdentifier,
                displayName: user.displayName || formatDisplayName(user.fullName || '', trimmedIdentifier),
                token: resp.token,
              },
              !!rememberMe
            )
          );
          setLoading(false);
          return;
        }
      }

      // Fallback: local session (no backend or login failed)
      const displayName = formatDisplayName('', trimmedIdentifier);
      setSession(
        establishSession(
          {
            username: trimmedIdentifier,
            displayName,
            token: null,
          },
          !!rememberMe
        )
      );
    } catch (error) {
      setAuthError(error?.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (identifier, password, fullName) => {
    setLoading(true);
    setAuthError('');

    const trimmedIdentifier = safeTrim(identifier) || 'baker';

    try {
      if (DEFAULT_API_BASE_URL) {
        const client = createApiClient(DEFAULT_API_BASE_URL);
        const resp = await client.authSignUp(trimmedIdentifier, password, fullName);
        if (resp && resp.token) {
          const user = resp.user || {};
          setSession(
            establishSession(
              {
                id: user.id || null,
                username: user.username || trimmedIdentifier,
                displayName: user.displayName || formatDisplayName(fullName, trimmedIdentifier),
                token: resp.token,
              },
              true
            )
          );
          setLoading(false);
          return;
        }
      }

      // Fallback to local session when backend not available or signup failed
      const displayName = formatDisplayName(fullName, trimmedIdentifier);
      setSession(
        establishSession(
          {
            username: trimmedIdentifier,
            displayName,
            token: null,
          },
          true
        )
      );
    } catch (error) {
      setAuthError(error?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setView('login');
    setAuthError('');
  };

  if (session) {
    return (
      <Dashboard
        user={session.user}
        token={session.apiToken !== undefined ? session.apiToken : session.token}
        apiBaseUrl={DEFAULT_API_BASE_URL}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignupPage
        onSignUp={handleSignUp}
        onNavigateToLogin={() => setView('login')}
        loading={loading}
        error={authError}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onNavigateToSignup={() => setView('signup')}
      loading={loading}
      error={authError}
    />
  );
}

export default App;
