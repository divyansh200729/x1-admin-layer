import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { pingDB } from './lib/db'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

// Wake Supabase on every app open to avoid cold-start delays
pingDB()

// Auto-reload when a new version of the app is deployed
registerSW({
  onNeedRefresh() { window.location.reload() },
  onOfflineReady() {},
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
