import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ButtonTab from './components/ButtonTab.jsx'
import TopNav from './components/TopNav.jsx'
import TopCategory from './components/TopCategory.jsx'
import SearchPage from './components/SearchPage.jsx'
import ViewGame from './components/viewGame.jsx'
import { BrowserRouter } from 'react-router-dom'
import HomePage from './components/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
