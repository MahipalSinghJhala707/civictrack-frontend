import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin, isAuthority, isCitizen } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600" onClick={handleLinkClick}>
              CivicTrack
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4 md:flex-1 md:justify-center md:ml-8">
            {user && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                {isCitizen && (
                  <>
                    <Link
                      to="/report"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Report Issue
                    </Link>
                    <Link
                      to="/my-reports"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      My Reports
                    </Link>
                  </>
                )}
                {isAuthority && (
                  <Link
                    to="/authority/issues"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Assigned Issues
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/departments"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Departments
                    </Link>
                    <Link
                      to="/admin/authorities"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Authorities
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Categories
                    </Link>
                    <Link
                      to="/admin/flagged"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Flagged Reports
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Profile
                </Link>
                <span className="text-sm text-gray-700 hidden lg:inline">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <span className="text-xs text-gray-600 truncate max-w-[80px] sm:max-w-[120px]">
                {user.name}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Home
                  </Link>
                  {isCitizen && (
                    <>
                      <Link
                        to="/report"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Report Issue
                      </Link>
                      <Link
                        to="/my-reports"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        My Reports
                      </Link>
                    </>
                  )}
                  {isAuthority && (
                    <Link
                      to="/authority/issues"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Assigned Issues
                    </Link>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/users"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/departments"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Departments
                      </Link>
                      <Link
                        to="/admin/authorities"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Authorities
                      </Link>
                      <Link
                        to="/admin/categories"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Categories
                      </Link>
                      <Link
                        to="/admin/flagged"
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Flagged Reports
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Profile
                    </Link>
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
