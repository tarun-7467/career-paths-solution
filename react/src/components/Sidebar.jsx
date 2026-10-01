// Determine navigation item label, whether or not it is clickable, and url path
const menuItems = [
  {
    label: "Dashboard",
    active: true,
    path: "/dashboard"
  },
  {
    label: "Calendar",
    active: true,
    path: "/calendar"
  },
  {
    label: "Notifications",
  },
  {
    label: "Account",
  },
  {
    label: "Settings",
  },
];

// Component function
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`sidebar-link ${item.active ? "active" : ""}`}
          >
            <span className="sidebar-text">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
