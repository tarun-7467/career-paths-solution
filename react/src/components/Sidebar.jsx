const menuItems = [
  {
    label: "Dashboard",
  },
  {
    label: "Calendar",
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

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
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
