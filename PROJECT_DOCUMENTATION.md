# CivicTrack Frontend - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Project Structure](#project-structure)
5. [Key Features](#key-features)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Integration](#api-integration)
8. [Components](#components)
9. [Pages](#pages)
10. [Services](#services)
11. [Utilities](#utilities)
12. [Configuration](#configuration)
13. [Development Setup](#development-setup)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**CivicTrack** is a civic issue tracking and reporting platform that enables citizens to report community issues, authorities to manage and resolve them, and administrators to oversee the entire system. The frontend is built as a modern, responsive Progressive Web App (PWA) using React.

### Purpose
- **Citizens**: Report issues, track their reports, and flag inappropriate content
- **Authorities**: View assigned issues, update status, and manage resolutions
- **Administrators**: Manage users, departments, authorities, categories, and flagged reports

### Key Characteristics
- **Progressive Web App (PWA)**: Works offline, installable on devices
- **Role-Based Access Control**: Three distinct user roles with different permissions
- **Cookie-Based Authentication**: Secure HttpOnly cookie authentication
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Real-time Updates**: Dynamic status updates and issue tracking

---

## Technology Stack

### Core Technologies
- **React 19.2.0**: UI library
- **React Router DOM 7.9.6**: Client-side routing
- **Vite 7.2.2**: Build tool and dev server
- **Axios 1.13.2**: HTTP client for API requests

### Styling
- **Tailwind CSS 4.1.17**: Utility-first CSS framework
- **PostCSS 8.5.6**: CSS processing
- **Autoprefixer 10.4.22**: CSS vendor prefixing

### PWA & Caching
- **Vite PWA Plugin 1.1.0**: Service worker and PWA features
- **Workbox Window 7.3.0**: Service worker management

### Development Tools
- **ESLint 9.39.1**: Code linting
- **TypeScript Types**: Type definitions for React

---

## Project Architecture

### Architecture Pattern
The project follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components, Layout)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Context Layer                │
│      (AuthContext, State)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer                │
│   (API Services, HTTP Client)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Utility Layer                │
│  (Helpers, Error Handling, Logger)   │
└─────────────────────────────────────┘
```

### Data Flow
1. **User Action** → Component
2. **Component** → Service (API call)
3. **Service** → API (HTTP request)
4. **Response** → Context (State update)
5. **Context** → Component (Re-render)

---

## Project Structure

```
civictrack-frontend/
├── public/                 # Static assets
│   ├── icons/            # PWA icons
│   └── manifest.json     # PWA manifest
├── src/
│   ├── assets/           # Images, fonts
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared components
│   │   ├── forms/       # Form components
│   │   ├── issue/       # Issue-related components
│   │   └── layout/      # Layout components
│   ├── context/         # React Context providers
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   ├── auth/        # Authentication pages
│   │   ├── authority/   # Authority pages
│   │   └── citizen/     # Citizen pages
│   ├── services/        # API service layer
│   └── utils/           # Utility functions
├── docker/              # Docker configuration
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

---

## Key Features

### 1. Role-Based Access Control
- **Citizen**: Report issues, view all issues, flag content, manage own reports
- **Authority**: View assigned issues, update status, manage resolutions
- **Admin**: Full system access, user management, category management, flagged reports

### 2. Issue Management
- Create issues with images, location, and category
- Filter and search issues
- Track issue status (Reported → In Progress → Resolved/Rejected)
- View detailed issue information

### 3. Image Handling
- Upload multiple images per issue
- Image validation (type, size)
- Automatic URL resolution for production
- Error handling for failed image loads

### 4. Progressive Web App
- Offline support via service worker
- Installable on devices
- Automatic updates
- Caching strategies for assets and API calls

### 5. Authentication
- Cookie-based authentication (HttpOnly cookies)
- Automatic session management
- Role-based route protection
- Secure logout

---

## Authentication & Authorization

### Authentication Flow

1. **Login Process**:
   ```
   User submits credentials → API login request → Backend sets HttpOnly cookie
   → Frontend calls /me to verify → User state updated → Navigation
   ```

2. **Session Management**:
   - Cookies are automatically sent with requests (`withCredentials: true`)
   - No manual token management required
   - Session persists across page refreshes

3. **Authorization**:
   - Routes protected by `ProtectedRoute` component
   - Role-based access control via `requiredRole` prop
   - Automatic redirect to login on unauthorized access

### AuthContext (`src/context/AuthContext.jsx`)

**State**:
- `user`: Current user object
- `loading`: Authentication check status
- `isAuthenticated`: Boolean authentication status
- `isAdmin`, `isAuthority`, `isCitizen`: Role flags
- `role`: Current user role

**Methods**:
- `login(email, password, role)`: Authenticate user
- `register(data)`: Register new user
- `logout()`: Clear session
- `checkAuth()`: Verify current session

**Role Detection**:
- Supports multiple role structures from backend
- Handles `user.role` or `user.roles[]` arrays
- Case-insensitive role matching
- Comprehensive logging for debugging

---

## API Integration

### API Configuration (`src/services/api.js`)

**Base URL**:
- Development: `http://localhost:8080` (or from `VITE_API_BASE_URL`)
- Production: From environment variable `VITE_API_BASE_URL`

**Features**:
- Automatic cookie handling (`withCredentials: true`)
- Request interceptors for cache-busting
- Response interceptors for error handling
- Automatic redirect on 401 (unauthorized)

### Service Layer

#### Auth Service (`src/services/auth.service.js`)
- `login(email, password, role)`: User authentication
- `register(data)`: User registration
- `logout()`: Session termination
- `getCurrentUser()`: Fetch current user info
- `changePassword(oldPassword, newPassword)`: Password update

#### Issue Service (`src/services/issue.service.js`)
- `listCategories()`: Get issue categories
- `createReport(formData)`: Submit new issue
- `listReports(params)`: Get filtered issues
- `getReport(reportId)`: Get issue details
- `updateStatus(reportId, data)`: Update issue status
- `flagReport(reportId, flagId)`: Flag inappropriate content
- `deleteFlag(flagId, reportId)`: Remove flag

#### Admin Service (`src/services/admin.service.js`)
- User management (CRUD operations)
- Department management
- Authority management
- Category management
- Flagged reports management

---

## Components

### Layout Components

#### Header (`src/components/layout/Header.jsx`)
- Navigation menu
- User profile dropdown
- Logout functionality
- Role-based menu items

#### Footer (`src/components/layout/Footer.jsx`)
- Copyright information
- Footer links

### Common Components

#### ProtectedRoute (`src/components/common/ProtectedRoute.jsx`)
- Route protection wrapper
- Role-based access control
- Loading state handling
- Automatic redirect to login

**Usage**:
```jsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

#### StatusBadge (`src/components/common/StatusBadge.jsx`)
- Visual status indicator
- Color-coded badges (blue, yellow, green, red)
- Status labels (Reported, In Progress, Resolved, Rejected)

### Form Components

#### ImageUpload (`src/components/forms/ImageUpload.jsx`)
- Multiple image upload
- File validation (type, size)
- Image preview
- Remove functionality
- Max images and size limits

**Props**:
- `maxImages`: Maximum number of images (default: 5)
- `maxSizeMB`: Maximum file size in MB (default: 5)
- `onUpload`: Callback with selected images
- `existingImages`: Array of existing image URLs

### Issue Components

#### IssueCard (`src/components/issue/IssueCard.jsx`)
- Issue preview card
- Status badge
- Image thumbnails
- Quick actions (flag, status update)
- Click to view details

**Props**:
- `report`: Issue/report object
- `onUpdate`: Callback for updates

#### FlagModal (`src/components/issue/FlagModal.jsx`)
- Modal for flagging issues
- Flag type selection
- Comment input
- Existing flag update

---

## Pages

### Authentication Pages

#### Login (`src/pages/auth/Login.jsx`)
- Email/password authentication
- Role selection (Citizen, Authority, Admin)
- Form validation
- Error handling
- Redirect after successful login

#### Register (`src/pages/auth/Register.jsx`)
- New user registration
- Form validation
- Role assignment
- Auto-login after registration

### Citizen Pages

#### Citizen Dashboard (`src/pages/citizen/Dashboard.jsx`)
- Overview of citizen-specific features
- Quick actions
- Recent reports

#### Report Issue (`src/pages/citizen/ReportIssue.jsx`)
- Issue creation form
- Image upload
- Location selection
- Category selection
- Form validation

#### My Reports (`src/pages/citizen/MyReports.jsx`)
- List of user's reported issues
- Status tracking
- Filter and search

### Authority Pages

#### Authority Dashboard (`src/pages/authority/Dashboard.jsx`)
- Overview of assigned issues
- Statistics
- Quick actions

#### Assigned Issues (`src/pages/authority/AssignedIssues.jsx`)
- List of issues assigned to authority
- Status update functionality
- Filter and search

### Admin Pages

#### Admin Dashboard (`src/pages/admin/Dashboard.jsx`)
- System overview
- Statistics and metrics
- Quick access to management pages

#### User Management (`src/pages/admin/UserManagement.jsx`)
- List all users
- Create, update, delete users
- Role assignment
- User search and filter

#### Department Management (`src/pages/admin/DepartmentManagement.jsx`)
- CRUD operations for departments
- Department assignment

#### Authority Management (`src/pages/admin/AuthorityManagement.jsx`)
- Manage authority organizations
- Authority details

#### Authority User Management (`src/pages/admin/AuthorityUserManagement.jsx`)
- Manage users within authorities
- Authority-specific user operations

#### Category Management (`src/pages/admin/CategoryManagement.jsx`)
- Issue category CRUD
- Category organization

#### Flagged Reports (`src/pages/admin/FlaggedReports.jsx`)
- View all flagged issues
- Review flags
- Take action on flagged content

### Common Pages

#### Dashboard (`src/pages/Dashboard.jsx`)
- Role-based routing
- Redirects to appropriate dashboard

#### Issue List (`src/pages/IssueList.jsx`)
- Browse all issues
- Filter by status, category, search
- "Report Issue" button for citizens
- Issue cards grid

#### Issue Detail (`src/pages/IssueDetail.jsx`)
- Detailed issue view
- Image gallery
- Status history
- Comments/flags
- Authority actions
- Admin actions

#### Profile (`src/pages/Profile.jsx`)
- User profile information
- Password change
- Account settings

#### NotFound (`src/pages/NotFound.jsx`)
- 404 error page
- Navigation back to home

---

## Services

### API Service (`src/services/api.js`)

**Configuration**:
- Base URL from environment or fallback
- `withCredentials: true` for cookie-based auth
- 30-second timeout
- JSON content type

**Interceptors**:
- **Request**: Cache-busting headers for non-GET requests
- **Response**: 401 handling, automatic redirect

**Environment Variables**:
- `VITE_API_BASE_URL`: Backend API URL (required for production)

### Service Files

All services follow a consistent pattern:
- Import `api` from `api.js`
- Export object with service methods
- Return `response.data` from axios responses
- Error handling via interceptors

---

## Utilities

### Error Handler (`src/utils/errorHandler.js`)

**Function**: `handleApiError(error)`

Handles various error types:
- **400**: Bad Request - Validation errors
- **401**: Unauthorized - Session expired
- **403**: Forbidden - Permission denied
- **404**: Not Found
- **409**: Conflict - Duplicate data
- **422**: Unprocessable Entity - Validation errors
- **500-503**: Server errors
- **Network errors**: Connection issues

Returns user-friendly error messages.

### Logger (`src/utils/logger.js`)

**Functions**:
- `logger.log(...args)`: Info logging
- `logger.error(...args)`: Error logging
- `logger.warn(...args)`: Warning logging

Uses `console` methods with consistent formatting.

### Helpers (`src/utils/helpers.js`)

**Functions**:
- `formatDate(date)`: Format dates for display
- `truncateText(text, maxLength)`: Truncate long text
- Other utility functions

### Image Helper (`src/utils/imageHelper.js`)

**Functions**:
- `getImageUrl(url)`: Convert relative URLs to absolute
  - Handles absolute URLs (http://, https://)
  - Converts relative paths using API base URL
  - Fallback handling
- `handleImageError(event)`: Image load error handler

### Constants (`src/utils/constants.js`)

**Exports**:
- `ROLES`: User role constants
- `ISSUE_STATUS`: Issue status constants
- `STATUS_COLORS`: Tailwind CSS classes for status badges
- `STATUS_LABELS`: Human-readable status labels

### PWA Cache (`src/utils/pwaCache.js`)

**Functions**:
- `checkBackendVersion()`: Verify backend compatibility
- `setupServiceWorkerUpdateListener()`: Handle SW updates
- `forceServiceWorkerUpdate()`: Force update check

### Clear Cache (`src/utils/clearCache.js`)

Development utility for clearing service worker cache.

---

## Configuration

### Vite Configuration (`vite.config.js`)

**Plugins**:
- React plugin
- PWA plugin with:
  - Auto-update service worker
  - Manifest configuration
  - Workbox caching strategies
  - Runtime caching for API calls

**Server**:
- Port: 5173
- Proxy: `/api` → `http://localhost:8080` (development)

**PWA Features**:
- Service worker registration
- Offline support
- Asset caching
- API response caching (Network First strategy)

### Tailwind Configuration (`tailwind.config.js`)

- Custom theme configuration
- Utility classes
- Responsive breakpoints

### Environment Variables

**Required for Production**:
```env
VITE_API_BASE_URL=https://your-backend-api.com
```

**Development**:
- Defaults to `http://localhost:8080`
- Can be overridden with `.env` file

---

## Development Setup

### Prerequisites
- Node.js 20+ (recommended)
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd civictrack-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev`: Start development server (port 5173)
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Development Workflow

1. **Start Backend**: Ensure backend is running on `http://localhost:8080`
2. **Start Frontend**: Run `npm run dev`
3. **Access**: Open `http://localhost:5173`
4. **Hot Reload**: Changes automatically reload

### Environment Setup

Create `.env` file (optional for development):
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Vercel Deployment

1. Connect GitHub repository
2. Set environment variable: `VITE_API_BASE_URL`
3. Deploy automatically on push

### Docker Deployment

```bash
# Build image
docker build -t civictrack-frontend .

# Run container
docker run -p 8080:80 civictrack-frontend
```

**Dockerfile**:
- Multi-stage build
- Node.js builder stage
- Nginx runtime stage

### Environment Variables

**Required**:
- `VITE_API_BASE_URL`: Backend API URL

**Note**: Environment variables must be set at build time (Vite requirement)

---

## Troubleshooting

### Common Issues

#### 1. Images Not Loading in Production

**Problem**: Images fail to load due to CORS or URL issues

**Solution**:
- Check `imageHelper.js` is converting URLs correctly
- Verify backend CORS allows image requests
- Check image URLs in browser console

#### 2. Authentication Not Working

**Problem**: Login succeeds but session not maintained

**Solution**:
- Verify backend cookie settings (`SameSite=None; Secure` for cross-origin)
- Check `withCredentials: true` in API config
- Verify CORS allows credentials

#### 3. Report Issue Button Not Showing

**Problem**: Button missing for citizen users

**Solution**:
- Check browser console for role detection logs
- Verify user has `citizen` role
- Check `isCitizen` flag in AuthContext

#### 4. API Requests Failing

**Problem**: 401 errors or CORS issues

**Solution**:
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS configuration
- Verify cookies are being sent (check Network tab)

#### 5. Service Worker Issues

**Problem**: Old version cached, updates not showing

**Solution**:
- Clear browser cache
- Unregister service worker in DevTools
- Use `clearCache.js` utility in development

### Debugging Tips

1. **Check Browser Console**: Look for error messages and logs
2. **Network Tab**: Verify API requests and responses
3. **Application Tab**: Check cookies and localStorage
4. **Service Workers**: Check registration and updates
5. **Environment Variables**: Verify `VITE_API_BASE_URL` is set

### Logging

The app uses comprehensive logging:
- Check browser console for detailed logs
- Role detection logs show user role extraction
- API logs show request/response details
- Error logs show full error information

---

## Security Considerations

### Authentication
- HttpOnly cookies prevent XSS attacks
- Secure cookies (HTTPS only)
- SameSite cookie policy for CSRF protection

### API Security
- All API calls require authentication
- CORS properly configured
- Input validation on forms

### Best Practices
- Never expose tokens in client code
- Validate all user inputs
- Sanitize displayed content
- Use HTTPS in production

---

## Future Enhancements

### Potential Improvements
1. Real-time updates (WebSockets)
2. Push notifications
3. Advanced filtering and search
4. Export functionality
5. Analytics dashboard
6. Mobile app (React Native)
7. Multi-language support
8. Dark mode

---

## Contributing

### Code Style
- Follow ESLint rules
- Use functional components with hooks
- Follow React best practices
- Write descriptive commit messages

### Testing
- Test all user flows
- Verify role-based access
- Test image uploads
- Verify API integration

---

## License

[Add your license information here]

---

## Support

For issues or questions:
- Check troubleshooting section
- Review browser console logs
- Verify environment configuration
- Contact development team

---

**Last Updated**: January 2026  
**Version**: 0.0.0  
**Maintainer**: [Your Name/Team]

