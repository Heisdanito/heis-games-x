import { useState } from "react";
import "./css/sideBar.css";
import { useNavigate } from "react-router-dom";

const navItems = [
  { id: "home",     label: "Home",      icon: "M10 3L3 9v9h5v-5h4v5h5V9z" },
  { id: "search",  label: "search",   icon: "M6 9h2m4 0h2M12 7v2m0 4v2M3 12a9 9 0 1018 0 9 9 0 00-18 0" },
];


const bottomItem = { id: "logout", label: "Logout", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" };

function Icon({ path }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export default function GameSidebar() {
  const [active, setActive] = useState("home");
  const [tooltip, setTooltip] = useState(null);
  const navigate = useNavigate();

  function handleNavigate(key){
    setActive(key);
    key === 'search' ?  navigate('/search'): '';

  }

  return (
    <nav className="gs-sidebar">
      <div className="gs-logo">HEIS X</div>

      <ul className="gs-nav">
        {navItems.map((item) => (
          <li key={item.id} className="gs-nav-item">
            <button
              className={`gs-nav-btn ${active === item.id ? "gs-nav-btn--active" : ""}`}
              onMouseEnter={() => setTooltip(item.id)}
              onMouseLeave={() => setTooltip(null)}
              aria-label={item.label}
              onClick={
                () => handleNavigate(item.id)
              }
            >
              <Icon path={item.icon} />
              {active === item.id && <span className="gs-active-pip" />}
            </button>
            {tooltip === item.id && (
              <span className="gs-tooltip">{item.label}</span>
            )}

          </li>
        ))}
      </ul>

      <div className="gs-bottom">
        <div className="gs-nav-item">
          <button
            className="gs-nav-btn gs-nav-btn--logout"
            onMouseEnter={() => setTooltip("logout")}
            onMouseLeave={() => setTooltip(null)}
            aria-label={bottomItem.label}
            onClick={() => {handleNavigate('logout')}}
          >
            <Icon path={bottomItem.icon} />
          </button>
          {tooltip === "logout" && (
            <span className="gs-tooltip">{bottomItem.label}</span>
          )}
        </div>
      </div>
    </nav>
  );
}