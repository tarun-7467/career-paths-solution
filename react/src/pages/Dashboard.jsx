import Sidebar from '../components/Sidebar.jsx'
import FormEntry from '../components/FormEntry.jsx'
import Header from '../components/Header.jsx'
import '../stylesheets/Dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard">
            <Header />
            <Sidebar />
            <main className="dashboard-content">
                <section className="applications-panel">
                    <div className="panel-header">
                        <h2>Applications</h2>
                    </div>

                    <FormEntry />
                </section>
            </main>
        </div>
    );
}

export default Dashboard;