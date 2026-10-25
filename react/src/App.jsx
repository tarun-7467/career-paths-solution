import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import Calendar from './pages/Calendar.jsx'
import Notifications from './pages/Notifications.jsx'

// Return dashboard by default + hard coded calendar path check for navigation. Don't like this implementation at all, we can change it later.
function App() {
  const path = window.location.pathname;

  if (path === "/calendar") {
    return <Calendar />;
  }
  if (path === "/notifications") {
  return <Notifications />;
}
  return <Dashboard />;
  
}

export default App
