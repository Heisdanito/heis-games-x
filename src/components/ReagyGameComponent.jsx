import React, { useEffect, useState } from "react";
import "./css/viewGame.css";
import { data, Link, useNavigate, useParams } from "react-router-dom";

import { ImagesURlEndpoint, url_endponit } from "../../backend/api/data_endpoit";
import getLimitedGames from "../../backend/api/getLimiteGames";
import TopNav from "./TopNav";
//db
const RELATE =  await getLimitedGames();

const COACHES = RELATE;
const gameType = RELATE[0].type
const LESSONS = [
  { id:1, title:"Download Thread-x link 1 using FreeDownload Manager",                    duration:"Free download Manager", price:"GET APP",  initials:"F1", color:"#e05c4a" , link: "https://freedownloadmanager.com" },
  { id:2, title:"Download Thread-xx file 1", duration:"Using uTorrent", price:"GET APP", initials:"UT", color:"rgb(0 , 250 , 10)" , link: "https://utorrent.com" },
];

const GamesR = RELATE;
const relatedGames =  GamesR.filter(game => game.type === gameType );

function CoachCard({ coach, selected, onSelect }) {

  const navigate = useNavigate()

  return (
    <div
      className={`cc-coach-card ${selected ? "cc-coach-card--active" : ""}`}
      style={{ "--c": coach.color }}
      onClick={() => onSelect(coach.id)}
    >
      <img className="cc-coach-avatar"
        src={ImagesURlEndpoint.img_url+coach.img}  
      />
      {coach.initials}
      <div className="cc-coach-meta">
        <span className="cc-coach-name">{coach.title}</span>
        <span className="cc-coach-role">{coach.type}</span>
        <span className="cc-coach-lessons">Platform {coach.platform}</span>
      </div>
      <div className="cc-coach-right">
        <span className="cc-coach-price-label">Developed In</span>
        <span className="cc-coach-price"><small>HEISDANITO</small></span>
        <button className="cc-book-btn" 
          onClick={
            () => {
              navigate(`/game/${coach.id}`)
            }
          }
            
        >GET</button>
      </div>
      {selected && <div className="cc-coach-active-bar" />}
    </div>
  );
}

