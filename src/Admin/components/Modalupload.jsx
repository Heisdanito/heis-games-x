// import {useState} from 'react'

// export default function Modalupload() {
//   const [modalStautus , setModalStatus] = useState(false);
//   const [error, setError] = useState("");

//   const handleUnlock = () => {
//     if (!modalStautus) {
//       setError("");
//       setModalStatus(true);
//     } else {
//       setError("Incorrect password. Please try again.");
//       setPassword("");
//     }
//   };


//   return (
//     <div style={styless.overlayo}>
//       <div style={styless.box}>
//         <div style={styless.logo}>
//           HEI<span style={styless.logoAccent}>SX</span>
//         </div>
//         <p style={styless.sub}>Admin access is restricted. Enter your password to continue.</p>

//         <label style={styless.label}>PASSWORD</label>
//         <input
//           type="password"
//           placeholder="••••••••"
//           style={styless.input}
//           autoFocus
//         />
//         {/* {error && <div style={styles.error}>{error}</div>} */}

//         <button style={styless.btn}
//           onClick={handleUnlock}
//         >
//           Unlock Admin
//         </button>
//         <p style={styless.hint}>Demo password: <strong>admin123</strong></p>
//       </div>
//     </div>
//   );
// }

// const styless = {
//   overlayo: {
//     position: "fixed", inset: 0,
//     background: "rgba(10,12,26,0.75)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 1000,
//   },
//   box: {
//     background: "#fff", borderRadius: 14,
//     padding: "32px 28px 24px", width: 340,
//     boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
//   },
//   logo: { fontSize: 22, fontWeight: 700, letterSpacing: 2, marginBottom: 6, color: "#1a1d2e" },
//   logoAccent: { color: "#4f7fff" },
//   sub: { fontSize: 13, color: "#6b7280", marginBottom: 22, lineHeight: 1.6 },
//   label: { display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" },
//   input: {
//     width: "100%", padding: "10px 13px",
//     border: "1px solid #d1d5db", borderRadius: 8,
//     fontSize: 14, outline: "none", letterSpacing: 2,
//     marginBottom: 6, boxSizing: "border-box",
//   },
//   error: { fontSize: 12, color: "#e24b4a", marginBottom: 12, minHeight: 18 },
//   btn: {
//     width: "100%", padding: 11,
//     background: "#4f7fff", color: "#fff",
//     border: "none", borderRadius: 8,
//     fontSize: 14, fontWeight: 600, cursor: "pointer",
//     marginTop: 4,
//   },
//   hint: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12 },
// };
