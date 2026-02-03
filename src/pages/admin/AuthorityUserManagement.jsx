import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { handleApiError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';
import Pagination from '../../components/common/Pagination';

const AuthorityUserManagement = () => {
  const [authorityUsers, setAuthorityUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthUser, setEditingAuthUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    authorityId: '',
  });
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  
  // City context - default to all cities since no city API exists yet
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [includeAllCities, setIncludeAllCities] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Soft-delete toggle
  const [includeDeleted, setIncludeDeleted] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCityId, includeAllCities, page, includeDeleted]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([
        loadAuthorityUsers(),
        loadUsers(),
        loadAuthorities(),
      ]);
    } catch (err) {
      logger.error('Failed to load data:', err);
      setError('Failed to load data: ' + handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorityUsers = async () => {
    try {
      const options = {
        page,
        limit: 20,
        includeDeleted,
        ...(includeAllCities ? { includeAllCities: true } : { cityId: selectedCityId })
      };
      
      const response = await adminService.listAuthorityUsers(options);
      const responseData = response.data?.data || response.data;
      const authUsersData = responseData?.authorityUsers || responseData || [];
      const meta = response.data?.meta || {};
      
      setAuthorityUsers(authUsersData);
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.totalCount || authUsersData.length);
    } catch (err) {
      logger.error('Failed to load authority users:', err);
      setError('Failed to load authority users: ' + handleApiError(err));
    }
  };

  const loadUsers = async () => {
    try {
      const options = includeAllCities ? { includeAllCities: true } : { cityId: selectedCityId };
      const response = await adminService.listUsers(options);
      const usersData = response.data?.data?.users || [];
      // Filter to only show users with 'authority' role
      const authorityRoleUsers = usersData.filter(user => 
        user.roles?.some(role => role.name === 'authority')
      );
      setUsers(authorityRoleUsers);
    } catch (err) {
      logger.error('Failed to load users:', err);
    }
  };

  const loadAuthorities = async () => {
    try {
      const options = includeAllCities ? { includeAllCities: true } : { cityId: selectedCityId };
      const response = await adminService.listAuthorities(options);
      setAuthorities(response.data?.data?.authorities || []);
    } catch (err) {
      logger.error('Failed to load authorities:', err);
    }
  };

  const handleCityChange = (cityId) => {
    setSelectedCityId(cityId);
    setPage(1);
  };

  const handleCreate = () => {
    setEditingAuthUser(null);
    setFormData({ userId: '', authorityId: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleEdit = (authUser) => {
    setEditingAuthUser(authUser);
    setFormData({
      userId: authUser.user?.id || authUser.user_id || '',
      authorityId: authUser.authority?.id || authUser.authority_id || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation
    if (!formData.userId) {
      setFormError('Please select a user.');
      return;
    }
    if (!formData.authorityId) {
      setFormError('Please select an authority.');
      return;
    }

    try {
      if (editingAuthUser) {
        await adminService.updateAuthorityUser(editingAuthUser.id, {
          authorityId: parseInt(formData.authorityId),
        });
      } else {
        await adminService.createAuthorityUser({
          userId: parseInt(formData.userId),
          authorityId: parseInt(formData.authorityId),
        });
      }
      setShowModal(false);
      setFormData({ userId: '', authorityId: '' });
      loadData();
    } catch (err) {
      logger.error('Failed to save authority user:', err);
      setFormError('Failed to save: ' + handleApiError(err));
    }
  };

  const handleDelete = async (authUserId) => {
    if (!window.confirm('Are you sure you want to remove this authority-user link? This will unlink the user from the authority.')) {
      return;
    }
    try {
      await adminService.deleteAuthorityUser(authUserId);
      loadData();
    } catch (err) {
      alert('Failed to delete: ' + handleApiError(err));
    }
  };

  if (loading && authorityUsers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authority User Management</h1>
          <p className="text-gray-600 mt-1">
            {totalCount} link{totalCount !== 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Link User to Authority
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        {/* Soft-delete toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeDeleted"
            checked={includeDeleted}
            onChange={(e) => {
              setIncludeDeleted(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="includeDeleted" className="text-sm text-gray-700">
            Show deleted links
          </label>
          {includeDeleted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Showing deleted records
            </span>
          )}
        </div>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}

      {authorityUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No authority-user links found</h3>
          <p className="text-gray-500 mb-4">
            Get started by linking a user with 'authority' role to an authority.
          </p>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Link User to Authority
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {authorityUsers.map((authUser) => (
              <li key={authUser.id} className={`px-6 py-4 ${authUser.deleted_at ? 'bg-red-50 opacity-75' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {authUser.user?.name || 'Unknown User'}
                      </h3>
                      {authUser.deleted_at && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Deleted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {authUser.user?.email || 'No email'}
                    </p>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Authority: </span>
                      <span className="text-sm text-gray-600">
                        {authUser.authority?.name || 'Unknown Authority'}
                        {authUser.authority?.city && authUser.authority?.region && (
                          <span className="text-gray-500">
                            {' '}({authUser.authority.city}, {authUser.authority.region})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!authUser.deleted_at && (
                      <>
                        <button
                          onClick={() => handleEdit(authUser)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(authUser.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Unlink
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        className="mt-6"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingAuthUser ? 'Edit Authority User Link' : 'Link User to Authority'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                  disabled={!!editingAuthUser}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select a user (with 'authority' role)</option>
                  {users.map((user) => {
                    // Check if user is already linked to an authority (unless editing this link)
                    const isLinked = authorityUsers.some(
                      au => au.user?.id === user.id && (!editingAuthUser || au.id !== editingAuthUser.id)
                    );
                    return (
                      <option 
                        key={user.id} 
                        value={user.id}
                        disabled={isLinked}
                      >
                        {user.name} ({user.email})
                        {isLinked && ' - Already linked to an authority'}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only users with 'authority' role are shown. Each user can be linked to one authority only.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authority <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.authorityId}
                  onChange={(e) => setFormData({ ...formData, authorityId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an authority</option>
                  {authorities.map((auth) => (
                    <option key={auth.id} value={auth.id}>
                      {auth.name} - {auth.city}, {auth.region}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormError('');
                    setFormData({ userId: '', authorityId: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingAuthUser ? 'Update Link' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityUserManagement;