export default function ReadyGameCardData(prop) {
  const [booked, setBooked] = useState(null);
  const { data } = useParams();
  const [params , setParams] = useState(null)
  const navigate = useNavigate()
  const [selectedCoach, setSelectedCoach] = useState(data);

  useEffect(()=>{
    setSelectedCoach(data)
  } , [data])
  
  const img_url = ImagesURlEndpoint.img_url
  
    //objectise the prop
    const GameData = {
      name: prop.name,
      category: prop.category,
      img: prop.img,
      color: prop.color,
      description: prop.description,
      gameId: prop.id,
      torrent: prop.file
    }

    return(
      <div className="cc-root">
        {/* Ambient bg */}
        <div className="cc-orb cc-orb--1" />
        <div className="cc-orb cc-orb--2" />

        {/* ── Top Nav ── */}
        {/* <header className="cc-topnav">
          <div className="cc-topnav-left">
            <div className="cc-nav-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e05c4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <button className="cc-nav-browse">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/><rect x="2" y="14" width="7" height="7"/><rect x="15" y="14" width="7" height="7"/></svg>
              Browse Games
            </button>
          </div>
          <nav className="cc-topnav-center">
            <a className="cc-nav-link" href="#">Gift Cards</a>
            <a className="cc-nav-link" href="#">Become a Coach</a>
          </nav>
          <div className="cc-topnav-right">
            <button className="cc-nav-login" >LOGIN</button>
            <button className="cc-nav-signup">SIGN UP</button>
          </div> */}
        {/* </header> */}
        <TopNav />

        {/* ── Main layout ── */}
        <main className="cc-main"
              // style={{
              //   backgroundImage: `url("${ImagesURlEndpoint.viewGame}${GameData.img}")`,
              //   backgroundSize: "cover",
              //   backgroundRepeat: "no-repeat",
              //   backdropFilter: "blur(50px)"
              // }}
        >

          {/* ── LEFT COLUMN ── */}
          <div className="cc-left">

            {/* Hero game card */}
            <div className="cc-hero-card"
              style={{
                background: `"${GameData.color}"`
              }}
            >
              <div className="cc-hero-thumb">
                <img className="cc-hero-art"
                  src={`${ImagesURlEndpoint.img_url}${GameData.img}`}
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed"
                  }}
                />
                  <span className="cc-hero-art-text">
                    {GameData.name}
                  </span>
                </div>
              
              <div className="cc-hero-info">
                <span className="cc-hero-genre">
                  {GameData.category}
                </span>
                <h1 className="cc-hero-title">
                  {GameData.name}
                </h1>
                <a className="cc-gift-btn"
                  href={url_endponit.downloadLink+GameData.torrent}
                  download={GameData.torrent}
                  style={{
                    textDecoration: 'none'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
                  Download
                </a>
              </div>
            
                </div>
            {/* Coaches list */}
            <div className="cc-coaches-section">
              <div className="cc-coaches-header">
                <span className="cc-coaches-title">Most downloads</span>
                <span className="cc-coaches-count">{COACHES.length}</span>
                <button className="cc-filters-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                  FILTERS
                </button>
              </div>
              <div className="cc-coaches-list">
                {COACHES.map((c, i) => (
                  <div key={c.id} style={{ animationDelay: `${i * 60}ms` }} className="cc-coach-wrap">
                    <CoachCard
                      coach={c}
                      selected={selectedCoach === c.id}
                      onSelect={setSelectedCoach}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="cc-right"
           
          >
            {/* Fortnite hero art */}
            <div className="cc-game-banner"
              style={{
                width : "auto",
                height: 300
              }}>
              <div className="cc-game-banner-bg"

              >
                <div className="cc-game-banner-noise"              
                style={{
                backgroundImage: `url('${img_url}${GameData.img}')`,
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
              }} />

              </div>
              <span className="cc-game-banner-title">{GameData.name}</span>
            </div>

            {/* About */}
            <section className="cc-section">
              <h3 className="cc-section-title">ABOUT</h3>
              <p className="cc-about-text">
                {`${(GameData.description)}`}
              </p>
            </section>

            {/* Recently Booked Lessons */}
            <section className="cc-section">
              <h3 className="cc-section-title">DOWNLOAD OPTIONS</h3>
              <div className="cc-lessons-list">
                {LESSONS.map(l => (
                  <div key={l.id} className="cc-lesson-row">
                    <div className="cc-lesson-thumb" style={{ "--c": l.color }}>{l.initials}</div>
                    <span className="cc-lesson-title">{l.title}</span>
                    <span className="cc-lesson-duration">{l.duration}</span>
                    <span className="cc-lesson-price">{l.price}</span>
                    <a
                      className={`cc-lesson-book-btn ${booked === l.id ? "cc-lesson-book-btn--booked" : ""}`}
                      onClick={() => n}
                    >
                      {booked === l.id ? "✓ Clicked" : "Download"}
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Games */}
            <section className="cc-section">
              <h3 className="cc-section-title">RELATED GAMES</h3>
              <div className="cc-related-list">
                {relatedGames.map(r => (
                  <div key={r.id} className="cc-related-card" 
                    style={{ "--c": r.color,                  
                            }}
                    onClick={() => navigate(`/game/${r.id}`)}
                  >
                    <div className="cc-related-art"
                        style={{
                        backgroundImage: `url("${img_url}${r.img}")`,
                        backgroundSize: "cover",
                        backgroundAttachment: "fixed",
                        backgroundPosition: "center",
                    }}
                    >{r.initials}</div>
                    <span className="cc-related-name">{r.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  
}
