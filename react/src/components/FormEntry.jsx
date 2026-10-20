import { useState, useEffect } from "react";

function FormEntry({
  onAddApplication,
  onUpdateApplication,
  editingApplication,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(() => ({
      company: editingApplication?.company ?? "",
      position: editingApplication?.position ?? "",
      status: editingApplication?.status ?? "",
      dateApplied: editingApplication?.date_applied ?? "",
      notes: editingApplication?.notes ?? "",
  }));
<<<<<<< HEAD

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        company: editingApplication.company ?? "",
        position: editingApplication.position ?? "",
        status: editingApplication.status ?? "",
        dateApplied: editingApplication.date_applied ?? "",
        notes: editingApplication.notes ?? "",
      });
    }
  }, [editingApplication]);

  // Boolean for Application form use state
  const [applicationForm, showApplicationForm] = useState(null);
=======
>>>>>>> origin/main

  // Change handling function
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
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

      if (editingApplication) {
          // Update an existing application
          onUpdateApplication(applicationData);
      } else {
          // Add a new application
          onAddApplication(applicationData);
      }

      // Clear the form after submission
      setFormData({
          company: "",
          position: "",
          status: "",
          dateApplied: "",
          notes: "",
      });

      onCancelEdit();
  };

  // Cancel editing and clear the form
  const handleCancel = () => {
      setFormData({
          company: "",
          position: "",
          status: "",
          dateApplied: "",
          notes: "",
      });

<<<<<<< HEAD
      showApplicationForm(null);
=======
>>>>>>> origin/main
      onCancelEdit();
  };

  // Form output
  return (
    <section className="form-card">
      {/* View application entry button */}  
      <button
        type="button"
        className={`button secondary ${
          applicationForm ? "button-hidden" : ""
        }`}
        onClick={() => showApplicationForm({...applicationForm})}
      >
        Create a new application entry
      </button>

      {/* Display wrapper on editing or creating new application */}
      <div
        className={`form-container ${
          applicationForm || editingApplication ? "form-open" : ""
        }`}
        aria-hidden={!(applicationForm || editingApplication)}
        inert={!(applicationForm || editingApplication)}
      >
      <div className="form-header">
        <h2>Create or modify your application</h2>
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
      </div>
    </section>
  );
}

export default FormEntry;
