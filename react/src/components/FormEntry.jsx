import { useState } from "react";

function FormEntry() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form submitted:", formData);

    // API call can be added here later.

    setFormData({
      name: "",
      email: "",
      category: "",
      notes: "",
    });
  };

  return (
    <section className="form-card">
      <div className="form-header">
        <p>Create a new application entry.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="company">Company</label>

            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>

            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter position"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">...</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateApplied">Date Applied</label>

            <input
              id="dateApplied"
              name="dateApplied"
              type="text"
              value={formData.dateApplied}
              onChange={handleChange}
              placeholder="Enter date"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button secondary">
            Cancel
          </button>

          <button type="submit" className="button primary">
            Add Entry
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormEntry;
