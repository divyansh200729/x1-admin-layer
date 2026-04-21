import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { pingDB } from './lib/db'
import './index.css'

// Wake Supabase on every app open to avoid cold-start delays
pingDB()

// NOTE: PWA auto-update is already handled by vite-plugin-pwa registerType:'autoUpdate'
// Do NOT add registerSW here — double registration causes infinite reload loops on mobile

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
