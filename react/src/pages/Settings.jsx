import { useState, useEffect } from 'react';

// Component imports
import Header from '../components/Header.jsx'
import Sidebar from '../components/Sidebar.jsx'

import '../stylesheets/Dashboard.css';

function Settings() {
    return (
        <div className="dashboard">
            <Header />
            <Sidebar />
            <main className="dashboard-content">
                <section className="settings-widget">
                    <div className="panel-header">
                        <h2>Settings</h2>
                    </div>
                    <div className="settings">
                        <div className="setting">
                            <p>Dark Mode</p>
                            <input className="react-switch" id={'darkmode-switch'} type="checkbox" />
                        </div>
                        <div className="setting">
                            <p>Enable/Disable Components</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Settings;