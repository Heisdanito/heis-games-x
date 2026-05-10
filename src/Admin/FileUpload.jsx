import { useState, useRef } from "react";

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const EXT_ICONS = {
  pdf: "📄", doc: "📝", docx: "📝",
  png: "🖼", jpg: "🖼", jpeg: "🖼",
  xlsx: "📊", xls: "📊", zip: "📦",
};




function getIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  return EXT_ICONS[ext] || "📄";
}



function formatBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}



export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    setError("");
    setSuccess("");
    if (f.size > MAX_BYTES) {
      setError(`File too large: ${formatBytes(f.size)}. Maximum allowed is 3 MB.`);
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setSuccess(`"${file.name}" uploaded successfully.`);
      setFile(null);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }, 1400);
  };



  return (
    <div style={styles.content}>
      <h2 style={styles.heading}>Upload a File</h2>
      <p style={styles.sub}>Supported formats: PDF, DOCX, PNG, JPG, XLSX · Max size: 3 MB</p>

      <div style={styles.card}>
        {/* Drop Zone */}
        
        <div
          style={{ ...styles.dropZone, ...(dragging ? styles.dropZoneActive : {}) }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >

          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          <div style={styles.dropIcon}>📂</div>
          <p style={styles.dropText}>
            Drag & drop your file here, or{" "}
            <span style={styles.browseLink}>browse</span>
          </p>
          <p style={styles.fileLimit}>Maximum file size: 3 MB</p>
        </div>

        {/* File Preview */}
        {file && (
          <div style={styles.preview}>
            <span style={{ fontSize: 22 }}>{getIcon(file.name)}</span>
            <div style={styles.previewInfo}>
              <div style={styles.previewName}>{file.name}</div>
              <div style={styles.previewSize}>{formatBytes(file.size)}</div>
            </div>
            <button
              onClick={() => { setFile(null); setError(""); if (inputRef.current) inputRef.current.value = ""; }}
              style={styles.removeBtn}
            >✕</button>
          </div>
        )}

        {/* Error */}
        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ ...styles.uploadBtn, opacity: (!file || uploading) ? 0.45 : 1 }}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
        {/* Success */}
        {success && (
          <div style={styles.successBanner}>
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  content: { flex: 1, padding: 28, overflowY: "auto", background: "#f0f2f8" },
  heading: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6b7280", marginBottom: 24 },
  card: {
    background: "#fff", borderRadius: 12,
    border: "0.5px solid #e5e7eb",
    padding: 28, maxWidth: 560,
  },
  dropZone: {
    border: "1.5px dashed #4f7fff",
    borderRadius: 10, padding: "36px 20px",
    textAlign: "center", cursor: "pointer",
    background: "#f5f7ff", marginBottom: 20,
    transition: "background 0.15s",
  },
  dropZoneActive: { background: "#e0e8ff", borderStyle: "solid" },
  dropIcon: { fontSize: 32, marginBottom: 10 },
  dropText: { fontSize: 14, color: "#6b7280", lineHeight: 1.6 },
  browseLink: { color: "#4f7fff", fontWeight: 600, cursor: "pointer" },
  fileLimit: { fontSize: 11, color: "#9ca3af", marginTop: 6 },
  preview: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 14px", background: "#f5f7ff",
    borderRadius: 8, border: "0.5px solid #e5e7eb",
    marginBottom: 16,
  },
  previewInfo: { flex: 1 },
  previewName: { fontSize: 13.5, fontWeight: 500, color: "#111827" },
  previewSize: { fontSize: 12, color: "#6b7280" },
  removeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#9ca3af", fontSize: 14, padding: "2px 6px", borderRadius: 4,
  },
  errorMsg: {
    fontSize: 12.5, color: "#e24b4a",
    padding: "8px 12px", background: "#fcebeb",
    borderRadius: 6, marginBottom: 12,
  },
  uploadBtn: {
    width: "100%", padding: 11,
    background: "#4f7fff", color: "#fff",
    border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    transition: "background 0.15s",
  },
  successBanner: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 16px", background: "#eaf3de",
    borderRadius: 8, color: "#3b6d11",
    fontSize: 13, fontWeight: 500, marginTop: 14,
  },
};