import { useState, useEffect } from 'react';

// Component imports
import Header from '../components/Header.jsx'
import NotificationsWidget from '../components/NotificationsWidget.jsx'
import Sidebar from '../components/Sidebar.jsx'

function Notifications() {
  return (
    <div className="dashboard">
      <Header />
      <Sidebar />
        <main className="dashboard-content">
            <NotificationsWidget />
        </main>
    </div>
  );
}

export default Notifications;