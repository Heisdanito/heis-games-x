import { useState } from 'react'
import TopNav from './TopNav'
import '../App.css'
import SideBar from './sideBar'
import BodyFirst from './BodyFirst'
import SearchPage from './SearchPage'
import { Link, Route, Router, Routes } from 'react-router-dom'
import ViewGame from './viewGame'



 const navItems = [
  { id: "home",     label: "Home",      icon: "M10 3L3 9v9h5v-5h4v5h5V9z" },
  { id: "search",    label: "Search",     icon: "M6 2h12l1.5 6H4.5zM4 10h16v10H4z M9 14v4M15 14v4" },
  ];


const bottomItem = { id: "logout", label: "Logout", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" };

function Icon({ path }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}


export default function HomePage() {
  
  const [active, setActive] = useState("home");
  const [tooltip, setTooltip] = useState(null); 


    
  
  return (
    
       <section className='main'>
        {/* side bar */}
        <div className='PageMain'>

          <SideBar />

          <div className='options-main'>
            <TopNav />
            <BodyFirst />
          </div>

        </div>
      </section>
  )
}
