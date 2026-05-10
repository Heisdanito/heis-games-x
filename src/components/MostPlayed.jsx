import { useState, useRef } from "react";
import "./css/mostplayed.css";

//databse files return data
import topGames from "../../backend/api/topGames";

//route
import { ImagesURlEndpoint } from "../../backend/api/data_endpoit";
import { useNavigate } from "react-router-dom";
const games = await topGames();

console.log('top games = ' , await games)



export default function MostPlayedGames() {
  const [active, setActive] = useState(null);
  const trackRef = useRef(null);

  const navigate = useNavigate();

  function handleRoute(id){
    navigate(`/game/${id}`)
  }

  const scrollBy = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };

  return (
    <section className="mpg-section">
      <h2 className="mpg-heading">Top Games</h2>

      <div className="mpg-row">
        <button className="mpg-arrow mpg-arrow--left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="mpg-track" ref={trackRef}>
          {games.map((g, i) => (
            <div
              key={g.id}
              className={`mpg-card ${active === g.id ? "mpg-card--active" : ""}`}
              style={{ "--accent": g.accent, animationDelay: `${i * 80}ms` }}
              onMouseEnter={() => setActive(g.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="mpg-card__img-wrap" onClick={() => handleRoute(g.id)}>
                <img src={ImagesURlEndpoint.topBanner+g.img} alt={g.title} className="mpg-card__img" />
                <div className="mpg-card__overlay" />
                <div className="mpg-card__shine" />
              </div>
              <div className="mpg-card__info">
                <span className="mpg-card__title">{g.title}</span>
                <span className="mpg-card__hours">{g.type}</span>
              </div>
              <div className="mpg-card__accent-bar" />
            </div>
          ))}
        </div>

        <button className="mpg-arrow mpg-arrow--right" onClick={() => scrollBy(1)} aria-label="Scroll right">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}