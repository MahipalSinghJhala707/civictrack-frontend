/**
 * Helper functions for handling images
 */

/**
 * Converts relative image URLs to absolute URLs if needed
 * Handles both absolute URLs (http://, https://) and relative URLs
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // If URL is already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, it's a relative path from domain root
  if (url.startsWith('/')) {
    // Get the API base URL to construct absolute URL
    const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '';
    if (apiBaseURL) {
      // Remove trailing slash from base URL if present
      const base = apiBaseURL.replace(/\/$/, '');
      return `${base}${url}`;
    }
    // If no API base URL, assume same origin
    return url;
  }
  
  // Otherwise, assume it's relative to API base
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '';
  if (apiBaseURL) {
    const base = apiBaseURL.replace(/\/$/, '');
    return `${base}/${url}`;
  }
  
  return url;
};

/**
 * Handles image load errors
 */
export const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  // Optionally set a placeholder image
  event.target.style.display = 'none';
};

