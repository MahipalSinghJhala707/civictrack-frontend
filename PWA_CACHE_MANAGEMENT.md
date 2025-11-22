# PWA Cache Management Guide

This guide explains how the PWA cache management works and how to handle backend changes.

## Overview

The frontend now includes improved PWA cache management to ensure the app stays in sync with backend changes. This includes automatic version checking, cache clearing, and update notifications.

## Features

### 1. Backend Version Checking

The app checks for backend version updates on startup by calling `/api/version` endpoint.

**Backend Endpoint (Recommended):**
```
GET /api/version
Response: { "version": "2.0.0", "updatedAt": "2025-11-22T..." }
```

When the backend version changes, the app will:
- Clear all caches automatically
- Show a notification to the user
- Prompt for reload

### 2. Service Worker Updates

The service worker automatically checks for updates:
- On app startup (after 1 second)
- Every 5 minutes (periodic check)
- When the user navigates between pages

### 3. Cache Strategies

**API Calls (`/api/*`):**
- Strategy: NetworkFirst
- Cache Duration: 5 minutes
- Purpose: Ensures fresh data from backend

**Static Assets (images, fonts):**
- Strategy: CacheFirst
- Cache Duration: 30 days (images), 1 year (fonts)
- Purpose: Better performance for static content

### 4. Cache Clearing Utilities

For development/testing, you can use these utilities in the browser console:

```javascript
// Clear all caches and service workers
window.clearPWACache()

// Clear only API caches (keeps static assets)
window.clearApiCache()

// Clear all caches and reload page
window.clearCacheAndReload()
```

## How It Works

### On App Startup

1. Service worker is registered/updated
2. Backend version is checked (if `/api/version` exists)
3. Service worker update check is performed
4. Periodic update checker starts (every 5 minutes)

### When Backend Version Changes

1. App detects version change via `/api/version` endpoint
2. All caches are cleared
3. Service workers are unregistered
4. User is notified and prompted to reload

### Service Worker Update Flow

1. New service worker is detected
2. User is notified with a confirmation dialog
3. On confirmation, service worker updates
4. Page reloads with new service worker

## Configuration

### Update Service Worker Version

To force a service worker update, change the cache version in `vite.config.js`:

```javascript
workbox: {
  cacheName: 'api-cache-v2', // Change version number
  // ...
}
```

Then rebuild the app:
```bash
npm run build
```

### Backend Version Endpoint

Create a backend endpoint at `/api/version`:

```javascript
// Example backend endpoint
app.get('/api/version', (req, res) => {
  res.json({
    version: '2.0.0', // Update this when backend changes
    updatedAt: new Date().toISOString()
  });
});
```

## Manual Cache Clearing

### For Users

1. **Hard Refresh:** 
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content
   - Safari: Preferences → Advanced → Show Develop menu → Empty Caches

3. **Unregister Service Worker:**
   - Open DevTools (F12)
   - Go to Application → Service Workers
   - Click "Unregister"

### For Developers

Use the console utilities:
```javascript
// In browser console
window.clearPWACache() // Clear all
window.clearApiCache() // Clear API only
window.clearCacheAndReload() // Clear and reload
```

## Troubleshooting

### PWA Not Updating

1. **Check service worker status:**
   - Open DevTools → Application → Service Workers
   - Check if service worker is active/installed

2. **Force update:**
   ```javascript
   // In console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(reg => reg.update());
   });
   ```

3. **Clear caches manually:**
   ```javascript
   window.clearPWACache()
   ```

### Stale Data Issues

1. **Check cache expiration:**
   - API cache: 5 minutes
   - Static assets: 30 days

2. **Force API cache clear:**
   ```javascript
   window.clearApiCache()
   ```

3. **Verify backend version:**
   - Check if `/api/version` endpoint exists
   - Verify version is being updated when backend changes

### Service Worker Errors

1. **Check console for errors:**
   - Open DevTools → Console
   - Look for service worker errors

2. **Unregister and re-register:**
   - Unregister all service workers
   - Hard refresh the page

## Best Practices

1. ✅ **Update backend version** when making backend changes
2. ✅ **Increment cache version** in `vite.config.js` when needed
3. ✅ **Use NetworkFirst** for API calls (already configured)
4. ✅ **Test cache clearing** after backend updates
5. ✅ **Monitor console** for service worker update notifications

## Files

- `src/utils/pwaCache.js` - Cache management utilities
- `src/utils/clearCache.js` - Cache clearing utilities for dev
- `src/main.jsx` - Service worker registration and update handling
- `vite.config.js` - Workbox/PWA configuration

## API Cache Strategy

The app uses **NetworkFirst** strategy for all `/api/*` requests:

```javascript
{
  urlPattern: /\/api\/.*/i,
  handler: 'NetworkFirst',
  options: {
    networkTimeoutSeconds: 10, // Wait 10s for network
    maxAgeSeconds: 5 * 60, // Cache for 5 minutes
  }
}
```

This means:
1. App tries network first
2. If network fails or times out, uses cache
3. Cache expires after 5 minutes
4. Fresh data is always attempted first

## Summary

The PWA cache management system ensures:
- ✅ Automatic updates when backend changes
- ✅ Fresh data from API (NetworkFirst strategy)
- ✅ Better performance (cached static assets)
- ✅ Easy cache clearing for development
- ✅ User notifications for updates
- ✅ Backend version tracking (if endpoint exists)

