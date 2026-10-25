
import { useState, useEffect } from 'react';

// Component imports
import Sidebar from '../components/Sidebar.jsx';
import FormEntry from '../components/FormEntry.jsx';
import Header from '../components/Header.jsx';
import ApplicationList from '../components/ApplicationList.jsx';

// Widget import for Calendar
import CalendarWidget from '../components/CalendarWidget.jsx'

import NotificationsWidget from '../components/NotificationsWidget.jsx'

// Styling imports
import '../stylesheets/Dashboard.css';

function Dashboard() {
    // Simulated logged-in user
    const currentUserId = 1;

    // Store applications in React state
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/job-applications/', {
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setApplications(data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    fetchApplications();

    return () => controller.abort();
}, []);

    // Track the selected application
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Track the application being edited
    const [editingApplication, setEditingApplication] = useState(null);

    // Add a new application through the Django API
    const handleAddApplication = async (newApplication) => {
        try {
            const response = await fetch('/api/job-applications/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newApplication,
                    user: currentUserId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const savedApplication = await response.json();

            setApplications((previous) => [
                ...previous,
                savedApplication,
            ]);

            return true;
        } catch (err) {
            console.error('Failed to add application:', err);
            return false;
        }
    };

    // Update an existing application through the Django API
    const handleUpdateApplication = async (updatedApplication) => {
        if (!editingApplication) {
            return false;
        }

        try {
            const response = await fetch(
                `/api/job-applications/${editingApplication.job_id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedApplication),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const savedApplication = await response.json();

            setApplications((previous) =>
                previous.map((application) =>
                    application.job_id === savedApplication.job_id
                        ? savedApplication
                        : application
                )
            );

            if (selectedApplication?.job_id === savedApplication.job_id) {
                setSelectedApplication(savedApplication);
            }

            setEditingApplication(null);

            return true;
        } catch (err) {
            console.error('Failed to update application:', err);
            return false;
        }
    };

    // Cancel editing an application
    const handleCancelEdit = () => {
        setEditingApplication(null);
    };

    // Delete an application through the Django API
    const handleDeleteApplication = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/job-applications/${jobId}/`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setApplications((previous) =>
                previous.filter(
                    (application) => application.job_id !== jobId
                )
            );

            if (selectedApplication?.job_id === jobId) {
                setSelectedApplication(null);
            }

            if (editingApplication?.job_id === jobId) {
                setEditingApplication(null);
            }
        } catch (err) {
            console.error('Failed to delete application:', err);
            alert("Failed to delete application. Please try again.");
        }
    };

    // Show only applications belonging to the current user
    const userApplications = applications.filter(
        (application) => application.user === currentUserId
    );

    return (
        <div className="dashboard">
            <Header />
            <Sidebar />

            <main className="dashboard-content">
                
                <CalendarWidget applications={userApplications} />
                <NotificationsWidget />
                <section className="applications-panel">
                    <div className="panel-header">
                        <h2>My Applications</h2>
                    </div>

                    {loading ? (
                        <p>Loading applications...</p>
                    ) : error ? (
                        <p role="alert">
                            Failed to load applications: {error}
                        </p>
                    ) : (
                        <ApplicationList
                            applications={userApplications}
                            onSelect={setSelectedApplication}
                            onDelete={handleDeleteApplication}
                            onEdit={setEditingApplication}
                        />
                    )}

                    <div
                    className={`application-details-container ${
                    selectedApplication ? "details-open" : ""
                    }`}
                    aria-hidden={!(selectedApplication)}
                    inert={!(selectedApplication)}
                    >
                        <section className="application-details">
                            <h3>Application Details</h3>

                            <p>
                                <strong>Company:</strong>{' '}
                                {selectedApplication?.company}
                            </p>

                            <p>
                                <strong>Position:</strong>{' '}
                                {selectedApplication?.position}
                            </p>

                            <p>
                                <strong>Status:</strong>{' '}
                                {selectedApplication?.status}
                            </p>

                            <p>
                                <strong>Date Applied:</strong>{' '}
                                {selectedApplication?.date_applied}
                            </p>

                            <p>
                                <strong>Notes:</strong>{' '}
                                {selectedApplication?.notes}
                            </p>

                            <button
                                type="button"
                                className="button secondary"
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close Details
                            </button>
                        </section>
                    </div>


                    <FormEntry
                      key={editingApplication?.job_id ?? "new"}
                      onAddApplication={handleAddApplication}
                      onUpdateApplication={handleUpdateApplication}
                      editingApplication={editingApplication}
                      onCancelEdit={handleCancelEdit}
                    />
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
