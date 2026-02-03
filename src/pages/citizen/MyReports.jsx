import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { issueService } from '../../services/issue.service';
import IssueCard from '../../components/issue/IssueCard';
import { handleApiError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';
import Pagination from '../../components/common/Pagination';

const MyReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.success && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user, statusFilter, page]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      // Use backend's myIssues filter for server-side filtering
      const options = {
        page,
        limit: 12, // Grid layout, multiples of 3
        myIssues: true, // Backend filter for current user's reports
        ...(statusFilter && { status: statusFilter })
      };
      
      const response = await issueService.listReports(options);
      logger.log('API Response:', response);
      
      const responseData = response.data?.data || response.data;
      const reportsData = responseData?.reports || responseData || [];
      const meta = response.data?.meta || {};
      
      logger.log('My reports from API:', reportsData);
      
      setReports(reportsData);
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.totalCount || reportsData.length);
    } catch (err) {
      logger.error('Failed to load reports:', err);
      logger.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when filter changes
  };

  if (loading && reports.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600 mt-1">
            {totalCount} report{totalCount !== 1 ? 's' : ''}
            {statusFilter && ` with status "${statusFilter}"`}
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {reports.length === 0 ? (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-500 mb-4">
            {totalCount === 0 && !statusFilter
              ? "You haven't reported any issues yet. Click the button below to report your first issue!"
              : 'No reports match the selected filter. Try changing the status filter.'}
          </p>
          {totalCount === 0 && !statusFilter && (
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
            {reports.map((report) => (
              <IssueCard key={report.id} report={report} onUpdate={loadReports} />
            ))}
          </div>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
};

export default MyReports;