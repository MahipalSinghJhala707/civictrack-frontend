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
    try {
      const response = await authService.getCurrentUser();
      logger.log('Auth check response:', response);
      logger.log('User data:', response.data?.user || response.user);
      
      // Handle different possible response structures
      const userData = response.data?.user || response.user || response.data;
      setUser(userData);
    } catch (error) {
      logger.error('Auth check failed:', error);
      logger.error('Error response:', error.response?.data);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      logger.log('Login attempt:', { email, role });
      const response = await authService.login(email, password, role);
      logger.log('Login response (full):', JSON.stringify(response, null, 2));
      logger.log('Login response keys:', Object.keys(response));
      
      // Extract token and user from response (handle different response structures)
      // authService.login returns response.data, so response is already unwrapped
      const token = response.token || response.data?.token || response.accessToken || response.access_token;
      const userData = response.user || response.data?.user || response.data;
      
      logger.log('Extracted token:', token ? 'Found' : 'Not found');
      logger.log('Extracted userData:', userData);
      
      // If using cookie-based auth (withCredentials: true), token might not be in response
      // In that case, we still call checkAuth to verify and get user
      if (token) {
        // Store token in localStorage
        localStorage.setItem('token', token);
        // Set user state directly if user data is available
        if (userData) {
          setUser(userData);
        } else {
          // If no user data in login response, fetch it
          await checkAuth();
        }
      } else {
        // Cookie-based auth: just verify and get user
        logger.log('No token in response, using cookie-based auth');
        await checkAuth();
      }
      
      return response;
    } catch (error) {
      logger.error('Login error:', error);
      logger.error('Login error response:', error.response?.data);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      logger.log('Registering user:', data);
      const response = await authService.register(data);
      logger.log('Register response:', response);
      
      // Extract token and user from response (handle different response structures)
      const token = response.data?.token || response.token || response.data?.data?.token;
      const userData = response.data?.user || response.user || response.data?.data?.user || response.data;
      
      if (token) {
        // Store token in localStorage
        localStorage.setItem('token', token);
        // Set user state directly
        setUser(userData);
      } else {
        // If no token, check auth (might be cookie-based or needs separate login)
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
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const getUserRole = () => {
    if (!user) {
      logger.log('No user found');
      return null;
    }
    
    logger.log('User object:', user);
    logger.log('User roles:', user.roles);
    
    // Handle different possible role structures
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // If roles is an array of objects with 'name' property
      const roleName = user.roles[0]?.name || user.roles[0];
      logger.log('Extracted role:', roleName);
      return roleName;
    }
    
    // If user has a direct role property
    if (user.role) {
      logger.log('Direct role property:', user.role);
      return user.role;
    }
    
    logger.log('No role found for user');
    return null;
  };

  const role = getUserRole();

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

