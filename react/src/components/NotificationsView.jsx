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

// Check the form on the client before calling the API.
// Returns an object like { title: '...' }; empty means the form is valid.
function validateReminder({ jobId, title, reminderDate }) {
  const errors = {};
  if (!jobId) errors.jobId = 'Please select an application.';
  if (!title.trim()) errors.title = 'Please enter a reminder label.';
  if (!reminderDate) {
    errors.reminderDate = 'Please choose a date.';
  } else {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (reminderDate < today) errors.reminderDate = 'Please choose today or a future date.';
  }
  return errors;
}

// Turn a failed API response (Django REST Framework style) into form errors.
async function parseServerErrors(response) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // response had no JSON body
  }

  const fieldMap = {
    job: 'jobId',
    reminder_name: 'title',
    reminder_date: 'reminderDate',
  };
  const errors = {};

  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const message = Array.isArray(value) ? value.join(' ') : String(value);
      errors[fieldMap[key] || 'form'] = message;
    });
  }
  if (Object.keys(errors).length === 0) {
    errors.form = `Could not save the reminder (error ${response.status}).`;
  }
  return errors;
}

const errorStyle = { color: '#b00020', margin: '4px 0 8px' };

function NotificationsView() {
  // STATE 1: reminders for the logged-in user (from the database)
  const [reminders, setReminders] = useState([]);

  // STATE 2: the logged-in user's job applications (for the dropdown)
  const [jobs, setJobs] = useState([]);

  // STATE 3: what the user is typing in the add-reminder form
  const [formData, setFormData] = useState({ title: '', reminderDate: '', jobId: '' });

  // STATE 4: validation / server errors, keyed by field (jobId, title, reminderDate, form)
  const [errors, setErrors] = useState({});

  // STATE 5: request status
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
        setLoadError('Could not load your reminders. Please refresh the page and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // HANDLER: update the form as the user types (and clear that field's error)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined, form: undefined }));
  };

  // HANDLER: validate, then add a reminder (saved in the database)
  const handleAddReminder = async (event) => {
    event.preventDefault();
    if (isSaving) return;

    const clientErrors = validateReminder(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});
    setIsSaving(true);

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
          reminder_name: formData.title.trim(),
          reminder_date: formData.reminderDate.slice(0, 10), // database stores the date only
        }),
      });

      if (!response.ok) {
        // Keep what the user typed and show the server's messages next to the fields
        setErrors(await parseServerErrors(response));
        return;
      }

      const created = await response.json();
      setReminders((previous) => [...previous, created]);
      setFormData({ title: '', reminderDate: '', jobId: '' }); // clear only on success
      setErrors({});
    } catch (error) {
      console.error('Failed to add reminder:', error);
      setErrors({ form: 'Could not save the reminder. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // HANDLER: delete a reminder (removed from the database)
  const handleDeleteReminder = async (id) => {
    setDeleteError('');
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
      setDeleteError('Could not delete the reminder. Please try again.');
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

  // The reminder lists, or a loading / error / empty state in their place
  const renderReminderLists = () => {
    if (isLoading) return <p>Loading reminders...</p>;
    if (loadError) return <p role="alert" style={errorStyle}>{loadError}</p>;

    if (allReminders.length === 0) {
      return (
        <div className="empty-state">
          <p><strong>No reminders yet</strong></p>
          <p>Choose an application, add a label and a date below, then click "Add Reminder" to create your first one.</p>
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <div className="notifications">

      <div className="add-reminder">
        {renderReminderLists()}
        {deleteError && <p role="alert" style={errorStyle}>{deleteError}</p>}
      </div>

      <h2>Add a reminder</h2>
      <form onSubmit={handleAddReminder} noValidate>
        <label htmlFor="reminder-job">Application</label>
        <select className="form-input"
          id="reminder-job"
          name="jobId"
          value={formData.jobId}
          onChange={handleChange}
          aria-invalid={!!errors.jobId}
        >
          <option value="">Select an application</option>
          {jobs.map((job) => (
            <option key={job.job_id} value={job.job_id}>
              {job.company} ({job.position})
            </option>
          ))}
        </select>
        {!isLoading && !loadError && jobs.length === 0 && (
          <p>You have no applications yet. Add an application first, then you can set reminders for it.</p>
        )}
        {errors.jobId && <p role="alert" style={errorStyle}>{errors.jobId}</p>}

        <label htmlFor="reminder-title">Reminder label</label>
        <input className="form-input"
          id="reminder-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Reminder (e.g. Follow up with Meta)"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p role="alert" style={errorStyle}>{errors.title}</p>}

        <label htmlFor="reminder-date">Reminder date</label>
        <input className="form-input"
          id="reminder-date"
          type="date"
          name="reminderDate"
          value={formData.reminderDate}
          onChange={handleChange}
          aria-invalid={!!errors.reminderDate}
        />
        {errors.reminderDate && <p role="alert" style={errorStyle}>{errors.reminderDate}</p>}

        {errors.form && <p role="alert" style={errorStyle}>{errors.form}</p>}

        <button className="button secondary" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Add Reminder'}
        </button>
      </form>

    </div>
  );
}

export default NotificationsView;