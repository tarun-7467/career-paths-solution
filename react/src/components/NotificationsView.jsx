import { useState, useEffect } from 'react';

import '../stylesheets/Dashboard.css';

function loadList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    return [];
  }
}

function NotificationsView() {
  const currentUserId = 1;

  const [reminders, setReminders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications] = useState(() => loadList('applications'));
  const [formData, setFormData] = useState({ title: '', reminderDate: '', jobId: '' });

  // Load jobs and reminders from Django when the page opens
  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsResponse, remindersResponse] = await Promise.all([
          fetch('/api/job-applications/'),
          fetch('/api/reminders/'),
        ]);
        if (!jobsResponse.ok || !remindersResponse.ok) {
          throw new Error('Request failed');
        }
        const allJobs = await jobsResponse.json();
        const allReminders = await remindersResponse.json();

        const myJobs = allJobs.filter((job) => job.user === currentUserId);
        const myJobIds = myJobs.map((job) => job.job_id);
        setJobs(myJobs);
        setReminders(allReminders.filter((r) => myJobIds.includes(r.job)));
      } catch (error) {
        console.error('Failed to load reminders:', error);
      }
    };
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  // Add a reminder (saved in the database)
  const handleAddReminder = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.reminderDate || !formData.jobId) return;

    try {
      const response = await fetch('/api/reminders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: Number(formData.jobId),
          reminder_name: formData.title,
          reminder_date: formData.reminderDate.slice(0, 10),
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

  // Delete a reminder (removed from the database)
  const handleDeleteReminder = async (id) => {
    try {
      const response = await fetch(`/api/reminders/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setReminders((previous) => previous.filter((r) => r.reminder_id !== id));
    } catch (error) {
      console.error('Failed to delete reminder:', error);
    }
  };

  const applicationReminders = applications
    .filter((app) => app.reminderDate)
    .map((app) => ({
      id: `app-${app.id}`,
      title: `${app.company} (${app.position})`,
      reminderDate: app.reminderDate,
      notes: app.notes,
      canDelete: false
    }));

  const customReminders = reminders
    .filter((r) => r.reminder_date)
    .map((r) => ({
      id: `rem-${r.reminder_id}`,
      rawId: r.reminder_id,
      title: r.reminder_name,
      reminderDate: `${r.reminder_date}T00:00:00`,
      notes: r.description,
      canDelete: true
    }));

  const allReminders = [...applicationReminders, ...customReminders].sort(
    (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate)
  );

  const now = new Date();
  const dueReminders = allReminders.filter((r) => new Date(r.reminderDate) <= now);
  const upcomingReminders = allReminders.filter((r) => new Date(r.reminderDate) > now);

  const formatDate = (value) => new Date(value).toLocaleString();

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
      <div>Reminder: {formatDate(item.reminderDate)}</div>
      {item.notes && <div>Notes: {item.notes}</div>}
      {item.canDelete && (
        <button className="button secondary" type="button" onClick={() => handleDeleteReminder(item.rawId)}>
          Delete
        </button>
      )}
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
          type="datetime-local"
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