import React, { useState } from "react";
import "./css/TopNav.css";
import { Navigate , Route, useNavigate } from "react-router-dom";

const NAV_ACTIONS = [
  {
    id: "Home",
    label: "home",
    badge: null,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L3 9v9h5v-5h4v5h5V9z"/>
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    badge: null,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12l1.5 6H4.5zM4 10h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
];

export default function TopNav() {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate()

  function handlenavigate(keydata){
    navigate(`/search/${keydata}`)
  }
  function handlenavigate2(arg){
    if(arg === 'search'){
      navigate(`/search`)
    }else{
      navigate(`/`)
    }
  }


  return (
    <header className="tn-root">
      {/* Search */}
      <div className={`tn-search-wrap ${focused ? "tn-search-wrap--focused" : ""}`}>
        <svg className="tn-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          className="tn-search-input"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}

          onKeyDown={(e)=> {
            if(e.key === "Enter"){
              console.log("trigered")
              handlenavigate(search)
            }
            }
          }
        />
      </div>

      {/* Right actions */}
      <div className="tn-actions">
        {NAV_ACTIONS.map(item => (
          <button key={item.id} className="tn-action-btn" aria-label={item.label}
            onClick={() => handlenavigate2(item.id)

            }
          >
            {item.icon}
            {item.badge && <span className="tn-badge">{item.badge}</span>}
          </button>
        ))}

        {/* Profile avatar */}
        <div className="tn-avatar-wrap">
          <div className="tn-avatar">HEISX</div>
          <span className="tn-avatar-dot" />
        </div>
      </div>
    </header>
  );
}