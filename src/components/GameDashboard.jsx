import React, { useState } from "react";
import "./css/GameDashboard.css";

const favoriteList = [
  {
    id: 1,
    title: "Assassins Creed Mirage",
    platform: "PS4 & PS5",
    date: "12 Dec 2020",
    status: "download",
    color: "#e05c4a",
    initials: "AC",
  },
  {
    id: 2,
    title: "Spider Man Miles Morals",
    platform: "PS5",
    date: "14 Nov 2020",
    status: "installed",
    color: "#3b82f6",
    initials: "SM",
  },
  {
    id: 3,
    title: "Uncharted",
    platform: "PS5",
    date: "20 Oct 2020",
    status: "download",
    color: "#f59e0b",
    initials: "UC",
  },
];

const parties = [
  {
    id: 1,
    name: "Rocket League",
    sub: "Planning to the right",
    color: "#3b82f6",
    initials: "RL",
    avatars: ["#e05c4a", "#22c55e"],
  },
  {
    id: 2,
    name: "Fortnite",
    sub: "Elliott started a voice chat",
    color: "#f59e0b",
    initials: "FN",
    avatars: ["#a855f7", "#3b82f6"],
  },
  {
    id: 3,
    name: "Destiny 2",
    sub: "Danny is online · 1",
    color: "#8b5cf6",
    initials: "D2",
    avatars: ["#e05c4a", "#22c55e"],
  },
];

export default function GameDashboard() {
  const [hoveredFav, setHoveredFav] = useState(null);
  const [hoveredParty, setHoveredParty] = useState(null);

  return (
    <div className="gd-root">

      {/* ── Accessories Panel ── */}
      <div className="gd-panel gd-accessories">
        <div className="gd-panel-header">
          <span className="gd-panel-title">Accessories</span>
          <button className="gd-arrow-btn">→</button>
        </div>
        <div className="gd-controller-wrap">
          <div className="gd-controller-placeholder">
            <div className="gd-ctrl-body">
              <div className="gd-ctrl-grip gd-ctrl-grip--left" />
              <div className="gd-ctrl-grip gd-ctrl-grip--right" />
              <div className="gd-ctrl-face">
                <div className="gd-ctrl-bumper gd-ctrl-bumper--left" />
                <div className="gd-ctrl-bumper gd-ctrl-bumper--right" />
                <div className="gd-ctrl-brand">✕</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Favorite List Panel ── */}
      <div className="gd-panel gd-favorites">
        <div className="gd-panel-header">
          <span className="gd-panel-title">Favorite list</span>
          <button className="gd-arrow-btn">→</button>
        </div>
        <ul className="gd-fav-list">
          {favoriteList.map((g, i) => (
            <li
              key={g.id}
              className={`gd-fav-item ${hoveredFav === g.id ? "gd-fav-item--hover" : ""}`}
              style={{ animationDelay: `${i * 70}ms` }}
              onMouseEnter={() => setHoveredFav(g.id)}
              onMouseLeave={() => setHoveredFav(null)}
            >
              <div className="gd-fav-thumb" style={{ "--c": g.color }}>
                {g.initials}
              </div>
              <div className="gd-fav-meta">
                <span className="gd-fav-title">{g.title}</span>
                <span className="gd-fav-platform">{g.platform}</span>
              </div>
              <span className="gd-fav-date">{g.date}</span>
              <button
                className={`gd-fav-btn ${g.status === "installed" ? "gd-fav-btn--installed" : "gd-fav-btn--download"}`}
              >
                {g.status === "installed" ? "Installed" : "Download"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Parties Panel ── */}
      <div className="gd-panel gd-parties">
        <div className="gd-panel-header">
          <span className="gd-panel-title">Parties</span>
        </div>
        <ul className="gd-party-list">
          {parties.map((p, i) => (
            <li
              key={p.id}
              className={`gd-party-item ${hoveredParty === p.id ? "gd-party-item--hover" : ""}`}
              style={{ animationDelay: `${i * 70}ms` }}
              onMouseEnter={() => setHoveredParty(p.id)}
              onMouseLeave={() => setHoveredParty(null)}
            >
              <div className="gd-party-icon" style={{ "--c": p.color }}>
                {p.initials}
              </div>
              <div className="gd-party-meta">
                <span className="gd-party-name">{p.name}</span>
                <span className="gd-party-sub">{p.sub}</span>
              </div>
              <div className="gd-party-avatars">
                {p.avatars.map((col, j) => (
                  <div
                    key={j}
                    className="gd-party-avatar"
                    style={{ background: col, marginLeft: j > 0 ? "-6px" : 0 }}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
