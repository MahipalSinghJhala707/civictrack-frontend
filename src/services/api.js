import axios from 'axios';

// Ensure HTTPS in production
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) {
    // If URL is provided, use it as-is (should be HTTPS in production)
    return envURL;
  }
  
  // In development, allow HTTP for localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:8080';
  }
  
  // In production, enforce HTTPS (adjust port/domain as needed)
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'https:';
  const hostname = window.location.hostname;
  const port = hostname === 'localhost' ? ':8080' : '';
  return `${protocol}//${hostname}${port}`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add cache-busting for API calls to ensure fresh data
    // Use timestamp for non-GET requests or when cache control is not set
    if (config.method && config.method.toLowerCase() !== 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }
    
    // Add timestamp to GET requests for cache busting (optional, can be removed if backend handles caching)
    if (config.method && config.method.toLowerCase() === 'get' && config.url && !config.url.includes('?')) {
      // Only add if URL doesn't already have query params
      config.url = `${config.url}?_t=${Date.now()}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

