
// Component imports
import Header from '../components/Header.jsx'
import NotificationsWidget from '../components/NotificationsWidget.jsx'
import Sidebar from '../components/Sidebar.jsx'

function Notifications({ user, onLogout, preferences }) {
  return (
    <div className={`app ${preferences.darkMode ? 'dark-mode' : ''}`}>
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />
      <Sidebar />
        <main className="dashboard-content">
            <NotificationsWidget />
        </main>
    </div>
    </div>
  );
}

export default Notifications;