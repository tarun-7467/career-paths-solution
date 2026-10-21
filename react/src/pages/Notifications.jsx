import { useState, useEffect } from 'react';

// Component imports
import Header from '../components/Header.jsx'
import NotificationsView from '../components/NotificationsView.jsx'

function Notifications() {
  return (
    <div>
      <Header />
      <NotificationsView />
    </div>
  );
}

export default Notifications;