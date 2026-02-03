/**
 * Pagination Component
 * 
 * BACKEND CONTRACT:
 * - Backend returns meta: { page, limit, totalPages, totalCount }
 * - Frontend must send page & limit with every list request
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  loading = false,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav 
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || loading}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasPrev && !loading
            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
        }`}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center space-x-1">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}
        
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Mobile: Page indicator */}
      <span className="sm:hidden px-3 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || loading}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasNext && !loading
            ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
        }`}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;
