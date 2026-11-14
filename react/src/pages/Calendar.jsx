
// Component imports
// React tools let the page hold data and run code when it opens.
import { useState, useEffect } from 'react';

// Component imports
import Header from '../components/Header.jsx'
import CalendarView from '../components/CalendarView.jsx' // the calendar itself, shared with the dashboard widget

// The full Calendar page
function Calendar({ user, onLogout }) {
  
//applications is the list, loading is true until the data arrives, and error holds a message if the request fails.
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load applications from the Django API, the same endpoint the dashboard uses
  //A useEffect that fetches the data:
  useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/job-applications/', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        setApplications(await response.json());
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

    fetchApplications();

    // Cancel the request if the page closes before it finishes
    return () => controller.abort();
  }, []);

  // Show only applications belonging to the current user
    const userApplications = applications;
// loading and error checks

  return (
    <div className="calendar-page">
      <Header user={user} onLogout={onLogout} />
      <h1>Career Paths Solution</h1>
      {loading ? (
        <p>Loading calendar...</p>
      ) : error ? (
        <p role="alert">Failed to load applications: {error}</p>
      ) : (
        <CalendarView applications={userApplications} />
      )}
    </div>
  );
}

export default Calendar;