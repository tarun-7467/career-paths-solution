// Plugin imports
import FullCalendar from '@fullcalendar/react';
import themePlugin from "@fullcalendar/react/themes/classic";
import dayGridPlugin from '@fullcalendar/react/daygrid';
import listPlugin from '@fullcalendar/react/list';

// Styling imports
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';

// Mock data imports
// Reminders are still mock until they have an API
import { reminders } from '../pages/mockData';
// One color per application status
const STATUS_COLORS = {
  Applied: '#57f442',   // green
  Interview: '#4285F4', // blue
  Offer: '#0b4802',     // green
  Rejected: '#EA4335',  // red
};

function buildCalendarEvents(applications) {
  // Turn each job application into a calendar event
  const applicationEvents = applications.map((job) => ({
  title: `${job.status}: ${job.company} (${job.position})`,    date: job.date_applied,
    color: STATUS_COLORS[job.status] ?? '#57f442', // falls back to green if the status isn't listed 
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

// compact = true is used by the dashboard widget
function CalendarView({ compact = false, applications = [] }) {
    const events = buildCalendarEvents(applications);

  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, listPlugin]}
      initialView={compact ? 'listWeek' : 'dayGridMonth'}
      initialDate={new Date()} // opens on today's date
      headerToolbar={
        compact
          ? { left: 'prev,next today', center: 'title', right: '' }
          : { left: 'prev,next today', center: 'title', right: 'dayGridMonth' }
      }
      height="auto"
      toolbarTitleClass={compact ? 'widget-toolbar-title' : undefined}
      events={events}
    />
  );
}

export default CalendarView;