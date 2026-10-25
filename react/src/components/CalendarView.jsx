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
import { jobApplications, reminders } from '../pages/mockData';

function buildCalendarEvents(applications) {
  // Turn each job application into a calendar event
  const applicationEvents = applications.map((job) => ({
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

// compact = true is used by the dashboard widget
function CalendarView({ compact = false, applications = jobApplications }) {
  const events = buildCalendarEvents(applications);

  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, listPlugin]}
      initialView={compact ? 'listWeek' : 'dayGridMonth'}
      initialDate={new Date()} // opens on today's date
      headerToolbar={
        compact
          ? { left: 'prev,next', center: 'title', right: '' }
          : { left: 'prev,next today', center: 'title', right: 'dayGridMonth' }
      }
      height="auto"
      toolbarTitleClass={compact ? 'widget-toolbar-title' : undefined}
      events={events}
    />
  );
}

export default CalendarView;