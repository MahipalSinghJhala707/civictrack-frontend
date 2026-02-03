/**
 * Unified Error Handler
 * 
 * BACKEND CONTRACT:
 * - All API errors return: { success: false, message: string }
 * - Backend messages are human-readable and should be displayed directly
 * 
 * PRINCIPLE:
 * - Trust backend error messages - they are already user-friendly
 * - Only provide fallback messages when no backend message exists
 * - Never transform or interpret backend messages
 */

/**
 * Extracts and returns the backend error message directly.
 * Provides minimal fallbacks only when backend message is unavailable.
 */
export const handleApiError = (error) => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Extract backend message from response
  if (error.response?.data?.message) {
    // Backend provides user-friendly messages - use them directly
    return error.response.data.message;
  }

  // Handle array of error messages (validation errors)
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const messages = error.response.data.errors
      .map(err => typeof err === 'string' ? err : err.message || err.msg)
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join('. ');
    }
  }

  // Minimal fallbacks for cases where backend didn't provide a message
  if (error.response) {
    const { status } = error.response;
    
    // Only provide fallbacks for status codes, not interpretations
    switch (status) {
      case 401:
        // Redirect handled in api.js interceptor
        return 'Your session has expired. Please sign in again.';
      case 500:
      case 502:
      case 503:
        return 'Our servers are experiencing issues. Please try again in a few moments.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Use error.message if available
  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract specific field errors from validation response
 * Used for inline form validation display
 */
export const getFieldErrors = (error) => {
  if (!error?.response?.data?.errors) {
    return {};
  }

  const errors = error.response.data.errors;
  
  // Handle array of validation errors with field property
  if (Array.isArray(errors)) {
    return errors.reduce((acc, err) => {
      if (err.field || err.path) {
        acc[err.field || err.path] = err.message || err.msg;
      }
      return acc;
    }, {});
  }

  // Handle object with field names as keys
  if (typeof errors === 'object') {
    return errors;
  }

  return {};
};

