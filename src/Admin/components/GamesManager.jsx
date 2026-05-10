// components/GamesManager.jsx - Fixed version with proper data handling
import { useState, useEffect } from "react";
import { url_endponit } from "../../../backend/api/data_endpoit";
import { ImagesURlEndpoint } from "../../../backend/api/data_endpoit";
import { useNavigate } from "react-router-dom";

export default function GamesManager({ refreshTrigger }) {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGames = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching games from:", url_endponit.adminAllGames);
      const response = await fetch(url_endponit.adminAllGames);
      
      // Check if response is ok
      if (!response.ok) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Get response as text first to debug
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("JSON parse error. Response was:", responseText);
        throw new Error("Invalid JSON response from server");
      }
      
      // Check if data is array
      if (Array.isArray(data)) {
        setGames(data);
        console.log(`Loaded ${data.length} games`);
      } else if (data.error) {
        throw new Error(data.message);
      } else {
        console.warn("Unexpected data format:", data);
        setGames([]);
      }
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!gameToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`${url_endponit.topGames}${gameToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete game");
      
      setGames(prev => prev.filter(g => g.id !== gameToDelete.id));
      setShowDeleteModal(false);
      setGameToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    navigate(`/edit/${game.id}`);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = categoryFilter === "all" || game.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeStyle = (category) => {
    const styles = {
      action: { background: "#fef3c7", color: "#d97706" },
      adventure: { background: "#dbeafe", color: "#2563eb" },
      racing: { background: "#e0e7ff", color: "#4338ca" },
      sports: { background: "#dcfce7", color: "#16a34a" },
      fighting: { background: "#fee2e2", color: "#dc2626" },
      horror: { background: "#f3e8ff", color: "#9333ea" },
      rpg: { background: "#ffedd5", color: "#ea580c" },
      strategy: { background: "#ccfbf1", color: "#0d9488" },
    };
    return styles[category] || { background: "#f3f4f6", color: "#374151" };
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#fbbf24" : "#d1d5db", fontSize: 14 }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinnerLarge}></div>
        <p>Loading games...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.managerHeader}>
        <div>
          <h2 style={styles.heading}>Game Library</h2>
          <p style={styles.subheading}>{games.length} total games</p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchGames}>
          🔄 Refresh
        </button>
      </div>

      <div style={styles.filtersBar}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          <option value="action">Action</option>
          <option value="adventure">Adventure</option>
          <option value="racing">Racing</option>
          <option value="sports">Sports</option>
          <option value="fighting">Fighting</option>
          <option value="horror">Horror</option>
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
        </select>
      </div>

      {error && (
        <div style={styles.errorMsg}>
          <span>⚠️</span> {error}
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Game</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Platform</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Uploaded By</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.length === 0 ? (
              <tr>
                <td colSpan="9" style={styles.emptyState}>
                  <div>📭</div>
                  <p>No games found</p>
                </td>
              </tr>
            ) : (
              filteredGames.map(game => (
                <tr key={game.id} style={styles.tableRow}>
                  <td style={styles.td}>#{game.id}</td>
                  <td style={styles.td}>
                    <div style={styles.gameInfo}>
                      {game.img && (
                        <img
                          src={`${ImagesURlEndpoint.viewGame}${game.img}`}
                          alt={game.title}
                          style={styles.gameThumb}
                          onError={(e) => {
                            e.target.style.display = "none";
                            console.log("Failed to load image:", game.img);
                          }}
                        />
                      )}
                      <span style={styles.gameName}>{game.title}</span>
                      {game.tag && (
                        <span style={styles.tagBadge}>
                          {game.tag === "hot" && "🔥"}
                          {game.tag === "new" && "🆕"}
                          {game.tag === "trending" && "📈"}
                          {game.tag === "top" && "⭐"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.categoryBadge, ...getCategoryBadgeStyle(game.type) }}>
                      {game.type}
                    </span>
                  </td>
                  <td style={styles.td}>{game.platform}</td>
                  <td style={styles.td}>
                    <div style={styles.ratingCell}>
                      {getRatingStars(game.rating)}
                      <span style={styles.ratingValue}>({game.rating})</span>
                    </div>
                  </td>
                  <td style={styles.td}>{game.year}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.typeBadge, ...(game.game_type === "banner" ? styles.bannerBadge : styles.normalBadge) }}>
                      {game.game_type || "normal"}
                    </span>
                  </td>
                  <td style={styles.td}>{game.upload_by}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(game)}
                        style={styles.editBtn}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          setGameToDelete(game);
                          setShowDeleteModal(true);
                        }}
                        style={styles.deleteBtn}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)} style={styles.modalClose}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <p>Are you sure you want to delete <strong>{gameToDelete?.title}</strong>?</p>
              <p style={styles.modalWarning}>This action cannot be undone.</p>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setShowDeleteModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ ...styles.confirmBtn, opacity: deleting ? 0.6 : 1 }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Keep your existing styles object here...
const styles = {
  // ... (keep all your existing styles)
  gameInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  // ... rest of styles

  container: {
    flex: 1,
    overflow: "auto",
    padding: 28,
    background: "#f0f2f8",
  },
  managerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#6b7280",
  },
  refreshBtn: {
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    color: "#374151",
  },
  filtersBar: {
    display: "flex",
    gap: 16,
    marginBottom: 24,
  },
  searchWrapper: {
    flex: 1,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    background: "#fff",
    outline: "none",
  },
  filterSelect: {
    padding: "10px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
  },
  tableWrapper: {
    background: "#fff",
    borderRadius: 12,
    overflow: "auto",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 900,
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f9fafb",
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "14px 16px",
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #f0f2f8",
  },
  tableRow: {
    transition: "background 0.2s",
  },
  gameCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  gameThumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    objectFit: "cover",
    background: "#f3f4f6",
  },
  gameName: {
    fontWeight: 500,
    color: "#111827",
  },
  tagBadge: {
    fontSize: 12,
  },
  categoryBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    display: "inline-block",
  },
  ratingCell: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: {
    fontSize: 11,
    color: "#9ca3af",
  },
  typeBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    display: "inline-block",
    textTransform: "capitalize",
  },
  bannerBadge: {
    background: "#fef3c7",
    color: "#d97706",
  },
  normalBadge: {
    background: "#e5e7eb",
    color: "#4b5563",
  },
  actionButtons: {
    display: "flex",
    gap: 8,
  },
  editBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  spinnerLarge: {
    width: 40,
    height: 40,
    border: "3px solid #e5e7eb",
    borderTopColor: "#4f7fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: 48,
    color: "#9ca3af",
  },
  errorMsg: {
    marginBottom: 20,
    padding: "12px 16px",
    background: "#fef2f2",
    borderLeft: "3px solid #ef4444",
    borderRadius: 8,
    fontSize: 13,
    color: "#dc2626",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    width: 400,
    maxWidth: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#9ca3af",
  },
  modalBody: {
    padding: "20px",
  },
  modalWarning: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 8,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: "16px 20px",
    borderTop: "1px solid #e5e7eb",
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
  },
};