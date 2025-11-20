import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { logger } from './utils/logger'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
        const updateSW = registerSW({
          onNeedRefresh() {
            logger.log('New content available, refresh needed');
            if (window.confirm('New content available, reload?')) {
              updateSW(true);
            }
          },
          onOfflineReady() {
            logger.log('App ready to work offline');
          },
        });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
