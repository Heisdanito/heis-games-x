import React, { useState } from "react";
import "./css/FriendsPanel.css";

const UPDATE = {
  game: "Spider-Man Marvel's Update",
  sub: "23 Min remaining",
  progress: 68,
};

const friends = [
  { id: 1, name: "Fahim Auditor",  game: "Apex",          initials: "FA", color: "#3b82f6", online: true  },
  { id: 2, name: "Killer Freake", game: "Dota 2",         initials: "KF", color: "#ef4444", online: true  },
  { id: 3, name: "Rafee Alam",    game: "Dota 2",         initials: "RA", color: "#f59e0b", online: true  },
  { id: 4, name: "Aiden Emon",    game: "Rocket League",  initials: "AE", color: "#a855f7", online: false },
];

export default function FriendsPanel() {
  const [hovered, setHovered] = useState(null);

  return (
    <aside className="fp-panel">

      {/* Update banner */}
      <div className="fp-update">
        <div className="fp-update-info">
          <span className="fp-update-title">{UPDATE.game}</span>
          <span className="fp-update-sub">{UPDATE.sub}</span>
        </div>
        <div className="fp-update-badge">{UPDATE.progress}%</div>
        <div className="fp-update-bar">
          <div className="fp-update-fill" style={{ width: `${UPDATE.progress}%` }} />
        </div>
      </div>

      {/* Friends header */}
      <div className="fp-header">
        <span className="fp-header-label">Friends Online</span>
        <span className="fp-header-count">
          <span className="fp-count-num">{friends.filter(f => f.online).length}</span>
          <span className="fp-count-sep">/</span>
          <span className="fp-count-total">{friends.length}</span>
        </span>
        <button className="fp-all-btn">all</button>
      </div>

      {/* Friend list */}
      <ul className="fp-list">
        {friends.map((f, i) => (
          <li
            key={f.id}
            className={`fp-item ${hovered === f.id ? "fp-item--hover" : ""}`}
            style={{ animationDelay: `${i * 60}ms` }}
            onMouseEnter={() => setHovered(f.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="fp-avatar" style={{ "--av-color": f.color }}>
              {f.initials}
              <span className={`fp-status-dot ${f.online ? "fp-dot--online" : "fp-dot--away"}`} />
            </div>
            <div className="fp-meta">
              <span className="fp-name">{f.name}</span>
              <span className="fp-game">{f.game}</span>
            </div>
            <div className="fp-activity-bar" style={{ "--av-color": f.color }} />
          </li>
        ))}
      </ul>

    </aside>
  );
}
