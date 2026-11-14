import { useState, useEffect } from 'react';

import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import Calendar from './pages/Calendar.jsx'
import Notifications from './pages/Notifications.jsx'
import Settings from './pages/Settings.jsx'

// Return dashboard by default + hard coded calendar path check for navigation. Don't like this implementation at all, we can change it later.
function App() {
  const path = window.location.pathname;

  const [preferences, setPreferences] = useState(() => {
    try {
      const savedPreferences = localStorage.getItem('userPreferences');

      return savedPreferences ? {darkMode: false, ...JSON.parse(savedPreferences)} : {darkMode: false};
    } catch {
      return { darkMode: false};
    }
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  return (
    <div className={`app ${preferences.darkMode ? 'dark-mode' : ''}`}>
      {path === "/calendar" ? (
        <Calendar />
      ) : path === "/notifications" ? (
        <Notifications />
      ) : path === "/settings" ? (
        <Settings
        preferences={preferences}
        setPreferences={setPreferences}
        />
      ) : (
        <Dashboard />
        )}
    </div>
  )
}

export default App
