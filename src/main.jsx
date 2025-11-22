import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { logger } from './utils/logger'
import { 
  checkBackendVersion, 
  setupServiceWorkerUpdateListener,
  forceServiceWorkerUpdate
} from './utils/pwaCache'
import './utils/clearCache' // Initialize cache clearing utilities for dev
import './utils/clearCache' // Initialize cache clearing utilities for dev
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      logger.log('New content available, refresh needed');
      // Show a better notification
      const shouldReload = window.confirm(
        'A new version of CivicTrack is available. Would you like to reload now?\n\n' +
        'Your current work will be saved, but you may need to refresh to see the latest changes.'
      );
      if (shouldReload) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      logger.log('App ready to work offline');
    },
    onRegistered(registration) {
      logger.log('Service worker registered:', registration.scope);
      
      // Check for updates periodically (every 5 minutes)
      if (registration) {
        setInterval(() => {
          registration.update();
          logger.log('Checking for service worker updates...');
        }, 5 * 60 * 1000); // 5 minutes
      }
    },
    onRegisterError(error) {
      logger.error('Service worker registration error:', error);
    },
  });
  
  // Setup update listeners
  setupServiceWorkerUpdateListener();
  
  // Check for service worker updates on startup
  setTimeout(() => {
    forceServiceWorkerUpdate();
  }, 1000);
}

// Check backend version on startup (if endpoint exists)
checkBackendVersion().catch(err => {
  logger.log('Backend version check failed (endpoint may not exist):', err);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
