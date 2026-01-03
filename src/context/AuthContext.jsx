import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Cookie-based auth: cookies are sent automatically by browser with withCredentials: true
    // No need to check localStorage for token
    try {
      logger.log('Calling getCurrentUser (cookie-based auth)');
      const response = await authService.getCurrentUser();
      logger.log('Auth check response:', response);
      logger.log('User data:', response.data?.user || response.user);
      
      // Handle different possible response structures
      const userData = response.data?.user || response.user || response.data;
      setUser(userData);
    } catch (error) {
      logger.error('Auth check failed:', error);
      logger.error('Error response:', error.response?.data);
      logger.error('Error status:', error.response?.status);
      
      // On 401, user is not authenticated (cookie expired or invalid)
      if (error.response?.status === 401) {
        logger.warn('401 Unauthorized - user not authenticated');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      logger.log('Login attempt:', { email, role });
      logger.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'Using fallback');
      
      // Login will set an HttpOnly cookie automatically
      // The cookie is sent by the browser, not accessible to JavaScript
      const response = await authService.login(email, password, role);
      logger.log('Login response (full):', JSON.stringify(response, null, 2));
      logger.log('Login response keys:', Object.keys(response || {}));
      
      // Extract user data from response if available
      const userData = 
        response?.user || 
        response?.data?.user || 
        (response?.data && typeof response.data === 'object' && response.data.user) ||
        response?.data;
      
      logger.log('Extracted userData:', userData);
      
      // Cookie-based auth: token is in HttpOnly cookie, automatically sent by browser
      // Note: If cookie has SameSite=Lax, cross-origin requests won't send the cookie
      // Backend should use SameSite=None; Secure for cross-origin cookies
      
      // Always try to get user info after login to verify cookie is working
      // Small delay to ensure cookie is set by browser
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (userData) {
        // If user data is in login response, use it but still verify
        setUser(userData);
        logger.log('User set from login response, verifying with checkAuth...');
        // Verify in background (don't await, but log errors)
        checkAuth().catch(err => {
          logger.error('Auth verification after login failed:', err);
        });
      } else {
        // Fetch user info using the cookie
        logger.log('No user data in login response, calling checkAuth to fetch user...');
        await checkAuth();
      }
      
      return response;
    } catch (error) {
      logger.error('Login error:', error);
      logger.error('Login error message:', error.message);
      logger.error('Login error code:', error.code);
      logger.error('Login error response:', error.response?.data);
      logger.error('Login error status:', error.response?.status);
      
      // Check for CORS errors
      if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK' || !error.response) {
        logger.error('Possible CORS or network error in production');
      }
      
      setUser(null);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      logger.log('Registering user:', data);
      const response = await authService.register(data);
      logger.log('Register response:', response);
      
      // Cookie-based auth: token is in HttpOnly cookie if backend sets it on registration
      // Extract user data from response if available
      const userData = 
        response?.user || 
        response?.data?.user || 
        (response?.data && typeof response.data === 'object' && response.data.user) ||
        response?.data;
      
      if (userData) {
        setUser(userData);
        logger.log('User set from registration response');
      } else {
        // If backend sets cookie on registration, verify auth
        // Otherwise, user needs to login separately
        logger.log('No user data in registration response, calling checkAuth...');
        await checkAuth();
      }
      
      logger.log('Auth check after registration completed');
      return response;
    } catch (error) {
      logger.error('Registration error:', error);
      logger.error('Registration error response:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Backend should clear the HttpOnly cookie
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      // Cookie-based auth: browser handles cookie clearing
      // No need to clear localStorage
      setUser(null);
    }
  };

  const getUserRole = () => {
    if (!user) {
      logger.log('No user found for role extraction');
      return null;
    }
    
    logger.log('User object for role extraction:', user);
    logger.log('User roles:', user.roles);
    logger.log('User role property:', user.role);
    
    // Handle different possible role structures
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // If roles is an array of objects with 'name' property
      const roleName = user.roles[0]?.name || user.roles[0];
      logger.log('Extracted role from roles array:', roleName);
      return typeof roleName === 'string' ? roleName.toLowerCase() : roleName;
    }
    
    // If user has a direct role property
    if (user.role) {
      const roleValue = typeof user.role === 'string' ? user.role.toLowerCase() : user.role;
      logger.log('Extracted role from role property:', roleValue);
      return roleValue;
    }
    
    logger.warn('No role found for user - user object:', user);
    return null;
  };

  const role = getUserRole();
  
  // Log role-based flags for debugging
  logger.log('Role calculation:', {
    role,
    isAdmin: role === 'admin',
    isAuthority: role === 'authority',
    isCitizen: role === 'citizen',
  });

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isAuthority: role === 'authority',
    isCitizen: role === 'citizen',
    role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

