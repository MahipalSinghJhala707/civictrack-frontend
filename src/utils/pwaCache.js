/**
 * PWA Cache Management Utilities
 * Handles cache versioning, updates, and clearing for better backend sync
 */

import { logger } from './logger';

const CACHE_VERSION_KEY = 'civictrack-cache-version';
const BACKEND_VERSION_KEY = 'backend-version';

/**
 * Get current cache version
 */
export const getCacheVersion = () => {
  return localStorage.getItem(CACHE_VERSION_KEY) || '1.0.0';
};

/**
 * Set cache version
 */
export const setCacheVersion = (version) => {
  localStorage.setItem(CACHE_VERSION_KEY, version);
};

/**
 * Get stored backend version
 */
export const getBackendVersion = () => {
  return localStorage.getItem(BACKEND_VERSION_KEY);
};

/**
 * Set backend version
 */
export const setBackendVersion = (version) => {
  localStorage.setItem(BACKEND_VERSION_KEY, version);
};

/**
 * Check backend version and clear cache if updated
 * This should be called on app startup
 */
export const checkBackendVersion = async () => {
  try {
    const response = await fetch('/api/version', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
    });
    
    if (response.ok) {
      const data = await response.json();
      const currentVersion = data.version || data.backendVersion;
      
      if (currentVersion) {
        const storedVersion = getBackendVersion();
        
        if (storedVersion && storedVersion !== currentVersion) {
          // Backend version changed, clear caches
          logger.warn(`Backend version changed from ${storedVersion} to ${currentVersion}. Clearing caches...`);
          await clearAllCaches();
          setBackendVersion(currentVersion);
          
          // Show notification to user
          if (window.confirm('A new version of the application is available. Would you like to reload?')) {
            window.location.reload();
          }
        } else if (!storedVersion) {
          // First time, just store the version
          setBackendVersion(currentVersion);
        }
      }
    }
  } catch (error) {
    // Version endpoint might not exist, that's okay
    logger.log('Version check endpoint not available or failed:', error);
  }
};

/**
 * Clear all caches and unregister service workers
 */
export const clearAllCaches = async () => {
  try {
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          logger.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      logger.log('All caches cleared');
    }
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          logger.log('Unregistering service worker:', registration.scope);
          return registration.unregister();
        })
      );
      logger.log('All service workers unregistered');
    }
    
    return true;
  } catch (error) {
    logger.error('Failed to clear caches:', error);
    return false;
  }
};

/**
 * Force service worker update check
 */
export const forceServiceWorkerUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        logger.log('Checking for service worker updates...');
        await registration.update();
      }
      
      logger.log('Service worker update check completed');
      return true;
    } catch (error) {
      logger.error('Failed to check for service worker updates:', error);
      return false;
    }
  }
  
  return false;
};

/**
 * Setup service worker update listener
 */
export const setupServiceWorkerUpdateListener = () => {
  if ('serviceWorker' in navigator) {
    // Listen for controller change (new service worker activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      logger.log('New service worker activated, reloading...');
      window.location.reload();
    });
    
    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        logger.log('Service worker update available');
        if (window.confirm('A new version is available. Reload now?')) {
          window.location.reload();
        }
      }
    });
  }
};

/**
 * Check for updates periodically
 */
export const startUpdateChecker = (intervalMinutes = 5) => {
  const interval = intervalMinutes * 60 * 1000; // Convert to milliseconds
  
  setInterval(async () => {
    logger.log('Periodic update check...');
    await forceServiceWorkerUpdate();
    await checkBackendVersion();
  }, interval);
  
  logger.log(`Update checker started (checking every ${intervalMinutes} minutes)`);
};

