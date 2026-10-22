import { useState , useEffect } from 'react';

import '../stylesheets/Dashboard.css';

// Read a list from the browser's saved data
function loadList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    return [];
  }
}

function NotificationsView() {
  // STATE 1: reminders added on this page (saved under "reminders")
  const [reminders, setReminders] = useState(() => loadList('reminders'));

  // STATE 2: applications saved by the form (only read, never changed here)
  const [applications] = useState(() => loadList('applications'));

  // STATE 3: what the user is typing in the add-reminder form
  const [formData, setFormData] = useState({ title: '', reminderDate: '' });

  // Save the reminders list every time it changes
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  // HANDLER: update the form as the user types
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  // HANDLER: add a new reminder
  const handleAddReminder = (event) => {
    event.preventDefault();
    if (!formData.title || !formData.reminderDate) return;

    const newReminder = { id: Date.now(), ...formData };
    setReminders((previous) => [...previous, newReminder]);
    setFormData({ title: '', reminderDate: '' }); // clear the form
  };

  // HANDLER: delete a reminder by its id
  const handleDeleteReminder = (id) => {
    setReminders((previous) => previous.filter((r) => r.id !== id));
  };

  // LISTING: combine both sources into one list, soonest first
  const applicationReminders = applications
    .filter((app) => app.reminderDate)
    .map((app) => ({
      id: `app-${app.id}`,
      title: `${app.company} (${app.position})`,
      reminderDate: app.reminderDate,
      notes: app.notes,
      canDelete: false
    }));

  const customReminders = reminders.map((r) => ({
    id: `rem-${r.id}`,
    rawId: r.id,
    title: r.title,
    reminderDate: r.reminderDate,
    canDelete: true
  }));

  const allReminders = [...applicationReminders, ...customReminders].sort(
    (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate)
  );

  const now = new Date();
  const dueReminders = allReminders.filter((r) => new Date(r.reminderDate) <= now);
  const upcomingReminders = allReminders.filter((r) => new Date(r.reminderDate) > now);

  const formatDate = (value) => new Date(value).toLocaleString();

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