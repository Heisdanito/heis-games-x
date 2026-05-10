// GameUploadForm.jsx - Updated with correct file handling
import { useState, useRef } from "react";
import { url_endponit } from "../../../backend/api/data_endpoit";

const MAX_TORRENT_BYTES = 50 * 1024 * 1024; // 50 MB for torrent files

const GAME_CATEGORIES = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "racing", label: "Racing" },
  { value: "sports", label: "Sports" },
  { value: "fighting", label: "Fighting" },
  { value: "horror", label: "Horror" },
  { value: "rpg", label: "RPG" },
  { value: "strategy", label: "Strategy" },
];

const PLATFORMS = ["PC", "PS4", "PS5", "Xbox One", "Xbox Series X", "Nintendo Switch"];
const RATINGS = [0, 1, 2, 3, 4, 5];

const TAGS = [
  { value: "hot", label: "🔥 Hot" },
  { value: "new", label: "🆕 New" },
  { value: "trending", label: "📈 Trending" },
  { value: "top", label: "⭐ Top Rated" },
  { value: "", label: "None" },
];

// Convert torrent to bin for upload (same binary data, different extension)
const convertTorrentToBin = (torrentFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      const binFileName = torrentFile.name.replace(/\.torrent$/i, '.bin');
      const binFile = new File([blob], binFileName, { type: "application/octet-stream" });
      resolve(binFile);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(torrentFile);
  });
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function GameUploadForm({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    game: "",
    games_cat: "adventure",
    type: "normal",
    platform: "PC",
    rating: 0,
    year: new Date().getFullYear().toString(),
    tag: "",
    description: "",
    colour_code: "#4f7fff",
    ram: "",
    gpu: "",
    cpu: "",
    windows: "",
  });

  const [torrentFile, setTorrentFile] = useState(null);
  const [originalTorrentName, setOriginalTorrentName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draggingTorrent, setDraggingTorrent] = useState(false);
  const [draggingImage, setDraggingImage] = useState(false);
  
  const torrentInputRef = useRef();
  const imageInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTorrentFile = async (file) => {
    setError("");
    
    // Check if it's a torrent file
    if (!file.name.toLowerCase().endsWith(".torrent")) {
      setError("Please upload a valid .torrent file");
      return false;
    }
    
    if (file.size > MAX_TORRENT_BYTES) {
      setError(`Torrent file too large: ${formatBytes(file.size)}. Maximum is 50 MB`);
      return false;
    }
    
    try {
      // Convert torrent to .bin format for upload
      const binFile = await convertTorrentToBin(file);
      setTorrentFile(binFile);
      setOriginalTorrentName(file.name);
      return true;
    } catch (err) {
      setError("Failed to process torrent file: " + err.message);
      return false;
    }
  };

  const handleImageFile = (file) => {
    setError("");
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, WEBP)");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`Image too large: ${formatBytes(file.size)}. Maximum is 5 MB`);
      return false;
    }
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    return true;
  };

  const handleDropTorrent = async (e) => {
    e.preventDefault();
    setDraggingTorrent(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleTorrentFile(file);
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    setDraggingImage(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const removeTorrent = () => {
    setTorrentFile(null);
    setOriginalTorrentName("");
    if (torrentInputRef.current) torrentInputRef.current.value = "";
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    // Validation
    if (!formData.game.trim()) {
      setError("Game name is required");
      setUploading(false);
      return;
    }
    if (!torrentFile) {
      setError("Please upload a torrent file");
      setUploading(false);
      return;
    }
    if (!imageFile) {
      setError("Please upload a game cover/image");
      setUploading(false);
      return;
    }

    // Create FormData object for multipart upload
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });
    
    // Add files (torrent is already converted to .bin)
    submitData.append("torrent_file", torrentFile);
    submitData.append("image_file", imageFile);

    try {
      // API endpoint - adjust path based on your setup
      const url = url_endponit.inserData;
      
      const response = await fetch(url, {
        method: "POST",
        body: submitData,
      });

      // Check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Upload failed");
        } catch (e) {
          throw new Error("Server error occurred");
        }
      }

      const result = await response.json();

      if (result.status === "success") {
        setSuccess(`Game "${formData.game}" uploaded successfully!`);
        
        // Reset form
        setFormData({
          game: "",
          games_cat: "adventure",
          type: "normal",
          platform: "PC",
          rating: 0,
          year: new Date().getFullYear().toString(),
          tag: "",
          description: "",
          colour_code: "#4f7fff",
          ram: "",
          gpu: "",
          cpu: "",
          windows: "",
        });
        removeTorrent();
        removeImage();
        
        if (onUploadSuccess) onUploadSuccess();
        
        setTimeout(() => setSuccess(""), 5000);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload game");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formHeader}>
          <h2 style={styles.heading}>Add New Game</h2>
          <p style={styles.subheading}>Fill in the game details and upload the torrent file</p>
        </div>

        <div style={styles.twoColumn}>
          <div style={styles.leftColumn}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Game Title <span style={styles.required}>*</span></label>
              <input
                type="text"
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                placeholder="e.g., Spider-Man 2"
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category</label>
                <select name="games_cat" value={formData.games_cat} onChange={handleInputChange} style={styles.select}>
                  {GAME_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} style={styles.select}>
                  <option value="normal">Normal</option>
                  <option value="banner">Banner</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Platform</label>
                <select name="platform" value={formData.platform} onChange={handleInputChange} style={styles.select}>
                  {PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Rating (0-5)</label>
                <select name="rating" value={formData.rating} onChange={handleInputChange} style={styles.select}>
                  {RATINGS.map(rating => (
                    <option key={rating} value={rating}>{rating} {rating === 5 ? "★" : rating === 0 ? "☆" : "⭐"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Release Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleInputChange} placeholder="2025" style={styles.input} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Tag</label>
                <select name="tag" value={formData.tag} onChange={handleInputChange} style={styles.select}>
                  {TAGS.map(tag => (
                    <option key={tag.value} value={tag.value}>{tag.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Accent Color</label>
              <div style={styles.colorWrapper}>
                <input
                  type="color"
                  name="colour_code"
                  value={formData.colour_code}
                  onChange={handleInputChange}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  name="colour_code"
                  value={formData.colour_code}
                  onChange={handleInputChange}
                  style={styles.colorInput}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the game..."
                rows={3}
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.sectionTitle}>
              <span>🖥️</span> System Requirements
            </div>
            
            <div style={styles.fieldGroup}>
              <label style={styles.label}>RAM</label>
              <input type="text" name="ram" value={formData.ram} onChange={handleInputChange} placeholder="e.g., 16GB" style={styles.input} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>GPU</label>
              <input type="text" name="gpu" value={formData.gpu} onChange={handleInputChange} placeholder="e.g., NVIDIA GTX 1060" style={styles.input} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>CPU</label>
              <input type="text" name="cpu" value={formData.cpu} onChange={handleInputChange} placeholder="e.g., Intel Core i5-8400" style={styles.input} />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Windows Version</label>
              <input type="text" name="windows" value={formData.windows} onChange={handleInputChange} placeholder="e.g., 10 64-bit" style={styles.input} />
            </div>
          </div>
        </div>

        <div style={styles.uploadsSection}>
          <div style={styles.sectionTitle}>
            <span>📎</span> File Uploads
          </div>
          
          <div style={styles.fileUploadsRow}>
            <div style={styles.fileUploadCard}>
              <label style={styles.fileLabel}>Torrent File <span style={styles.required}>*</span></label>
              <div
                style={{ ...styles.dropZone, ...(draggingTorrent ? styles.dropZoneActive : {}), ...(torrentFile ? styles.dropZoneFilled : {}) }}
                onClick={() => torrentInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDraggingTorrent(true); }}
                onDragLeave={() => setDraggingTorrent(false)}
                onDrop={handleDropTorrent}
              >
                <input 
                  ref={torrentInputRef} 
                  type="file" 
                  accept=".torrent" 
                  style={{ display: "none" }} 
                  onChange={(e) => e.target.files[0] && handleTorrentFile(e.target.files[0])} 
                />
                {torrentFile ? (
                  <div style={styles.filePreview}>
                    <span style={styles.fileIcon}>🔗</span>
                    <div style={styles.fileInfo}>
                      <div style={styles.fileName}>{originalTorrentName || torrentFile.name}</div>
                      <div style={styles.fileSize}>{formatBytes(torrentFile.size)}</div>
                      <div style={styles.convertedBadge}>🔒 Converted to .bin for secure upload</div>
                    </div>
                    <button type="button" onClick={removeTorrent} style={styles.removeFileBtn}>✕</button>
                  </div>
                ) : (
                  <>
                    <div style={styles.dropIcon}>🔗</div>
                    <p style={styles.dropText}>Drop .torrent file here or <span style={styles.browseLink}>browse</span></p>
                    <p style={styles.fileLimit}>Max size: 50 MB</p>
                  </>
                )}
              </div>
            </div>

            <div style={styles.fileUploadCard}>
              <label style={styles.fileLabel}>Game Cover Image <span style={styles.required}>*</span></label>
              <div
                style={{ ...styles.dropZone, ...(draggingImage ? styles.dropZoneActive : {}), ...(imagePreview ? styles.dropZoneFilled : {}) }}
                onClick={() => imageInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDraggingImage(true); }}
                onDragLeave={() => setDraggingImage(false)}
                onDrop={handleDropImage}
              >
                <input 
                  ref={imageInputRef} 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png,image/webp" 
                  style={{ display: "none" }} 
                  onChange={(e) => e.target.files[0] && handleImageFile(e.target.files[0])} 
                />
                {imagePreview ? (
                  <div style={styles.imagePreviewContainer}>
                    <img src={imagePreview} alt="Game cover preview" style={styles.imagePreviewImg} />
                    <div style={styles.imageOverlay}>
                      <span>{imageFile.name}</span>
                      <button type="button" onClick={removeImage} style={styles.removeImageBtn}>✕ Remove</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.dropIcon}>🖼️</div>
                    <p style={styles.dropText}>Drop image here or <span style={styles.browseLink}>browse</span></p>
                    <p style={styles.fileLimit}>JPG, PNG, WEBP · Max 5 MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorMsg}>
            <span>⚠️</span> {error}
          </div>
        )}
        {success && (
          <div style={styles.successMsg}>
            <span>✓</span> {success}
          </div>
        )}

        <button type="submit" disabled={uploading} style={{ ...styles.submitBtn, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? (
            <>
              <span style={styles.spinner}></span> Uploading...
            </>
          ) : (
            "Upload Game"
          )}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    overflowY: "auto",
    padding: 28,
    background: "#f0f2f8",
  },
  form: {
    maxWidth: 1200,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    padding: "28px 32px",
  },
  formHeader: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: "1px solid #e5e7eb",
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: "#6b7280",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    marginBottom: 28,
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    transition: "all 0.2s",
    outline: "none",
    fontFamily: "inherit",
  },
  select: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  textarea: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },
  colorWrapper: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  colorPicker: {
    width: 48,
    height: 40,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
    padding: 2,
  },
  colorInput: {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "monospace",
    outline: "none",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  uploadsSection: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 20,
    borderTop: "1px solid #e5e7eb",
  },
  fileUploadsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginTop: 12,
  },
  fileUploadCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  fileLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dropZone: {
    border: "2px dashed #cbd5e1",
    borderRadius: 12,
    padding: "24px 16px",
    textAlign: "center",
    cursor: "pointer",
    background: "#fafbfc",
    transition: "all 0.2s",
  },
  dropZoneActive: {
    borderColor: "#4f7fff",
    background: "#eef3ff",
  },
  dropZoneFilled: {
    borderColor: "#22c55e",
    background: "#f0fdf4",
  },
  dropIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  dropText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 6,
  },
  browseLink: {
    color: "#4f7fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  fileLimit: {
    fontSize: 11,
    color: "#9ca3af",
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textAlign: "left",
  },
  fileIcon: {
    fontSize: 28,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#111827",
    wordBreak: "break-all",
  },
  fileSize: {
    fontSize: 11,
    color: "#6b7280",
  },
  convertedBadge: {
    fontSize: 10,
    color: "#4f7fff",
    marginTop: 4,
  },
  removeFileBtn: {
    background: "#fee2e2",
    border: "none",
    borderRadius: 6,
    width: 24,
    height: 24,
    cursor: "pointer",
    color: "#ef4444",
    fontSize: 12,
  },
  imagePreviewContainer: {
    position: "relative",
    textAlign: "center",
  },
  imagePreviewImg: {
    maxWidth: "100%",
    maxHeight: 120,
    borderRadius: 8,
    objectFit: "cover",
  },
  imageOverlay: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    fontSize: 12,
    color: "#374151",
  },
  removeImageBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 12,
    textDecoration: "underline",
  },
  errorMsg: {
    marginTop: 20,
    padding: "12px 16px",
    background: "#fef2f2",
    borderLeft: "3px solid #ef4444",
    borderRadius: 8,
    fontSize: 13,
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  successMsg: {
    marginTop: 20,
    padding: "12px 16px",
    background: "#f0fdf4",
    borderLeft: "3px solid #22c55e",
    borderRadius: 8,
    fontSize: 13,
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  submitBtn: {
    width: "100%",
    marginTop: 24,
    padding: "14px",
    background: "#4f7fff",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);