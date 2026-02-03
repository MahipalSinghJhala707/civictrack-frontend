import api from './api';
import { logger } from '../utils/logger';

/**
 * Issue Service
 * 
 * BACKEND CONTRACT:
 * - All list APIs are paginated and city-scoped
 * - Returns { success, data, meta } where meta contains pagination info
 * - Assignment outcomes are explicit (ASSIGNED, UNASSIGNED, etc.)
 */

/**
 * Build query params with pagination
 */
const buildListParams = (options = {}) => {
  const params = {};
  
  // Pagination (required)
  params.page = options.page || 1;
  params.limit = options.limit || 20;
  
  // Filters
  if (options.status) {
    params.status = options.status;
  }
  if (options.categoryId || options.issueId) {
    params.issueId = options.categoryId || options.issueId;
  }
  if (options.cityId) {
    params.cityId = options.cityId;
  }
  if (options.region) {
    params.region = options.region;
  }
  
  // myIssues filter (for citizens to see only their own reports)
  if (options.myIssues) {
    params.myIssues = true;
  }
  
  // City context (for admin endpoints like flaggedReports)
  if (options.includeAllCities) {
    params.includeAllCities = true;
  }
  
  // Sorting
  if (options.sortBy) {
    params.sortBy = options.sortBy;
  }
  if (options.sortOrder) {
    params.sortOrder = options.sortOrder;
  }
  
  return params;
};

export const issueService = {
  // Categories
  listCategories: () => api.get('/api/issues/categories'),
  createCategory: (data) => api.post('/api/admin/issue-categories', data),
  updateCategory: (categoryId, data) => api.patch(`/api/admin/issue-categories/${categoryId}`, data),
  deleteCategory: (categoryId) => api.delete(`/api/admin/issue-categories/${categoryId}`),
  
  // Authorities (for citizens to select when reporting issues)
  listAuthorities: () => {
    return api.get('/api/issues/authorities').catch(() => {
      return api.get('/api/admin/authorities');
    });
  },
  
  // Reports
  createReport: (formData) => {
    return api.post('/api/issues/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  listReports: (options = {}) => {
    return api.get('/api/issues/reports', { params: buildListParams(options) });
  },
  
  getReport: (reportId) => {
    return api.get(`/api/issues/reports/${reportId}`);
  },
  
  updateStatus: (reportId, data) =>
    api.patch(`/api/issues/reports/${reportId}/status`, data),
  
  flagReport: (reportId, flagId) =>
    api.post(`/api/issues/reports/${reportId}/flag`, { flagId }),
  
  deleteFlag: (flagId, reportId) => {
    return api.delete(`/api/issues/reports/${reportId}/flags/${flagId}`)
      .catch((err) => {
        if (err.response?.status === 404 || err.response?.status === 405) {
          return api.delete(`/api/issues/reports/flags/${flagId}`)
            .catch((err2) => {
              return api.delete(`/api/admin/flags/${flagId}`)
                .catch((err3) => {
                  logger.error('Failed to delete flag with all endpoints:', err3);
                  throw new Error(`The API endpoint for deleting flags was not found.`);
                });
            });
        }
        throw err;
      });
  },
  
  listFlaggedReports: (options = {}) => api.get('/api/issues/reports/flagged', { params: buildListParams(options) }),
  
  hideReport: (reportId) => {
    return api.patch(`/api/issues/reports/${reportId}`, { is_hidden: true })
      .catch((err) => {
        if (err.response?.status === 404 || err.response?.status === 405) {
          return api.post(`/api/issues/reports/${reportId}/hide`)
            .catch((err2) => {
              logger.error('Failed to hide report with both endpoints:', err2);
              throw new Error(`The API endpoint for hiding reports was not found.`);
            });
        }
        throw err;
      });
  },

  // Assignment
  getAssignmentHistory: (reportId) => api.get(`/api/issues/reports/${reportId}/assignments`),
  
  retryAssignment: (reportId) => api.post(`/api/issues/reports/${reportId}/assignments/retry`),
};

