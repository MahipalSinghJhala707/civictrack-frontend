import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/issue.service';
import IssueCard from '../components/issue/IssueCard';
import Pagination from '../components/common/Pagination';
import { handleApiError } from '../utils/errorHandler';
import { logger } from '../utils/logger';

const IssueList = () => {
  const { isCitizen, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Pagination state (synced with backend)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  // Reload when filters or page change
  useEffect(() => {
    loadReports();
  }, [page, statusFilter, categoryFilter]);

  const loadCategories = async () => {
    try {
      const response = await issueService.listCategories();
      const categoriesData = response.data?.data?.categories || 
                            response.data?.categories || 
                            response.data?.data || 
                            [];
      setCategories(categoriesData);
    } catch (err) {
      logger.error('Failed to load categories:', err);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const options = {
        page,
        limit,
        status: statusFilter || undefined,
        categoryId: categoryFilter || undefined,
        // Admin users need to pass includeAllCities to bypass city scope validation
        includeAllCities: isAdmin ? true : undefined,
      };
      
      const response = await issueService.listReports(options);
      logger.log('API Response:', response);
      
      // Extract reports from response
      const reportsData = response.data?.data?.reports || 
                         response.data?.reports || 
                         response.data?.data || 
                         [];
      
      // Extract pagination meta from backend
      const meta = response.data?.meta || response.data?.data?.meta || {};
      
      setReports(reportsData);
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.totalCount || reportsData.length);
      
      logger.log('Loaded reports:', reportsData.length, 'Page:', page, 'Total:', meta.totalCount);
    } catch (err) {
      logger.error('Failed to load reports:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Filter locally by search query (for immediate feedback)
  const filteredReports = searchQuery.trim()
    ? reports.filter(report => {
        const query = searchQuery.toLowerCase();
        const title = report.title?.toLowerCase() || '';
        const description = report.description?.toLowerCase() || '';
        // city is an object with name property
        const cityName = report.city?.name?.toLowerCase() || '';
        const region = report.region?.toLowerCase() || '';
        // Also search in authority name if available
        const authorityName = report.authority?.name?.toLowerCase() || '';
        
        return title.includes(query) ||
               description.includes(query) ||
               cityName.includes(query) ||
               region.includes(query) ||
               authorityName.includes(query);
      })
    : reports;

  // Handle filter changes - reset to page 1
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setCategoryFilter('');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading issues...</p>
          </div>
        </div>
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
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Community Issues
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Track and monitor civic issues in your community
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          <div className="text-sm text-gray-600">Total Issues</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'reported').length}
          </div>
          <div className="text-sm text-gray-600">Reported</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'in_progress').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-2xl font-bold text-gray-900">
            {reports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, city..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(statusFilter || searchQuery || categoryFilter) && (
          <div className="mt-4">
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredReports.length}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> issues
          {totalPages > 1 && (
            <span className="text-gray-500"> (Page {page} of {totalPages})</span>
          )}
        </p>
        {isCitizen && (
          <button
            onClick={() => navigate('/report')}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Report New Issue
          </button>
        )}
      </div>

      {/* Issues Grid */}
      {filteredReports.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500 mb-4">
            {totalCount === 0
              ? 'There are no issues reported yet. Be the first to report an issue!'
              : 'Try adjusting your filters to see more results.'}
          </p>
          {isCitizen && totalCount === 0 && (
            <button
              onClick={() => navigate('/report')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Report an Issue
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/issues/${report.id}`)}
                className="cursor-pointer h-full"
              >
                <IssueCard report={report} onUpdate={loadReports} />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
            className="mt-8"
          />
        </>
      )}
    </div>
  );
};

export default IssueList;

