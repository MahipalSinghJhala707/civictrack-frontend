import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueService } from '../../services/issue.service';
import IssueCard from '../../components/issue/IssueCard';
import Pagination from '../../components/common/Pagination';
import { handleApiError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

const AssignedIssues = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadReports();
  }, [page, statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const options = {
        page,
        limit,
        status: statusFilter || undefined,
      };
      
      const response = await issueService.listReports(options);
      logger.log('API Response:', response);
      
      // Extract reports from response
      const reportsData = response.data?.data?.reports || 
                         response.data?.reports || 
                         response.data?.data || 
                         [];
      
      // Extract pagination meta
      const meta = response.data?.meta || response.data?.data?.meta || {};
      
      setReports(reportsData);
      setTotalPages(meta.totalPages || 1);
      setTotalCount(meta.totalCount || reportsData.length);
    } catch (err) {
      logger.error('Failed to load reports:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (loading && reports.length === 0) {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assigned Issues</h1>
          <p className="text-gray-600 mt-1">
            {totalCount} total issue{totalCount !== 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No assigned issues found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/issues/${report.id}`)}
                className="cursor-pointer h-full"
              >
                <IssueCard report={report} onUpdate={loadReports} />
              </div>
            ))}
          </div>
          
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

export default AssignedIssues;

