
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import '../stylesheets/Dashboard.css';

function Account({ user, onLogout }) {
  return (
    <div className="dashboard">
      <Header user={user} onLogout={onLogout} />

      <Sidebar />

      <main className="dashboard-content">
        <section className="applications-panel">
          <div className="panel-header">
            <h2>My Account</h2>
          </div>

          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>User ID:</strong> {user?.user_id}
          </p>
        </section>
      </main>
    </div>
  );
}

export default Account;
