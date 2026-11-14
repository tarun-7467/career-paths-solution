
import { useEffect, useState } from 'react';

import './App.css';
import Dashboard from './pages/Dashboard.jsx';
import Calendar from './pages/Calendar.jsx';
import Notifications from './pages/Notifications.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Account from './pages/Account.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const path = window.location.pathname;

  const handleLogout = async () => {
    try {
      const csrfResponse = await fetch('/api/auth/csrf/', {
        credentials: 'same-origin',
      });

      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token.');
      }

      const { csrfToken } = await csrfResponse.json();

      const response = await fetch('/api/auth/logout/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed: HTTP ${response.status}`);
      }

      setUser(null);
      window.location.replace('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.');
    }
  };


  useEffect(() => {
    const controller = new AbortController();

    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/me/', {
          credentials: 'same-origin',
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Unable to verify login status.');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p>Checking login status...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (path === '/login') {
    if (user) {
      window.location.replace('/');
      return null;
    }
    return <Login />;
  }

  if (path === '/register') {
    if (user) {
      window.location.replace('/');
      return null;
    }
    return <Register />;
  }

  if (!user) {
    window.location.replace('/login');
    return null;
  }

  if (path === '/account') {
    return <Account user={user} onLogout={handleLogout} />;
  }

  if (path === '/calendar') {
    return <Calendar user={user} onLogout={handleLogout} />;
  }

  if (path === '/notifications') {
    return <Notifications user={user} onLogout={handleLogout} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
