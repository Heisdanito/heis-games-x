import { useState } from "react";

const CORRECT_PASSWORD = "admin123";

export default function PasswordModal({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleModal = () => {
    if (password === CORRECT_PASSWORD) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <div style={styles.logo}>
          HEI<span style={styles.logoAccent}>SX</span>
        </div>
        <p style={styles.sub}>Admin access is restricted. Enter your password to continue.</p>

        <label style={styles.label}>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleModal()}
          placeholder="••••••••"
          style={styles.input}
          autoFocus
        />
        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleModal} style={styles.btn}>
          Unlock Admin
        </button>
        <p style={styles.hint}>password: <strong>#########</strong></p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(10,12,26,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#fff", borderRadius: 14,
    padding: "32px 28px 24px", width: 340,
    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
  },
  logo: { fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 6, color: "#1a1d2e" },
  logoAccent: { color: "#4f7fff" },
  sub: { fontSize: 13, color: "#6b7280", marginBottom: 22, lineHeight: 1.6 },
  label: { display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" },
  input: {
    width: "100%", padding: "10px 13px",
    border: "1px solid #d1d5db", borderRadius: 8,
    fontSize: 14, outline: "none", letterSpacing: 2,
    marginBottom: 6, boxSizing: "border-box",
  },
  error: { fontSize: 12, color: "#e24b4a", marginBottom: 12, minHeight: 18 },
  btn: {
    width: "100%", padding: 11,
    background: "#4f7fff", color: "#fff",
    border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    marginTop: 4,
  },
  hint: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12 },
};
