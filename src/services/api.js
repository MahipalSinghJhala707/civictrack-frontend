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

const baseURL = getBaseURL();
// Log the API base URL (helps debug production issues)
console.log('API Base URL:', baseURL);
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || 'Not set');

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Cookie-based auth: HttpOnly cookies are sent automatically by browser
    // No need to add Authorization header - the cookie is sent with withCredentials: true
    // Note: If backend requires both cookie AND Authorization header, uncomment below:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Add cache-busting headers for non-GET requests to ensure fresh data
    if (config.method && config.method.toLowerCase() !== 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
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
      // Cookie-based auth: 401 means cookie expired or invalid
      // Browser will handle cookie clearing automatically
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

