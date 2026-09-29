import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { jobApplications, reminders } from './mockData';
import './App.css';

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

function App() {
  const events = buildCalendarEvents();

  return (
    <div className="App">
      <h1>Career Paths Solution</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}

export default App;