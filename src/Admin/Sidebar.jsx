// components/Sidebar.jsx (updated)
export default function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    { id: "upload", label: "Upload Game", icon: "📤" },
    { id: "manager", label: "Manage Games", icon: "📋" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        HEI<span style={styles.logoAccent}>SX</span>
        <span style={styles.logoBadge}>Admin</span>
      </div>
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              ...styles.navItem,
              ...(activePage === item.id ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={styles.footer}>
        <div style={styles.version}>v2.0.0</div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    background: "#fff",
    borderRight: "0.5px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: {
    padding: "24px 20px 20px",
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1d2e",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoAccent: {
    color: "#4f7fff",
  },
  logoBadge: {
    fontSize: 10,
    background: "#4f7fff",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 20,
    fontWeight: 500,
  },
  nav: {
    flex: 1,
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    background: "none",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    textAlign: "left",
  },
  navItemActive: {
    background: "#eef3ff",
    color: "#4f7fff",
  },
  navIcon: {
    fontSize: 18,
  },
  footer: {
    padding: "20px",
    borderTop: "0.5px solid #e5e7eb",
  },
  version: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
  },
};