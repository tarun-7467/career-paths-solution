// Component imports
import Header from '../components/Header.jsx'

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
  // Turn each job application into a calendar event
  const applicationEvents = jobApplications.map((job) => ({
    title: `Applied: ${job.company} (${job.position})`,
    date: job.date_applied,
    color: '#57f442' // green for applications
  }));

  // Turn each reminder into a calendar event
  const reminderEvents = reminders.map((reminder) => ({
    title: `Reminder: ${reminder.reminder_name}`,
    date: reminder.reminder_date,
    color: '#EA4335' // red for reminders
  }));

  // Combine both lists into one array FullCalendar can use
  return [...applicationEvents, ...reminderEvents];
}

function Calendar() {
  const events = buildCalendarEvents();

  return (
    <div className="calendar-page">
      <Header />
      <h1>Career Paths Solution</h1>
      <FullCalendar
        plugins={[themePlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        events={events}
      />
    </div>
  );
}

export default Calendar;