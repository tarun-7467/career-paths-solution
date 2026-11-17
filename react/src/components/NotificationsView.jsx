import { useState, useEffect } from 'react';

import '../stylesheets/Dashboard.css';

// Get a CSRF token from Django (same pattern as the Dashboard page)
async function getCsrfToken() {
  const response = await fetch('/api/auth/csrf/', {
    credentials: 'same-origin',
  });
  if (!response.ok) {
    throw new Error('Failed to get CSRF token.');
  }
  const { csrfToken } = await response.json();
  return csrfToken;
}

function NotificationsView() {
  // STATE 1: reminders for the logged-in user (from the database)
  const [reminders, setReminders] = useState([]);

  // STATE 2: the logged-in user's job applications (for the dropdown)
  const [jobs, setJobs] = useState([]);

  // STATE 3: what the user is typing in the add-reminder form
  const [formData, setFormData] = useState({ title: '', reminderDate: '', jobId: '' });

  // Load applications and reminders when the page opens.
  // Django only returns the logged-in user's data.
  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsResponse, remindersResponse] = await Promise.all([
          fetch('/api/job-applications/', { credentials: 'same-origin' }),
          fetch('/api/reminders/', { credentials: 'same-origin' }),
        ]);
        if (!jobsResponse.ok || !remindersResponse.ok) {
          throw new Error('Request failed');
        }
        setJobs(await jobsResponse.json());
        setReminders(await remindersResponse.json());
      } catch (error) {
        console.error('Failed to load reminders:', error);
      }
    };
    loadData();
  }, []);

  // HANDLER: update the form as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  // HANDLER: add a reminder (saved in the database)
  const handleAddReminder = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.reminderDate || !formData.jobId) return;

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/reminders/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          job: Number(formData.jobId),
          reminder_name: formData.title,
          reminder_date: formData.reminderDate.slice(0, 10), // database stores the date only
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const created = await response.json();
      setReminders((previous) => [...previous, created]);
      setFormData({ title: '', reminderDate: '', jobId: '' });
    } catch (error) {
      console.error('Failed to add reminder:', error);
    }
  };

  // HANDLER: delete a reminder (removed from the database)
  const handleDeleteReminder = async (id) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/reminders/${id}/`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'X-CSRFToken': csrfToken },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setReminders((previous) => previous.filter((r) => r.reminder_id !== id));
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  // Look up an application's name from its id
  const jobNameById = {};
  jobs.forEach((job) => {
    jobNameById[job.job_id] = `${job.company} (${job.position})`;
  });

  // Turn database reminders into list items, soonest first
  const allReminders = reminders
    .filter((r) => r.reminder_date)
    .map((r) => ({
      id: `rem-${r.reminder_id}`,
      rawId: r.reminder_id,
      title: r.reminder_name,
      applicationName: jobNameById[r.job],
      reminderDate: `${r.reminder_date}T00:00:00`, // read as local time so the day doesn't shift
      notes: r.description,
    }))
    .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));

  const now = new Date();
  const dueReminders = allReminders.filter((r) => new Date(r.reminderDate) <= now);
  const upcomingReminders = allReminders.filter((r) => new Date(r.reminderDate) > now);

  const formatDate = (value) => new Date(value).toLocaleDateString();

  // One row in the list
  const renderReminder = (item, isDue) => (
    <li
      key={item.id}
      style={{
        padding: '12px 16px',
        marginBottom: '8px',
        borderRadius: '8px',
        border: `2px solid ${isDue ? '#EA4335' : '#999'}`,
        listStyle: 'none'
      }}
    >
      <strong>{item.title}</strong>
      <div>Application: {item.applicationName}</div>
      <div>Reminder: {formatDate(item.reminderDate)}</div>
      {item.notes && <div>Notes: {item.notes}</div>}
      <button className="button secondary" type="button" onClick={() => handleDeleteReminder(item.rawId)}>
        Delete
      </button>
    </li>
  );

  return (
    <div className="notifications">

      <div className="add-reminder">
        <h2>Due now ({dueReminders.length})</h2>
        {dueReminders.length === 0 ? (
          <p>Nothing is due right now.</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {dueReminders.map((item) => renderReminder(item, true))}
          </ul>
        )}

        <h2>Upcoming ({upcomingReminders.length})</h2>
        {upcomingReminders.length === 0 ? (
          <p>No upcoming reminders.</p>
        ) : (
          <ul style={{ padding: 0 }}>
            {upcomingReminders.map((item) => renderReminder(item, false))}
          </ul>
        )}
      </div>

      <h2>Add a reminder</h2>
      <form onSubmit={handleAddReminder}>
        <label>Application</label>
        <select className="form-input"
          name="jobId"
          value={formData.jobId}
          onChange={handleChange}
          required
        >
          <option value="">Select an application</option>
          {jobs.map((job) => (
            <option key={job.job_id} value={job.job_id}>
              {job.company} ({job.position})
            </option>
          ))}
        </select>
        <label>Reminder label</label>
        <input className="form-input"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Reminder (e.g. Follow up with Meta)"
          required
        />
        <label>Reminder date</label>
        <input className="form-input"
          type="date"
          name="reminderDate"
          value={formData.reminderDate}
          onChange={handleChange}
          required
        />
        <button className="button secondary" type="submit">Add Reminder</button>
      </form>

    </div>
  );
}

export default NotificationsView;