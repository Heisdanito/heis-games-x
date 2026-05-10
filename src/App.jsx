import { useState } from 'react'
import TopNav from './components/TopNav'
import './App.css'
import SideBar from './components/sideBar'
import BodyFirst from './components/BodyFirst'
import SearchPage from './components/SearchPage'
import { Link, Route, Router, Routes } from 'react-router-dom'
import ViewGame from './components/viewGame'
import HomePage from './components'
import Admin from './Admin/Amin'
import AutoDownload from './components/AutoDownload'
import GameEditDelete from './Admin/components/configData'
import NextPage from './components/Next'



export default function App() {


  return (
    <>
      <Routes>
        <Route path="/game/:data" element={<ViewGame />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/search/:key' element={<SearchPage />} />
        <Route path='/heis' element={<Admin /> } />
        <Route path='*'   element={<HomePage />} />
        <Route path='/me' element={<Admin />} />
        <Route path='/page/:num' element={<NextPage />} />
        <Route path='/download/:game' element={<AutoDownload />} />
        <Route path='/edit/:signal' element={<GameEditDelete />} />
      </Routes> 
    </>
  )

  
}
