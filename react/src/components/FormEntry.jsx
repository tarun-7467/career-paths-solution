import { useState } from "react";

function FormEntry({ editingApplication = null, onCancel = () => {} }) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "",
    dateApplied: "",
    notes: "",
    reminderDate: "",
  });

  // Change handling function
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Clear the form and tell the parent we cancelled
  const handleCancel = () => {
    setFormData({
      company: "",
      position: "",
      status: "",
      dateApplied: "",
      notes: "",
      reminderDate: "",
    });
    onCancel();
  };

  // Handle form submission for adding or updating applications
  // Django integration will be added later
  const handleSubmit = (event) => {
      event.preventDefault();

      const applicationData = {
          company: formData.company,
          position: formData.position,
          status: formData.status,
          date_applied: formData.dateApplied,
          notes: formData.notes,
      };

// Save the entry in the browser so other pages can read it
const saved = JSON.parse(localStorage.getItem("applications") || "[]");
const newEntry = { id: Date.now(), ...formData };
localStorage.setItem("applications", JSON.stringify([...saved, newEntry]));

    setFormData({
      company: "",
      position: "",
      status: "",
      dateApplied: "",
      notes: "",
      reminderDate: "",
    });
  };

  // Form output
  return (
    <section className="form-card">
      <div className="form-header">
        <p>Create a new application entry.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          {/* Company name form block, standard text input */}
          <div className="form-group">
            <label htmlFor="company">Company</label>

            <input
              className="form-input"
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company"
              required
            />
          </div>

          {/* Positon form block, standard text input */}
          <div className="form-group">
            <label htmlFor="position">Position</label>

            <input
              className="form-input"
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter position"
              required
            />
          </div>

          {/* Status form block, uses drop down values for input */}
          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              className="form-input"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">...</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date form block, date data type input */}
          <div className="form-group">
            <label htmlFor="dateApplied">Date Applied</label>

            <input
              className="form-input"
              id="dateApplied"
              name="dateApplied"
              type="date"
              value={formData.dateApplied}
              onChange={handleChange}
              placeholder="Enter date"
              required
            />
          </div>

          {/* Note form block, standard text type */}
          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>

            <textarea
              className="form-input"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes"
              rows="4"
            />
          </div>
               <div className="form-group full-width">
            <label htmlFor="reminderDate">Remind me on</label>

            <input
              className="form-input"
              type="datetime-local"
              id="reminderDate"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submission buttons */}
        <div className="form-actions">
          <button
              type="button"
              className="button secondary"
              onClick={handleCancel}
          >
              Cancel
          </button>

          <button type="submit" className="button primary">
              {editingApplication ? "Save Changes" : "Add Entry"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormEntry;
