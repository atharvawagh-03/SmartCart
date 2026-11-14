import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { applyTheme } from './context/ThemeContext'

// Set axios base URL from environment variable, fallback to empty string (relative) for dev proxy
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
