// GameEditDelete.jsx
// Usage: <GameEditDelete gameId={123} onSuccess={() => {}} />
// Or via URL params: /edit-game?id=123

import { useState, useEffect, useRef } from "react";
import { ImagesURlEndpoint, url_endponit } from "../../../backend/api/data_endpoit";
import { useParams } from "react-router-dom";

const GAME_CATEGORIES = [
  { value: "action",    label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "racing",    label: "Racing" },
  { value: "sports",    label: "Sports" },
  { value: "fighting",  label: "Fighting" },
  { value: "horror",    label: "Horrusor" },
  { value: "rpg",       label: "RPG" },
  { value: "strategy",  label: "Strategy" },
];

const PLATFORMS = ["PC", "PS4", "PS5", "Xbox One", "Xbox Series X", "Nintendo Switch"];
const RATINGS   = [0, 1, 2, 3, 4, 5];
const TAGS      = [
  { value: "hot",      label: "Hot" },
  { value: "new",      label: "New" },
  { value: "trending", label: "Trending" },
  { value: "top",      label: "Top Rated" },
  { value: "",         label: "None" },
];

function formatBytes(b) {
  if (!b) return "0 B";
  const k = 1024, s = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return (b / Math.pow(k, i)).toFixed(2) + " " + s[i];
}

// ── Resolve game ID from props OR URL search params ───────────────────────────
function resolveGameId(propId) {
  if (propId) return String(propId);
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("game_id") || null;
}

