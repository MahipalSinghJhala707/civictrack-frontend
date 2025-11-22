/**
 * Cache Clearing Utility for Development/Testing
 * 
 * This utility helps clear PWA caches and service workers.
 * Useful for testing and development when backend changes.
 * 
 * Usage:
 * import { clearAllCaches } from '../utils/clearCache';
 * clearAllCaches().then(() => window.location.reload());
 */

import { logger } from './logger';

/**
 * Clear all browser caches (cookies, localStorage, sessionStorage, caches)
 */
export const clearAllCaches = async () => {
  try {
    logger.log('Clearing all caches...');
    
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      logger.log(`Found ${cacheNames.length} cache(s) to clear:`, cacheNames);
      
      await Promise.all(
        cacheNames.map(cacheName => {
          logger.log(`Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      
      logger.log('✓ All caches cleared');
    }
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      logger.log(`Found ${registrations.length} service worker(s) to unregister`);
      
      await Promise.all(
        registrations.map(registration => {
          logger.log(`Unregistering service worker: ${registration.scope}`);
          return registration.unregister();
        })
      );
      
      logger.log('✓ All service workers unregistered');
    }
    
    // Clear localStorage (except auth tokens - be careful!)
    const keysToKeep = ['backend-version', 'civictrack-cache-version'];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    logger.log('✓ LocalStorage cleared (kept version keys)');
    
    // Clear sessionStorage
    sessionStorage.clear();
    logger.log('✓ SessionStorage cleared');
    
    return true;
  } catch (error) {
    logger.error('Failed to clear caches:', error);
    return false;
  }
};

/**
 * Clear only API caches (keeps static assets)
 */
export const clearApiCaches = async () => {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const apiCaches = cacheNames.filter(name => name.includes('api'));
      
      await Promise.all(
        apiCaches.map(cacheName => {
          logger.log(`Deleting API cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      
      logger.log('✓ API caches cleared');
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Failed to clear API caches:', error);
    return false;
  }
};

/**
 * Force reload after clearing caches
 */
export const clearCacheAndReload = async () => {
  const confirmed = window.confirm(
    'This will clear all caches and reload the page. ' +
    'You may be logged out. Continue?'
  );
  
  if (!confirmed) return;
  
  await clearAllCaches();
  logger.log('Reloading page...');
  window.location.reload();
};

// Export for use in browser console during development
if (import.meta.env.DEV) {
  window.clearPWACache = clearAllCaches;
  window.clearApiCache = clearApiCaches;
  window.clearCacheAndReload = clearCacheAndReload;
  
  logger.log('Cache clearing utilities available in console:');
  logger.log('  - window.clearPWACache() - Clear all caches');
  logger.log('  - window.clearApiCache() - Clear API caches only');
  logger.log('  - window.clearCacheAndReload() - Clear and reload');
}

