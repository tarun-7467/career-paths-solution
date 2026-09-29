import Sidebar from '../components/Sidebar.jsx'
import StatCard from '../components/StatCard.jsx'
import FormEntry from '../components/FormEntry.jsx'
import Header from '../components/Header.jsx'
import '../stylesheets/Dashboard.css'

function Dashboard() {
    const sample_data = [
    { title: "Applications submitted this month", value: "17" },
    { title: "Pending applications", value: "14" },
  ];


return (
    <div className="dashboard">
        <Header />
        <Sidebar />
        <section className="stats">
            {sample_data.map((sample_data) => (
                <StatCard key={sample_data.title} {...sample_data} />
            ))}
        </section>
        <FormEntry />
    </div>
);
}

export default Dashboard;