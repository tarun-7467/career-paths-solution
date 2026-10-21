
// Component imports

import Header from '../components/Header.jsx'
<<<<<<< HEAD

// Plugin imports
import FullCalendar from '@fullcalendar/react';
import themePlugin from "@fullcalendar/react/themes/classic";
import dayGridPlugin from '@fullcalendar/react/daygrid';

// Styling imports
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';

// Mock data imports
import { jobApplications, reminders } from './mockData';

function buildCalendarEvents() {
  // Turn each mock job application into a calendar event
  const applicationEvents = jobApplications.map((job) => ({
    title: `Applied: ${job.company} (${job.position})`,
    date: job.date_applied,
    color: '#57f442' // green for applications
  }));

  // Turn each mock reminder into a calendar event
  const reminderEvents = reminders.map((reminder) => ({
    title: `Reminder: ${reminder.reminder_name}`,
    date: reminder.reminder_date,
    color: '#EA4335' // red for reminders
  }));

  // Read the entries saved by the form
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem('applications') || '[]');
  } catch (error) {
    saved = [];
  }

  // Saved applications show up as green events
  const savedApplicationEvents = saved
    .filter((app) => app.dateApplied)
    .map((app) => ({
      title: `Applied: ${app.company} (${app.position})`,
      date: app.dateApplied,
      color: '#57f442'
    }));

  // Saved reminders show up as red events
  const savedReminderEvents = saved
    .filter((app) => app.reminderDate)
    .map((app) => ({
      title: `Reminder: ${app.company} (${app.position})`,
      date: app.reminderDate,
      color: '#EA4335'
    }));

  // Combine everything into one array FullCalendar can use
  return [
    ...applicationEvents,
    ...reminderEvents,
    ...savedApplicationEvents,
    ...savedReminderEvents
  ];
}

=======
import CalendarView from '../components/CalendarView.jsx' // // the calendar itself, shared with the dashboard widget
// The full Calendar page 
>>>>>>> 5cd28b544437cf6f211ecb8ba3c83193e4457268
function Calendar() {
  return (
    <div className="calendar-page">
      <Header />
      <h1>Career Paths Solution</h1>
      <CalendarView />
    </div>
  );
}

export default Calendar;