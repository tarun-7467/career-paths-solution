
function ApplicationList({ applications, onSelect, onDelete, onEdit }) {
  return (
    <section className="application-list">
      <h2>My Job Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.job_id}>
                <td>{application.company}</td>
                <td>{application.position}</td>
                <td>{application.status}</td>
                <td>{application.date_applied}</td>
                <td>
                  {/* View Details button */}  
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => onSelect(application)}
                  >
                    View Details
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => onEdit(application)}
                    >
                    Edit
                    </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to delete this application?")) {
                        onDelete(application.job_id);
                        }
                    }}
                    >
                    Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ApplicationList;
