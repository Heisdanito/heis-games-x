// components/Header.jsx (updated)
export default function Header({ title }) {
  return (
    <header style={styles.header}>
      <div style={styles.title}>{title}</div>
      <div style={styles.right}>
        <span style={styles.badge}>ADMIN</span>
        <div style={styles.avatar}>
          <span>HX</span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "#fff",
    padding: "0 28px",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  badge: {
    background: "#f3f4f6",
    color: "#4b5563",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: 20,
    letterSpacing: 0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f7fff, #6366f1)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};