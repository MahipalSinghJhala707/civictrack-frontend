import api from './api';
import { logger } from '../utils/logger';

/**
 * Admin Service
 * 
 * BACKEND CONTRACT:
 * - All admin APIs require explicit city context (cityId param)
 * - All list APIs are paginated and city-scoped
 * - Returns { success, data, meta } where meta contains pagination info
 * - Optional includeAllCities=true for cross-city access (explicit opt-in)
 * - Optional includeDeleted=true to see soft-deleted records (admin only)
 */

/**
 * Build query params with pagination and city context
 */
const buildAdminParams = (options = {}) => {
  const params = {};
  
  // Pagination (required for list endpoints)
  params.page = options.page || 1;
  params.limit = options.limit || 20;
  
  // City context (required unless includeAllCities)
  if (options.cityId) {
    params.cityId = options.cityId;
  }
  if (options.includeAllCities) {
    params.includeAllCities = true;
  }
  
  // Soft-delete visibility (admin audit only)
  if (options.includeDeleted) {
    params.includeDeleted = true;
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

export const adminService = {
  // Users
  listUsers: (options = {}) => api.get('/api/admin/users', { params: buildAdminParams(options) }),
  createUser: (data) => api.post('/api/admin/users', data),
  updateUser: (userId, data) => api.patch(`/api/admin/users/${userId}`, data),
  updateUserRoles: (userId, roleIds, authorityId = null) => {
    logger.log('updateUserRoles called with:', { userId, roleIds, authorityId });
    const roleIdsArray = Array.isArray(roleIds) ? roleIds.map(id => parseInt(id)) : [parseInt(roleIds)];
    logger.log('Sending roleIds:', roleIdsArray, 'authorityId:', authorityId);
    const payload = { roleIds: roleIdsArray };
    if (authorityId) {
      payload.authorityId = parseInt(authorityId);
    }
    return api.patch(`/api/admin/users/${userId}/roles`, payload);
  },
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  changeUserPassword: (userId, newPassword) =>
    api.patch(`/api/admin/users/${userId}/password`, { newPassword }),

  // Departments
  listDepartments: (options = {}) => api.get('/api/admin/departments', { params: buildAdminParams(options) }),
  createDepartment: (data) => api.post('/api/admin/departments', data),
  updateDepartment: (departmentId, data) =>
    api.patch(`/api/admin/departments/${departmentId}`, data),
  deleteDepartment: (departmentId) =>
    api.delete(`/api/admin/departments/${departmentId}`),

  // Authorities
  listAuthorities: (options = {}) => api.get('/api/admin/authorities', { params: buildAdminParams(options) }),
  createAuthority: (data) => api.post('/api/admin/authorities', data),
  updateAuthority: (authorityId, data) =>
    api.patch(`/api/admin/authorities/${authorityId}`, data),
  deleteAuthority: (authorityId) =>
    api.delete(`/api/admin/authorities/${authorityId}`),

  // Authority Users
  listAuthorityUsers: (options = {}) => api.get('/api/admin/authority-users', { params: buildAdminParams(options) }),
  createAuthorityUser: (data) => api.post('/api/admin/authority-users', data),
  updateAuthorityUser: (authorityUserId, data) =>
    api.patch(`/api/admin/authority-users/${authorityUserId}`, data),
  deleteAuthorityUser: (authorityUserId) =>
    api.delete(`/api/admin/authority-users/${authorityUserId}`),

  // Authority Issues (Issue Categories assigned to Authorities)
  getAuthorityIssues: (authorityId) => {
    return api.get(`/api/admin/authorities/${authorityId}/issues`)
      .catch((err) => {
        if (err.response?.status === 404) {
          logger.log('Nested endpoint not found, trying alternative...');
          return api.get(`/api/admin/authority-issues?authorityId=${authorityId}`)
            .catch(() => ({ data: { data: { issues: [] } } }));
        }
        throw err;
      });
  },
  updateAuthorityIssues: (authorityId, issueIds) => {
    logger.log('Updating authority issues:', { authorityId, issueIds });
    const issueIdsArray = Array.isArray(issueIds) ? issueIds.map(id => parseInt(id)) : [parseInt(issueIds)];
    
    return api.patch(`/api/admin/authorities/${authorityId}/issues`, { issueIds: issueIdsArray })
      .catch((err) => {
        if (err.response?.status === 404) {
          logger.log('Nested endpoint not found, trying alternative...');
          return api.post(`/api/admin/authority-issues/bulk`, {
            authorityId: parseInt(authorityId), 
            issueIds: issueIdsArray
          }).catch(() => {
            logger.log('Bulk endpoint not found');
            throw err;
          });
        }
        throw err;
      });
  },

  // Issue Categories
  listIssueCategories: (options = {}) => api.get('/api/admin/issue-categories', { params: buildAdminParams(options) }),
  createIssueCategory: (data) => api.post('/api/admin/issue-categories', data),
  updateIssueCategory: (categoryId, data) => api.patch(`/api/admin/issue-categories/${categoryId}`, data),
  deleteIssueCategory: (categoryId) => api.delete(`/api/admin/issue-categories/${categoryId}`),

  // Cities (for city selector)
  listCities: () => api.get('/api/admin/cities'),
};

