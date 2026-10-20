
<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> origin/main

// Component imports
import Sidebar from '../components/Sidebar.jsx';
import FormEntry from '../components/FormEntry.jsx';
import Header from '../components/Header.jsx';
import ApplicationList from '../components/ApplicationList.jsx';

// Mock data
import { jobApplications } from './mockData.js';
<<<<<<< HEAD
=======

// Widget import for Calendar
import CalendarWidget from '../components/CalendarWidget.jsx'
>>>>>>> origin/main

// Styling imports
import '../stylesheets/Dashboard.css';

function Dashboard() {
    // Simulated logged-in user
    const currentUserId = 1;

    // Store applications in React state
    const [applications, setApplications] = useState(jobApplications);

    // Track the selected application
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Track the application being edited
    const [editingApplication, setEditingApplication] = useState(null);

    // Add a new application to the list
    const handleAddApplication = (newApplication) => {
        const nextId = applications.reduce(
            (maxId, application) => Math.max(maxId, application.job_id),
            0
        ) + 1;

        const application = {
            ...newApplication,
            job_id: nextId,
            user_id: currentUserId,
        };

        setApplications((previous) => [...previous, application]);
    };

    // Save changes to an existing application
    const handleUpdateApplication = (updatedApplication) => {
        setApplications((previous) =>
            previous.map((application) =>
                application.job_id === editingApplication.job_id
                    ? { ...application, ...updatedApplication }
                    : application
            )
        );

        // Update the details panel if this application is selected
        if (selectedApplication?.job_id === editingApplication.job_id) {
            setSelectedApplication({
                ...selectedApplication,
                ...updatedApplication,
            });
        }

        // Exit edit mode
        setEditingApplication(null);
    };

    // Cancel editing an application
    const handleCancelEdit = () => {
        setEditingApplication(null);
    };

    // Delete an application by its ID
    const handleDeleteApplication = (jobId) => {
        setApplications((previous) =>
            previous.filter((application) => application.job_id !== jobId)
        );

        // Close details if the deleted application is selected
        if (selectedApplication?.job_id === jobId) {
            setSelectedApplication(null);
        }
    };

    // Show only applications belonging to the current user
    const userApplications = applications.filter(
        (application) => application.user_id === currentUserId
    );

    return (
        <div className="dashboard">
            <Header />
            <Sidebar />

            <main className="dashboard-content">
                < CalendarWidget />
                <section className="applications-panel">
                    <div className="panel-header">
                        <h2>My Applications</h2>
                    </div>

<<<<<<< HEAD
=======
                    <FormEntry
                        key={editingApplication?.job_id ?? 'new'}
                        onAddApplication={handleAddApplication}
                        onUpdateApplication={handleUpdateApplication}
                        editingApplication={editingApplication}
                        onCancelEdit={handleCancelEdit}
                    />

>>>>>>> origin/main
                    <ApplicationList
                        applications={userApplications}
                        onSelect={setSelectedApplication}
                        onDelete={handleDeleteApplication}
                        onEdit={setEditingApplication}
                    />

<<<<<<< HEAD
                    <div
                    className={`application-details-container ${
                    selectedApplication ? "details-open" : ""
                    }`}
                    aria-hidden={!(selectedApplication)}
                    inert={!(selectedApplication)}
                    >
=======
                    {selectedApplication && (
>>>>>>> origin/main
                        <section className="application-details">
                            <h3>Application Details</h3>

                            <p>
                                <strong>Company:</strong>{' '}
<<<<<<< HEAD
                                {selectedApplication?.company}
=======
                                {selectedApplication.company}
>>>>>>> origin/main
                            </p>

                            <p>
                                <strong>Position:</strong>{' '}
<<<<<<< HEAD
                                {selectedApplication?.position}
=======
                                {selectedApplication.position}
>>>>>>> origin/main
                            </p>

                            <p>
                                <strong>Status:</strong>{' '}
<<<<<<< HEAD
                                {selectedApplication?.status}
=======
                                {selectedApplication.status}
>>>>>>> origin/main
                            </p>

                            <p>
                                <strong>Date Applied:</strong>{' '}
<<<<<<< HEAD
                                {selectedApplication?.date_applied}
=======
                                {selectedApplication.date_applied}
>>>>>>> origin/main
                            </p>

                            <p>
                                <strong>Notes:</strong>{' '}
<<<<<<< HEAD
                                {selectedApplication?.notes}
=======
                                {selectedApplication.notes}
>>>>>>> origin/main
                            </p>

                            <button
                                type="button"
                                className="button secondary"
                                onClick={() => setSelectedApplication(null)}
                            >
                                Close Details
                            </button>
                        </section>
<<<<<<< HEAD
                    </div>
                    

                    <FormEntry
                        onAddApplication={handleAddApplication}
                        onUpdateApplication={handleUpdateApplication}
                        editingApplication={editingApplication}
                        onCancelEdit={handleCancelEdit}
                    />
=======
                    )}
>>>>>>> origin/main
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
