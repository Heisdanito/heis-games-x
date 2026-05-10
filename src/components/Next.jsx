import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/SearchPage.css";
import getAllGames from "../../backend/api/getAllGame";
import nextGames from "../../backend/api/nextPage";
import { ImagesURlEndpoint, url_endponit } from "../../backend/api/data_endpoit";

const backgroundPath = ImagesURlEndpoint.viewGame

const GENRES    = ["All","RPG","Action","Shooter","Adventure","Platformer","Battle Royale"];
const PLATFORMS = ["All","PS5","PC","Xbox","Multi"];
const SORTS     = ["Relevance","Rating","Year","A–Z"];

/* ─────────────────────────────────────
   Star Rating sub-component
───────────────────────────────────── */
const StarRating = ({ rating }) => {
  const stars = Math.round(rating / 1);
  return (
    <div className="sp-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`sp-star ${i <= stars ? "sp-star--on" : ""}`}>★</span>
      ))}
      <span className="sp-rating-num">{rating}</span>
    </div>
  );
};

/* ─────────────────────────────────────
   Game Card sub-component
───────────────────────────────────── */
const GameCard = ({ g, index, onView }) => (
  <div
    className="sp-card"
    style={{ "--c": g.color, "--delay": `${index * 45}ms` }}
    onClick={() => onView(g)}
  >
    <div className="sp-card-thumb">
      <div
        className="sp-card-art"
        style={{
          backgroundImage: `url(${backgroundPath}${g.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <span className="sp-card-initials">{g.initials}</span>
      </div>
      <div className="sp-card-overlay" />
      {g.tag && <span className="sp-card-tag">{g.tag}</span>}
      <div className="sp-card-platform-badge">{g.platform}</div>
    </div>

    <div className="sp-card-body">
      <h3 className="sp-card-title">{g.title}</h3>
      <span className="sp-card-genre">{g.genre}</span>
      <div className="sp-card-footer">
        <StarRating rating={g.rating} />
        <span className="sp-card-year">{g.year}</span>
      </div>
      <button
        className="sp-card-btn"
        onClick={e => { e.stopPropagation(); onView(g); }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        View Game
      </button>
    </div>

    <div className="sp-card-glow" />
  </div>
);

/* ─────────────────────────────────────
   Loading Skeleton Card
───────────────────────────────────── */
const SkeletonCard = () => (
  <div className="sp-skeleton">
    <div className="sp-skeleton-thumb" />
    <div className="sp-skeleton-body">
      <div className="sp-skeleton-line sp-skeleton-line--title" />
      <div className="sp-skeleton-line sp-skeleton-line--sub" />
      <div className="sp-skeleton-line sp-skeleton-line--short" />
    </div>
  </div>
);

/* ─────────────────────────────────────
   Main SearchPage
───────────────────────────────────── */
export default function NextPage() {
  // ✅ :key from URL — e.g. /search/fortnite → key = "fortnite"
  const { num }  = useParams();
  const navigate = useNavigate();

  const [allGames, setAllGames] = useState([]);
  const [query,    setQuery]    = useState(key ?? "");
  const [genre,    setGenre]    = useState("All");
  const [platform, setPlatform] = useState("All");
  const [sort,     setSort]     = useState("Relevance");
  const [focused,  setFocused]  = useState(false);
  const [results,  setResults]  = useState([]);
  const [animate,  setAnimate]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [active,   setActive]   = useState("search");

  const inputRef = useRef(null);

  /* ── Load games from API once on mount ── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    nextGames(Number(num)+1)
      .then(data => {
        setAllGames(data);
        setResults(data);
        setAnimate(true);
      })
      .catch(err => {
        console.error("getAllGames failed:", err);
        setError("Failed to load games. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Sync URL :key → query when param changes ── */
  useEffect(() => {
    if (key !== undefined) setQuery(key);
  }, [key]);

  /* ── Filter + sort whenever any filter/query/data changes ── */
  useEffect(() => {
    if (allGames.length === 0) return;
    setAnimate(false);
    const timer = setTimeout(() => {
      let filtered = allGames.filter(g => {
        const q      = query.trim().toLowerCase();
        const matchQ = !q
          || g.title.toLowerCase().includes(q)
          || g.genre.toLowerCase().includes(q);
        const matchG = genre    === "All" || g.genre    === genre;
        const matchP = platform === "All" || g.platform === platform;
        return matchQ && matchG && matchP;
      });

      if (sort === "Rating")    filtered = [...filtered].sort((a,b) => b.rating - a.rating);
      else if (sort === "Year") filtered = [...filtered].sort((a,b) => b.year   - a.year);
      else if (sort === "A–Z")  filtered = [...filtered].sort((a,b) => a.title.localeCompare(b.title));

      setResults(filtered);
      setAnimate(true);
    }, 160);
    return () => clearTimeout(timer);
  }, [query, genre, platform, sort, allGames]);

  /* ── Helpers ── */
  const clearSearch = () => {
    setQuery("");
    setGenre("All");
    setPlatform("All");
    setSort("Relevance");
    navigate("/search");
    inputRef.current?.focus();
  };

  const handleQuickTag = tag => {
    const next = query === tag ? "" : tag;
    setQuery(next);
    navigate(next ? `/search/${next}` : "/search");
  };

  const handleQueryChange = e => {
    const val = e.target.value;
    setQuery(val);
    // Update URL as user types without spamming history stack
    navigate(val.trim() ? `/search/${val.trim()}` : "/search", { replace: true });
  };

  const handleViewGame = game => {
    navigate(`/game/${game.id}`);
  };

  /* ── Render ── */
  return (
    <div className="sp-root">

      {/* Ambient background orbs */}
      <div className="sp-orb sp-orb--1" />
      <div className="sp-orb sp-orb--2" />
      <div className="sp-orb sp-orb--3" />

      {/* ════════════════════════════
          HEADER
      ════════════════════════════ */}
      <header className="sp-header">
        <div className="sp-logo">HEISX</div>

        <div className="sp-header-right">

          {/* Home */}
          <button
            className={`sp-icon-btn ${active === "home" ? "sp-icon-btn--active" : ""}`}
            aria-label="Home"
            onClick={() => { setActive("home"); navigate("/"); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>

          {/* Store */}
          <button
            className={`sp-icon-btn ${active === "store" ? "sp-icon-btn--active" : ""}`}
            aria-label="Store"
            onClick={() => { setActive("search"); navigate("/search"); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2h12l1.5 6H4.5zM4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2z"/>
            </svg>
          </button>

          {/* Notifications */}
          <button
            className={`sp-icon-btn ${active === "notif" ? "sp-icon-btn--active" : ""}`}
            aria-label="Notifications"
            onClick={() => {navigate('/heis')}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>

          {/* Avatar */}
          <div
            className="sp-avatar"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/heis")}
          >
            GX
            <span className="sp-avatar-dot" />
          </div>

        </div>
      </header>

      {/* ════════════════════════════
          HERO + SEARCH BAR
      ════════════════════════════ */}
      <section className="sp-hero">
        <p className="sp-eyebrow">DISCOVER YOUR NEXT GAME</p>
        <h1 className="sp-hero-title">
          What are you<br/>
          <span className="sp-hero-accent">playing today?</span>
        </h1>

        <div className={`sp-searchbar ${focused ? "sp-searchbar--focused" : ""}`}>
          <svg className="sp-sb-icon" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>

          <input
            ref={inputRef}
            type="text"
            className="sp-sb-input"
            placeholder="Search games, genres, publishers..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />

          {query && (
            <button className="sp-sb-clear" onClick={clearSearch} aria-label="Clear">✕</button>
          )}

          <button className="sp-sb-btn" onClick={() => inputRef.current?.blur()}>
            Search
          </button>
        </div>

        {/* Quick-tag chips */}
        <div className="sp-quick-tags">
          {["RPG","Shooter","Action","Multiplayer","Open World"].map(t => (
            <button
              key={t}
              className={`sp-qtag ${query === t ? "sp-qtag--active" : ""}`}
              onClick={() => handleQuickTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* ════════════════════════════
          FILTERS BAR
      ════════════════════════════ */}
      <section className="sp-filters-wrap">
        <div className="sp-filters">

          <div className="sp-filter-group">
            <span className="sp-filter-label">Genre</span>
            <div className="sp-filter-pills">
              {GENRES.map(g => (
                <button
                  key={g}
                  className={`sp-pill ${genre === g ? "sp-pill--active" : ""}`}
                  onClick={() => setGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="sp-filter-group">
            <span className="sp-filter-label">Platform</span>
            <div className="sp-filter-pills">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  className={`sp-pill ${platform === p ? "sp-pill--active" : ""}`}
                  onClick={() => setPlatform(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="sp-filter-group">
            <span className="sp-filter-label">Sort</span>
            <div className="sp-filter-pills">
              {SORTS.map(s => (
                <button
                  key={s}
                  className={`sp-pill ${sort === s ? "sp-pill--active" : ""}`}
                  onClick={() => setSort(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="sp-results-count">
          {!loading && (
            <>
              <span className="sp-count-num">{results.length}</span> results
            </>
          )}
        </div>
      </section>

      {/* ════════════════════════════
          RESULTS
      ════════════════════════════ */}
      <section className="sp-results">

        {/* Error state */}
        {error && (
          <div className="sp-error">
            <div className="sp-error-icon">⚠</div>
            <p className="sp-error-text">{error}</p>
            <button className="sp-error-retry" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="sp-grid sp-grid--visible">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && (
          <div className="sp-empty">
            <div className="sp-empty-icon">⌕</div>
            <p className="sp-empty-text">
              No games found for <strong>"{query}"</strong>
            </p>
            <button className="sp-empty-reset" onClick={clearSearch}>
              Clear filters
            </button>
          </div>
        )}

        {/* Game cards */}
        {!loading && !error && results.length > 0 && (
          <div className={`sp-grid ${animate ? "sp-grid--visible" : ""}`}>
            {results.map((g, i) => (
              <GameCard
                key={g.id}
                g={g}
                index={i}
                onView={handleViewGame}
              />
            ))}



          {/* next */}
          <div className="sp-card-body">
            <h3 className="sp-card-title">PAGE </h3>
            <button
              className="sp-card-btn"
              onClick={ ()=> navigate(`/page/${num + 1}`) }
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              MOVE TO PAGE {num + 1}
            </button>
          </div>

          </div>
        )}



      </section>
    </div>
  );
}