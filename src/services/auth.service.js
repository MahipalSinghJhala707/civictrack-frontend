import api from './api';
import { logger } from '../utils/logger';

export const authService = {
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (email, password, role) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
      role,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      logger.log('getCurrentUser raw response:', response);
      logger.log('getCurrentUser response.data:', response.data);
      return response.data;
    } catch (error) {
      logger.error('getCurrentUser error:', error);
      logger.error('getCurrentUser error response:', error.response);
      throw error;
    }
  },
};

