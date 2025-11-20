/**
 * Security configuration for Vite build
 * This file provides security recommendations for production deployment
 */

export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 'unsafe-eval' needed for Vite HMR in dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:8080 https://api.*", // Adjust for your API domain
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // XSS Protection (legacy but still recommended)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'interest-cohort=()',
  ].join(', '),
};

/**
 * Note: These headers should be configured in your production server (Nginx, Apache, etc.)
 * or via a framework like Express.js middleware.
 * 
 * For Nginx:
 * add_header Content-Security-Policy "default-src 'self'; ...";
 * 
 * For Express.js:
 * app.use((req, res, next) => {
 *   Object.entries(securityHeaders).forEach(([key, value]) => {
 *     res.setHeader(key, value);
 *   });
 *   next();
 * });
 */