export default function GameEditDelete({ gameId: propGameId, onSuccess, onDelete }) {
  const { signal } = useParams()
  const gameId = signal ;


  const [game,         setGame]         = useState(null);
  const [formData,     setFormData]     = useState(null);
  const [newImage,     setNewImage]     = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newTorrent,   setNewTorrent]   = useState(null);

  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [confirmDel,   setConfirmDel]   = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  const [dragImg,      setDragImg]      = useState(false);
  const [dragTor,      setDragTor]      = useState(false);

  const imageRef   = useRef();
  const torrentRef = useRef();

  // ── Fetch game data ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameId) {
      setError("No game ID provided.");
      setLoading(false);
      return;
    }
    fetchGame();
  }, [gameId]);

  async function fetchGame() {
    setLoading(true);
    setError("");
    try {
      const url = `${url_endponit.gameData}?id=${gameId}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error("Failed to load game data.");
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message || "Game not found.");
      setGame(data.game);
      setFormData({ ...data.game });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Field change ────────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  }

  // ── Image handling ──────────────────────────────────────────────────────────
  function handleImageFile(file) {
    if (!["image/jpeg","image/jpg","image/png","image/webp"].includes(file.type)) {
      setError("Invalid image type. JPG, PNG or WEBP only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5 MB.");
      return;
    }
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  }

  function handleTorrentFile(file) {
    if (!file.name.toLowerCase().endsWith(".torrent") && !file.name.toLowerCase().endsWith(".bin")) {
      setError("Please upload a .torrent file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("Torrent too large. Max 50 MB.");
      return;
    }
    setNewTorrent(file);
    setError("");
  }

  // ── Save (edit) ─────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.game?.trim()) { setError("Game name is required."); return; }
    setSaving(true);

    try {
      const body = new FormData();
      body.append("id", gameId);
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, v);
      });
      if (newImage)   body.append("image_file",   newImage);
      if (newTorrent) body.append("torrent_file",  newTorrent);

      const res  = await fetch(url_endponit.updateRequest, { method: "POST", body });
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message || "Update failed.");

      setSuccess("Game updated successfully.");
      setNewImage(null);
      setNewTorrent(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      if (onSuccess) onSuccess(data);
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const body = new FormData();
      body.append("id", gameId);
      const res  = await fetch(url_endponit.deleteApi, { method: "POST", body });
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message || "Delete failed.");
      if (onDelete) onDelete(gameId);
    } catch (e) {
      setError(e.message);
      setConfirmDel(false);
    } finally {
      setDeleting(false);
    }
  }

  // ── Render states ───────────────────────────────────────────────────────────
  if (!gameId)  return <Banner type="error">No game ID provided. Pass <code>gameId</code> prop or <code>?id=</code> URL param.</Banner>;
  if (loading)  return <Loader />;
  if (!formData) return <Banner type="error">{error || "Game not found."}</Banner>;

  const currentImage = imagePreview || ImagesURlEndpoint.img_url+game.img;

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <div style={s.badge}>Game ID #{gameId}</div>
          <h1 style={s.title}>{game?.game || "Edit Game"}</h1>
        </div>
        <button
          style={s.deleteBtn}
          onClick={() => setConfirmDel(true)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete Game"}
        </button>
      </div>

      {/* ── Alerts ── */}
      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      {/* ── Delete confirm modal ── */}
      {confirmDel && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalIcon}>!</div>
            <h3 style={s.modalTitle}>Delete "{game?.game}"?</h3>
            <p style={s.modalText}>
              This will permanently remove the game, its cover image, and torrent file.
              This cannot be undone.
            </p>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setConfirmDel(false)}>Cancel</button>
              <button style={s.confirmDeleteBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSave} style={s.form}>

        {/* Left column */}
        <div style={s.grid}>
          <div style={s.col}>
            <Section title="Game Info">

              <Field label="Game Title" required>
                <input style={s.input} name="game" value={formData.game || ""} onChange={handleChange} placeholder="e.g., Spider-Man 2" />
              </Field>

              <Row>
                <Field label="Category">
                  <select style={s.select} name="games_cat" value={formData.games_cat || "adventure"} onChange={handleChange}>
                    {GAME_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
                <Field label="Type">
                  <select style={s.select} name="type" value={formData.type || "normal"} onChange={handleChange}>
                    <option value="normal">Normal</option>
                    <option value="banner">Banner</option>
                  </select>
                </Field>
              </Row>

              <Row>
                <Field label="Platform">
                  <select style={s.select} name="platform" value={formData.platform || "PC"} onChange={handleChange}>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Rating">
                  <select style={s.select} name="rating" value={formData.rating ?? 0} onChange={handleChange}>
                    {RATINGS.map(r => <option key={r} value={r}>{r} / 5</option>)}
                  </select>
                </Field>
              </Row>

              <Row>
                <Field label="Release Year">
                  <input style={s.input} name="year" value={formData.year || ""} onChange={handleChange} placeholder="2025" />
                </Field>
                <Field label="Tag">
                  <select style={s.select} name="tag" value={formData.tag || ""} onChange={handleChange}>
                    {TAGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
              </Row>

              <Field label="Accent Color">
                <div style={s.colorRow}>
                  <input type="color" style={s.colorSwatch} name="colour_code" value={formData.colour_code || "#4f7fff"} onChange={handleChange} />
                  <input style={{ ...s.input, fontFamily: "monospace", flex: 1 }} name="colour_code" value={formData.colour_code || "#4f7fff"} onChange={handleChange} />
                </div>
              </Field>

              <Field label="Description">
                <textarea style={s.textarea} name="description" value={formData.description || ""} onChange={handleChange} rows={4} placeholder="Describe the game..." />
              </Field>
            </Section>

            <Section title="System Requirements">
              <Row>
                <Field label="RAM">
                  <input style={s.input} name="ram" value={formData.ram || ""} onChange={handleChange} placeholder="e.g., 16GB" />
                </Field>
                <Field label="GPU">
                  <input style={s.input} name="gpu" value={formData.gpu || ""} onChange={handleChange} placeholder="e.g., GTX 1060" />
                </Field>
              </Row>
              <Row>
                <Field label="CPU">
                  <input style={s.input} name="cpu" value={formData.cpu || ""} onChange={handleChange} placeholder="e.g., i5-8400" />
                </Field>
                <Field label="Windows">
                  <input style={s.input} name="windows" value={formData.windows || ""} onChange={handleChange} placeholder="e.g., 10 64-bit" />
                </Field>
              </Row>
            </Section>
          </div>

          {/* Right column — files */}
          <div style={s.col}>
            <Section title="Cover Image">
              <div
                style={{ ...s.dropZone, ...(dragImg ? s.dropActive : {}), ...(currentImage ? s.dropFilled : {}) }}
                onClick={() => imageRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragImg(true); }}
                onDragLeave={() => setDragImg(false)}
                onDrop={e => { e.preventDefault(); setDragImg(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
              >
                <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
                  onChange={e => e.target.files[0] && handleImageFile(e.target.files[0])} />

                {currentImage ? (
                  <div style={s.imgPreviewWrap}>
                    <img src={currentImage} alt="cover" style={s.imgPreview} />
                    <div style={s.imgMeta}>
                      {newImage
                        ? <><span style={s.newBadge}>New</span> {newImage.name} ({formatBytes(newImage.size)})</>
                        : <span style={s.currentBadge}>Current cover — click or drop to replace</span>
                      }
                    </div>
                  </div>
                ) : (
                  <div style={s.dropEmpty}>
                    <div style={s.dropIconBox}>IMG</div>
                    <p style={s.dropText}>Drop image or <span style={s.link}>browse</span></p>
                    <p style={s.dropHint}>JPG, PNG, WEBP — max 5 MB</p>
                  </div>
                )}
              </div>
            </Section>

            <Section title="Torrent File">
              {game?.torrent_path && !newTorrent && (
                <div style={s.currentFile}>
                  <span style={s.fileIcon}>TOR</span>
                  <div style={s.fileDetails}>
                    <div style={s.fileName}>{game.torrent_path.split("/").pop()}</div>
                    <div style={s.fileSub}>Current torrent — drop below to replace</div>
                  </div>
                </div>
              )}

              <div
                style={{ ...s.dropZone, marginTop: 12, ...(dragTor ? s.dropActive : {}), ...(newTorrent ? s.dropFilled : {}) }}
                onClick={() => torrentRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragTor(true); }}
                onDragLeave={() => setDragTor(false)}
                onDrop={e => { e.preventDefault(); setDragTor(false); const f = e.dataTransfer.files[0]; if (f) handleTorrentFile(f); }}
              >
                <input ref={torrentRef} type="file" accept=".torrent,.bin" style={{ display: "none" }}
                  onChange={e => e.target.files[0] && handleTorrentFile(e.target.files[0])} />

                {newTorrent ? (
                  <div style={s.torPreview}>
                    <span style={s.fileIcon}>TOR</span>
                    <div style={s.fileDetails}>
                      <div style={s.fileName}>{newTorrent.name}</div>
                      <div style={s.fileSub}>{formatBytes(newTorrent.size)}</div>
                    </div>
                    <button type="button" style={s.removeBtn}
                      onClick={e => { e.stopPropagation(); setNewTorrent(null); if (torrentRef.current) torrentRef.current.value = ""; }}>
                      X
                    </button>
                  </div>
                ) : (
                  <div style={s.dropEmpty}>
                    <div style={s.dropIconBox}>TOR</div>
                    <p style={s.dropText}>Drop .torrent or <span style={s.link}>browse</span></p>
                    <p style={s.dropHint}>Max 50 MB</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Metadata */}
            <Section title="Record Info">
              <div style={s.meta}>
                <MetaRow label="Uploaded by" value={game?.upload_by || "—"} />
                <MetaRow label="Created"     value={game?.created_at || "—"} />
                <MetaRow label="Image path"  value={game?.image_path || "—"} />
                <MetaRow label="Torrent path" value={game?.torrent_path || "—"} />
              </div>
            </Section>
          </div>
        </div>

        {/* Submit */}
        <div style={s.footer}>
          <button type="submit" style={s.saveBtn} disabled={saving} className="save-btn">
            {saving
              ? <><span style={s.spinner} /> Saving changes...</>
              : "Save Changes"
            }
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={s.section}>
      <div style={s.sectionHead}>{title}</div>
      <div style={s.sectionBody}>{children}</div>
    </div>
  );
}
function Field({ label, required, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}{required && <span style={s.req}> *</span>}</label>
      {children}
    </div>
  );
}
function Row({ children }) {
  return <div style={s.row}>{children}</div>;
}
function Alert({ type, children }) {
  return (
    <div style={type === "error" ? s.alertError : s.alertSuccess}>
      {type === "error" ? "Error: " : "Done: "}{children}
    </div>
  );
}
function Banner({ type, children }) {
  return <div style={{ ...s.alertError, margin: 32 }}>{children}</div>;
}
function MetaRow({ label, value }) {
  return (
    <div style={s.metaRow}>
      <span style={s.metaLabel}>{label}</span>
      <span style={s.metaValue}>{value}</span>
    </div>
  );
}
function Loader() {
  return (
    <div style={s.loaderWrap}>
      <div style={s.loaderDot} className="pulse" />
      <span style={s.loaderText}>Loading game data...</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page:        { padding: 28, background: "#0f1117", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" },
  header:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  badge:       { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#4f7fff", textTransform: "uppercase", marginBottom: 6 },
  title:       { fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 },
  deleteBtn:   { padding: "10px 20px", background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s" },
  form:        { display: "flex", flexDirection: "column", gap: 0 },
  grid:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 },
  col:         { display: "flex", flexDirection: "column", gap: 20 },
  section:     { background: "#1a1d27", borderRadius: 12, overflow: "hidden", border: "1px solid #2a2d3e" },
  sectionHead: { padding: "12px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#4f7fff", textTransform: "uppercase", borderBottom: "1px solid #2a2d3e", background: "#15182200" },
  sectionBody: { padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 },
  row:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  field:       { display: "flex", flexDirection: "column", gap: 6 },
  label:       { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8 },
  req:         { color: "#ef4444" },
  input:       { padding: "9px 13px", background: "#0f1117", border: "1px solid #2a2d3e", borderRadius: 7, fontSize: 13, color: "#e2e8f0", outline: "none", fontFamily: "inherit", transition: "border .2s" },
  select:      { padding: "9px 13px", background: "#0f1117", border: "1px solid #2a2d3e", borderRadius: 7, fontSize: 13, color: "#e2e8f0", outline: "none", cursor: "pointer" },
  textarea:    { padding: "9px 13px", background: "#0f1117", border: "1px solid #2a2d3e", borderRadius: 7, fontSize: 13, color: "#e2e8f0", outline: "none", fontFamily: "inherit", resize: "vertical" },
  colorRow:    { display: "flex", gap: 10, alignItems: "center" },
  colorSwatch: { width: 44, height: 38, border: "1px solid #2a2d3e", borderRadius: 7, cursor: "pointer", padding: 2, background: "none" },
  dropZone:    { border: "2px dashed #2a2d3e", borderRadius: 10, padding: "20px 14px", textAlign: "center", cursor: "pointer", transition: "all .2s", background: "#0f1117" },
  dropActive:  { borderColor: "#4f7fff", background: "#0f1117ee" },
  dropFilled:  { borderColor: "#22c55e", background: "#052e1600" },
  dropEmpty:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  dropIconBox: { width: 44, height: 44, borderRadius: 8, background: "#2a2d3e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#4f7fff", letterSpacing: 1 },
  dropText:    { fontSize: 13, color: "#64748b", margin: 0 },
  dropHint:    { fontSize: 11, color: "#3f4a5e", margin: 0 },
  link:        { color: "#4f7fff", fontWeight: 600, cursor: "pointer" },
  imgPreviewWrap: { display: "flex", flexDirection: "column", gap: 10, alignItems: "center" },
  imgPreview:  { maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "cover" },
  imgMeta:     { fontSize: 12, color: "#64748b" },
  newBadge:    { background: "#4f7fff", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginRight: 6 },
  currentBadge:{ color: "#64748b", fontSize: 12 },
  currentFile: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#0f1117", border: "1px solid #2a2d3e", borderRadius: 8 },
  fileIcon:    { width: 38, height: 38, borderRadius: 7, background: "#1e2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#4f7fff", letterSpacing: 1, flexShrink: 0 },
  fileDetails: { flex: 1, minWidth: 0 },
  fileName:    { fontSize: 13, fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fileSub:     { fontSize: 11, color: "#64748b", marginTop: 2 },
  torPreview:  { display: "flex", alignItems: "center", gap: 12, textAlign: "left" },
  removeBtn:   { background: "#1e2235", border: "none", color: "#ef4444", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  meta:        { display: "flex", flexDirection: "column", gap: 10 },
  metaRow:     { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, borderBottom: "1px solid #1e2235", paddingBottom: 8 },
  metaLabel:   { color: "#64748b", flexShrink: 0 },
  metaValue:   { color: "#94a3b8", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  footer:      { borderTop: "1px solid #2a2d3e", paddingTop: 24 },
  saveBtn:     { width: "100%", padding: "14px", background: "#4f7fff", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "opacity .2s" },
  spinner:     { width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" },
  alertError:  { padding: "12px 16px", background: "#1f0a0a", border: "1px solid #ef4444", borderRadius: 8, fontSize: 13, color: "#ef4444", marginBottom: 16 },
  alertSuccess:{ padding: "12px 16px", background: "#0a1f0e", border: "1px solid #22c55e", borderRadius: 8, fontSize: 13, color: "#22c55e", marginBottom: 16 },
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modal:       { background: "#1a1d27", border: "1px solid #2a2d3e", borderRadius: 16, padding: "36px 32px", maxWidth: 420, width: "90%", textAlign: "center" },
  modalIcon:   { width: 52, height: 52, borderRadius: "50%", background: "#1f0a0a", border: "2px solid #ef4444", color: "#ef4444", fontSize: 26, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" },
  modalTitle:  { fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 },
  modalText:   { fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 24 },
  modalBtns:   { display: "flex", gap: 12 },
  cancelBtn:   { flex: 1, padding: "11px", background: "transparent", border: "1px solid #2a2d3e", color: "#94a3b8", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  confirmDeleteBtn: { flex: 1, padding: "11px", background: "#ef4444", border: "none", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" },
  loaderWrap:  { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 16 },
  loaderDot:   { width: 40, height: 40, borderRadius: "50%", background: "#4f7fff", opacity: .8 },
  loaderText:  { fontSize: 13, color: "#64748b" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { transform: scale(1); opacity:.8; } 50% { transform: scale(1.15); opacity:1; } }
  .pulse { animation: pulse 1.2s ease-in-out infinite; }
  .save-btn:hover:not(:disabled) { opacity: .88; }
`;