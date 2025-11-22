# CivicTrack Frontend - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration Files](#configuration-files)
5. [Source Code Structure](#source-code-structure)
6. [Components Documentation](#components-documentation)
7. [Pages Documentation](#pages-documentation)
8. [Services Documentation](#services-documentation)
9. [Utilities Documentation](#utilities-documentation)
10. [Context Documentation](#context-documentation)
11. [Features & Functionality](#features--functionality)
12. [Development Guide](#development-guide)
13. [Deployment Guide](#deployment-guide)

---

## Project Overview

**CivicTrack** is a Progressive Web Application (PWA) built with React and Vite for tracking and managing civic issues in communities. The application supports three user roles:

- **Citizens**: Report issues and track their status
- **Authorities**: Manage assigned issues and update their status
- **Admins**: Manage users, authorities, departments, categories, and review flagged reports

### Key Features

- User authentication and authorization (role-based access control)
- Issue reporting with images and location
- Issue management and tracking
- Flagging system for inappropriate content
- Category management
- Authority-user linking
- Password change functionality
- Responsive mobile navigation
- PWA support with offline capabilities
- Automatic cache management

---

## Technology Stack

### Core Technologies

- **React 19.2.0**: UI library for building user interfaces
- **Vite 7.2.2**: Build tool and development server
- **React Router DOM 7.3.6**: Client-side routing
- **Axios 1.13.2**: HTTP client for API requests
- **Tailwind CSS 4.1.17**: Utility-first CSS framework

### PWA Support

- **vite-plugin-pwa 1.1.0**: PWA plugin for Vite
- **workbox-window 7.3.0**: Service worker management

### Development Tools

- **ESLint 9.39.1**: Code linting
- **PostCSS 8.5.6**: CSS processing
- **Autoprefixer 10.4.22**: CSS vendor prefixing

---

## Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── icons/                # PWA icons
│   ├── manifest.json         # PWA manifest file
│   └── vite.svg              # Favicon
├── src/                      # Source code
│   ├── assets/               # React assets
│   ├── components/           # Reusable components
│   │   ├── common/           # Common components
│   │   ├── forms/            # Form components
│   │   ├── issue/            # Issue-related components
│   │   └── layout/           # Layout components
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks (empty)
│   ├── pages/                # Page components
│   │   ├── admin/            # Admin pages
│   │   ├── auth/             # Authentication pages
│   │   ├── authority/        # Authority pages
│   │   ├── citizen/          # Citizen pages
│   │   └── ...               # Common pages
│   ├── services/             # API service layer
│   ├── types/                # TypeScript types (empty)
│   └── utils/                # Utility functions
├── dev-dist/                 # Development build output
├── dist/                     # Production build output
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # Project readme
```

---

## Configuration Files

### 1. `package.json`

**Purpose**: Defines project metadata, dependencies, and npm scripts.

**Key Fields**:
- `name`: "frontend"
- `version`: "0.0.0"
- `type`: "module" - Uses ES modules
- `scripts`: Development and build commands
- `dependencies`: Production dependencies
- `devDependencies`: Development-only dependencies

**Scripts**:
- `npm run dev`: Start development server (port 5173)
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

### 2. `vite.config.js`

**Purpose**: Configures Vite build tool, React plugin, PWA plugin, and development server.

**Key Configuration**:

```javascript
// React plugin - enables JSX and React Fast Refresh
react()

// PWA Plugin Configuration
VitePWA({
  registerType: 'autoUpdate',  // Automatically update service worker
  manifest: { ... },           // PWA manifest settings
  workbox: { ... },            // Service worker caching strategies
  devOptions: {
    enabled: true,             // Enable PWA in development
    type: 'module'             // Use module type service worker
  }
})

// Development Server
server: {
  port: 5173,                  // Development server port
  proxy: {
    '/api': {                  // Proxy API requests to backend
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

**Caching Strategies**:
- **API Calls**: NetworkFirst (5-minute cache, 10s timeout)
- **Images**: CacheFirst (30-day cache)
- **Fonts**: CacheFirst (1-year cache)

### 3. `index.html`

**Purpose**: HTML entry point for the application.

**Key Elements**:
- Viewport meta tag for responsive design
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- PWA manifest link
- Apple touch icon
- Root div for React app
- Script tag for main.jsx

### 4. `tailwind.config.js`

**Purpose**: Configures Tailwind CSS utility classes.

**Configuration**:
- Content paths: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Empty theme extension (uses defaults)
- No plugins

### 5. `postcss.config.js`

**Purpose**: Configures PostCSS for processing CSS.

**Plugins**:
- `@tailwindcss/postcss`: Processes Tailwind CSS
- `autoprefixer`: Adds vendor prefixes

---

## Source Code Structure

### Entry Point: `src/main.jsx`

**Purpose**: Application entry point that initializes React and registers service worker.

**Key Functionality**:

1. **Service Worker Registration**:
   - Registers PWA service worker using `virtual:pwa-register`
   - Handles update notifications
   - Sets up periodic update checks (every 5 minutes)
   - Handles offline ready state

2. **PWA Cache Management**:
   - Checks backend version on startup
   - Sets up service worker update listeners
   - Forces service worker update check on startup

3. **React Initialization**:
   - Creates React root
   - Renders App component in StrictMode

**Code Flow**:
```javascript
// 1. Import dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

// 2. Register service worker if supported
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({ ... })
  setupServiceWorkerUpdateListener()
  forceServiceWorkerUpdate()
}

// 3. Check backend version
checkBackendVersion()

// 4. Initialize React app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### Main App: `src/App.jsx`

**Purpose**: Main application component that sets up routing, authentication context, and layout.

**Structure**:

1. **AuthProvider**: Wraps entire app to provide authentication context
2. **BrowserRouter**: Enables client-side routing
3. **Layout Structure**:
   - Header (navigation)
   - Main content area
   - Footer

4. **Routing**:
   - Public routes: `/login`, `/register`
   - Protected routes: All other routes
   - Role-based routes: Different pages for citizen/authority/admin
   - Common routes: `/issues`, `/issues/:id`, `/profile`

**HomePage Component**:
- Shows different content based on user role
- Authority users → AssignedIssues
- Others → IssueList

**Route Protection**:
All routes except `/login` and `/register` are wrapped in `ProtectedRoute` component that:
- Checks authentication status
- Validates role permissions (if `requiredRole` prop is set)
- Redirects to login if not authenticated

---

## Components Documentation

### Layout Components

#### 1. `src/components/layout/Header.jsx`

**Purpose**: Main navigation header with responsive mobile menu.

**Features**:
- **Desktop View**:
  - Logo on left
  - Navigation links in center (role-based)
  - User menu on right (Profile, Name, Logout)
  
- **Mobile View**:
  - Logo on left
  - Hamburger menu button on right
  - Dropdown menu with all navigation links

**State Management**:
- `mobileMenuOpen`: Boolean state for mobile menu visibility

**Role-Based Navigation**:
- **Citizen**: Home, Report Issue, My Reports
- **Authority**: Home, Assigned Issues
- **Admin**: Home, Users, Departments, Authorities, Categories, Flagged Reports

**Functions**:
- `handleLogout()`: Logs out user and navigates to login
- `handleLinkClick()`: Closes mobile menu when link is clicked

**Responsive Classes**:
- `hidden md:flex`: Hide on mobile, show on desktop
- `md:hidden`: Show on mobile, hide on desktop
- `sticky top-0 z-50`: Sticky header with high z-index

#### 2. `src/components/layout/Footer.jsx`

**Purpose**: Footer component with copyright information.

**Structure**:
- Centered copyright text
- Dynamic year using `new Date().getFullYear()`
- Gray background (`bg-gray-800`)
- White text

### Common Components

#### 1. `src/components/common/ProtectedRoute.jsx`

**Purpose**: Route guard that protects routes from unauthorized access.

**Functionality**:
- Wraps child components
- Checks authentication status using `useAuth()`
- Validates role if `requiredRole` prop is provided
- Shows loading state while checking auth
- Redirects to login if not authenticated
- Shows "Access Denied" if role doesn't match

**Props**:
- `children`: React node to render if authenticated
- `requiredRole`: Optional role requirement ('admin', 'authority', 'citizen')

**Code Flow**:
```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, role } = useAuth()
  
  if (loading) return <Loading />
  if (!isAuthenticated) return <Navigate to="/login" />
  if (requiredRole && role !== requiredRole) return <AccessDenied />
  
  return children
}
```

#### 2. `src/components/common/StatusBadge.jsx`

**Purpose**: Displays issue status with color-coded badges.

**Status Colors**:
- `reported`: Blue
- `in_progress`: Yellow/Orange
- `resolved`: Green
- `rejected`: Red

**Implementation**:
Uses Tailwind CSS classes with conditional styling based on status prop.

### Form Components

#### 1. `src/components/forms/ImageUpload.jsx`

**Purpose**: Handles image upload with validation.

**Features**:
- Multiple image upload (configurable max)
- File size validation (configurable max MB)
- Image preview
- Drag and drop support
- File type validation (images only)

**Props**:
- `maxImages`: Maximum number of images
- `maxSizeMB`: Maximum file size in MB
- `onUpload`: Callback function with selected files

**Validation**:
- Checks file type (images only)
- Validates file size
- Limits number of files
- Shows error messages

### Issue Components

#### 1. `src/components/issue/IssueCard.jsx`

**Purpose**: Displays issue information in a card format.

**Features**:
- Clickable card (navigates to issue detail)
- Status badge
- Truncated description
- Category tag
- Image preview (first 3 images)
- Location display
- Reporter information
- Created date
- Status update dropdown (for authority/admin)
- Flag button (for citizens)

**Props**:
- `report`: Issue/report object
- `onUpdate`: Callback to refresh data after changes

**Interaction**:
- Card click: Navigate to `/issues/:id`
- Status change: Updates issue status (authority/admin only)
- Flag click: Opens flag modal (citizens only)
- `stopPropagation()`: Prevents card navigation when clicking interactive elements

#### 2. `src/components/issue/FlagModal.jsx`

**Purpose**: Modal dialog for flagging issues with reason selection.

**Features**:
- Fetches flag types from API
- Dropdown selection for flag type
- Handles existing flags (update mode)
- Backdrop click to close
- Prevents event propagation

**Props**:
- `isOpen`: Boolean for modal visibility
- `onClose`: Close callback
- `onConfirm`: Confirm callback with selected flag ID
- `reportId`: Issue ID being flagged
- `existingFlag`: Optional existing flag object

**State Management**:
- `flags`: Array of available flag types
- `selectedFlagId`: Currently selected flag ID
- `loading`: Loading state
- `error`: Error message

---

## Pages Documentation

### Authentication Pages

#### 1. `src/pages/auth/Login.jsx`

**Purpose**: User login page.

**Features**:
- Email and password fields
- Role selection dropdown
- Client-side validation
- Error display
- Loading state
- Link to register page

**Validation**:
- Email format validation
- Required field checks
- Error messages using `handleApiError()`

**Submit Flow**:
1. Validate inputs
2. Call `login()` from AuthContext
3. Navigate to home page on success
4. Display error on failure

#### 2. `src/pages/auth/Register.jsx`

**Purpose**: User registration page.

**Features**:
- Name, email, password, confirm password fields
- Client-side validation
- Password strength requirements
- Password match validation
- Link to login page

**Validation**:
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 8 characters
- Confirm password: must match password

### Citizen Pages

#### 1. `src/pages/citizen/Dashboard.jsx`

**Purpose**: Citizen dashboard with quick actions.

**Features**:
- Welcome message with user name
- Action cards:
  - Report New Issue
  - My Reports
  - All Issues

**Layout**:
- Responsive grid (1 column mobile, 2 columns desktop)
- Colored action cards with hover effects

#### 2. `src/pages/citizen/ReportIssue.jsx`

**Purpose**: Form for reporting new civic issues.

**Fields**:
- Title (required, min 5 chars)
- Description (required, min 10 chars)
- Category/Issue Type (required, dropdown)
- City (required)
- Region/Zone (required)
- Latitude (optional)
- Longitude (optional)
- Images (optional, max 5, 5MB each)

**Validation**:
- Client-side validation with clear error messages
- Required field indicators (red asterisks)
- Character length validation

**Submit Flow**:
1. Validate all fields
2. Create FormData with issue data and images
3. Call `issueService.createReport()`
4. Navigate to My Reports with success message
5. Show authority assignment status in message

**Success Message**:
- If authority auto-assigned: Shows authority name
- If no authority: Indicates admin will assign

#### 3. `src/pages/citizen/MyReports.jsx`

**Purpose**: Display all reports created by the logged-in citizen.

**Features**:
- Filter by status
- Success message from ReportIssue (if navigated from there)
- Empty state with "Report Issue" button
- Issue cards grid (responsive)
- Status filter dropdown

**Data Flow**:
1. Fetch all reports using `issueService.listReports()`
2. Filter reports where `reporter_id === user.id`
3. Apply status filter if selected
4. Display filtered reports

**Navigation State**:
- Reads success message from `location.state`
- Auto-hides message after 5 seconds
- Manual close button

### Authority Pages

#### 1. `src/pages/authority/Dashboard.jsx`

**Purpose**: Authority dashboard with statistics.

**Features**:
- Welcome message
- Statistics cards:
  - Assigned Issues (total)
  - Reported
  - In Progress
  - Resolved
- Loading state for statistics

**Data**:
- Fetches assigned issues using `issueService.listAssignedIssues()`
- Calculates statistics from issues

#### 2. `src/pages/authority/AssignedIssues.jsx`

**Purpose**: List of issues assigned to the authority user.

**Features**:
- Similar to IssueList but shows only assigned issues
- Filter by status
- Search functionality
- Category filter
- Status update capability

**Data**:
- Uses `issueService.listAssignedIssues()`
- Filters by status/category/search query
- Shows empty state if no assigned issues

### Admin Pages

#### 1. `src/pages/admin/Dashboard.jsx`

**Purpose**: Admin dashboard with overview statistics.

**Features**:
- Welcome message
- Statistics cards (if implemented)
- Quick links to management pages

#### 2. `src/pages/admin/UserManagement.jsx`

**Purpose**: Manage users, assign roles, and change passwords.

**Features**:
- List all users
- Create new users
- Edit user information
- Assign/remove roles
- Link authority users to authorities
- Change user passwords (admin override)
- Delete users

**User Modal**:
- Name field
- Email field
- Password field (only for new users)
- Role checkboxes (admin, authority, citizen)
- Authority dropdown (shown when authority role selected)

**Password Change Modal**:
- New password field
- Confirm password field
- Validation (min 8 chars, uppercase, lowercase, number)
- Confirmation dialog

**Authority Linking**:
- When authority role selected, show authority dropdown
- Create/update/delete authority-user links
- Display linked authority in user list

#### 3. `src/pages/admin/CategoryManagement.jsx`

**Purpose**: Manage issue categories.

**Features**:
- List all categories
- Create new categories
- Edit categories
- Delete categories
- Auto-generate slugs from names
- Manual slug editing

**Category Form**:
- Name (required, min 2 chars)
- Slug (auto-generated, editable)
- Description (optional)

**Slug Generation**:
- Converts name to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Updates in real-time as name is typed

#### 4. `src/pages/admin/AuthorityManagement.jsx`

**Purpose**: Manage authorities (departments/agencies).

**Features**:
- List all authorities
- Create new authorities
- Edit authorities
- Delete authorities
- Manage issue categories assigned to authorities

**Authority Form**:
- Name (required)
- City (required)
- Region (required)
- Department (optional dropdown)
- Address (optional)

**Issue Category Management**:
- "Manage Issues" button for each authority
- Modal with checkboxes for all issue categories
- Save selected categories
- Uses `adminService.updateAuthorityIssues()`

#### 5. `src/pages/admin/DepartmentManagement.jsx`

**Purpose**: Manage departments.

**Features**:
- List all departments
- Create new departments
- Edit departments
- Delete departments

**Department Form**:
- Name (required, min 2 chars)
- Description (optional)

#### 6. `src/pages/admin/FlaggedReports.jsx`

**Purpose**: Review reports that have been flagged by users.

**Features**:
- List all flagged reports
- Show flag count per report
- Flag details (type, user, timestamp)
- Hide report functionality (admin only)
- Delete individual flags
- Navigate to issue detail

**Flag Details Display**:
- Flag type name
- User who flagged
- Timestamp
- Flag count by type

### Common Pages

#### 1. `src/pages/Dashboard.jsx`

**Purpose**: Root dashboard that redirects based on user role.

**Logic**:
- Admin → `/admin/dashboard`
- Authority → `/authority/dashboard`
- Citizen → `/citizen/dashboard`
- No role → Shows "No Role Assigned" message

#### 2. `src/pages/IssueList.jsx`

**Purpose**: Display all issues with filtering and search.

**Features**:
- Search by title, description, city, region
- Filter by status
- Filter by category
- Statistics cards (Total, Reported, In Progress, Resolved)
- Responsive grid layout
- Empty state

**Filters**:
- Search input: Filters by multiple fields
- Status dropdown: All, Reported, In Progress, Resolved, Rejected
- Category dropdown: All categories + "All Categories"

**Statistics**:
Calculated from `allReports` array:
- Total: `allReports.length`
- Reported: Count with status 'reported'
- In Progress: Count with status 'in_progress'
- Resolved: Count with status 'resolved'

**Responsive Design**:
- Heading: `text-2xl sm:text-3xl md:text-4xl`
- Statistics grid: `grid-cols-1 md:grid-cols-4`
- Filters: `grid-cols-1 md:grid-cols-3`
- Issue cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

#### 3. `src/pages/IssueDetail.jsx`

**Purpose**: Detailed view of a single issue.

**Features**:
- Full issue information
- Image gallery
- Status update (authority/admin)
- Flag issue (citizens)
- Flag details section (all users)
- Delete individual flags (admin)
- Comments/updates timeline (if implemented)

**URL Parameter**:
- `/issues/:id` - ID from URL params using `useParams()`

**Data Fetching**:
- Uses `issueService.getReport(id)` to fetch issue details
- Includes flags, images, reporter, authority information

**Flag Functionality**:
- Citizens: Flag/Update flag button
- All users: View flag details section
- Admin: Delete individual flags

#### 4. `src/pages/Profile.jsx`

**Purpose**: User profile and password change.

**Features**:
- Display user information (name, email, roles)
- Change password form
- Password strength indicator
- Password validation

**Password Change Form**:
- Current password (required)
- New password (required, validated)
- Confirm password (required, must match)

**Password Validation**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters optional but recommended

**Password Strength Indicator**:
- 5 levels: Very Weak, Weak, Fair, Good, Strong, Very Strong
- Visual progress bar
- Color-coded (red → orange → yellow → green)

**Security**:
- Auto-logout after password change (2 seconds delay)
- Forces re-login with new password

#### 5. `src/pages/NotFound.jsx`

**Purpose**: 404 error page.

**Features**:
- Simple "Page Not Found" message
- Link back to home page

---

## Services Documentation

### 1. `src/services/api.js`

**Purpose**: Axios instance configuration and interceptors.

**Base URL Configuration**:
```javascript
getBaseURL() {
  // 1. Check environment variable VITE_API_BASE_URL
  // 2. If development, use http://localhost:8080
  // 3. If production, use HTTPS with current hostname
}
```

**Axios Instance**:
- `baseURL`: Dynamic based on environment
- `withCredentials: true`: Include cookies for authentication
- `timeout: 30000`: 30-second timeout
- `headers`: Content-Type: application/json

**Request Interceptor**:
- Adds cache-busting headers for non-GET requests:
  - `Cache-Control: no-cache, no-store, must-revalidate`
  - `Pragma: no-cache`
  - `Expires: 0`

**Response Interceptor**:
- Handles 401 (Unauthorized) errors
- Redirects to `/login` if not already there
- Passes through all other responses

### 2. `src/services/auth.service.js`

**Purpose**: Authentication-related API calls.

**Methods**:

1. **`register(data)`**:
   - POST `/api/auth/register`
   - Data: `{ name, email, password }`
   - Returns user data

2. **`login(email, password, role)`**:
   - POST `/api/auth/login`
   - Data: `{ email, password, role }`
   - Returns authentication response

3. **`logout()`**:
   - POST `/api/auth/logout`
   - Clears authentication

4. **`getCurrentUser()`**:
   - GET `/api/auth/me`
   - Returns current user data

5. **`changePassword(oldPassword, newPassword, confirmPassword)`**:
   - PATCH `/api/auth/change-password`
   - Changes user's own password

### 3. `src/services/issue.service.js`

**Purpose**: Issue/report-related API calls.

**Methods**:

1. **`listReports()`**:
   - GET `/api/issues/reports`
   - Returns all reports

2. **`getReport(id)`**:
   - GET `/api/issues/reports/:id`
   - Returns single report details

3. **`createReport(formData)`**:
   - POST `/api/issues/reports`
   - FormData with issue data and images
   - Returns created report

4. **`updateStatus(id, data)`**:
   - PATCH `/api/issues/reports/:id/status`
   - Updates issue status

5. **`listCategories()`**:
   - GET `/api/issues/categories`
   - Returns all categories

6. **`listFlaggedReports()`**:
   - GET `/api/issues/flagged`
   - Returns flagged reports

7. **`flagReport(id, flagId)`**:
   - POST `/api/issues/reports/:id/flag`
   - Flags a report

8. **`deleteFlag(flagId, reportId)`**:
   - DELETE `/api/issues/flags/:flagId`
   - Deletes a flag

9. **`listAssignedIssues()`**:
   - GET `/api/issues/assigned`
   - Returns issues assigned to current authority user

10. **`listFlags(reportId)`**:
    - GET `/api/issues/reports/:id/flags`
    - Returns flags for a report

### 4. `src/services/admin.service.js`

**Purpose**: Admin-only API calls.

**Methods**:

1. **User Management**:
   - `listUsers()`: GET `/api/admin/users`
   - `createUser(data)`: POST `/api/admin/users`
   - `updateUser(userId, data)`: PATCH `/api/admin/users/:userId`
   - `updateUserRoles(userId, roleIds)`: PATCH `/api/admin/users/:userId/roles`
   - `deleteUser(userId)`: DELETE `/api/admin/users/:userId`
   - `changeUserPassword(userId, newPassword, confirmPassword)`: PATCH `/api/admin/users/:userId/password`

2. **Department Management**:
   - `listDepartments()`: GET `/api/admin/departments`
   - `createDepartment(data)`: POST `/api/admin/departments`
   - `updateDepartment(id, data)`: PATCH `/api/admin/departments/:id`
   - `deleteDepartment(id)`: DELETE `/api/admin/departments/:id`

3. **Authority Management**:
   - `listAuthorities()`: GET `/api/admin/authorities`
   - `createAuthority(data)`: POST `/api/admin/authorities`
   - `updateAuthority(id, data)`: PATCH `/api/admin/authorities/:id`
   - `deleteAuthority(id)`: DELETE `/api/admin/authorities/:id`
   - `getAuthorityIssues(authorityId)`: GET `/api/admin/authorities/:id/issues`
   - `updateAuthorityIssues(authorityId, issueIds)`: PATCH `/api/admin/authorities/:id/issues`

4. **Authority-User Linking**:
   - `listAuthorityUsers()`: GET `/api/admin/authority-users`
   - `createAuthorityUser(data)`: POST `/api/admin/authority-users`
   - `updateAuthorityUser(id, data)`: PATCH `/api/admin/authority-users/:id`
   - `deleteAuthorityUser(id)`: DELETE `/api/admin/authority-users/:id`

---

## Utilities Documentation

### 1. `src/utils/logger.js`

**Purpose**: Production-safe logging utility.

**Why**: Replaces `console.log` to:
- Disable logging in production
- Centralize log management
- Provide consistent logging interface

**Methods**:
- `logger.log(...args)`: Info logs (development only)
- `logger.warn(...args)`: Warnings (development only)
- `logger.error(...args)`: Errors (always logged)

**Implementation**:
- Checks `import.meta.env.PROD`
- Uses console methods in development
- No-op in production

### 2. `src/utils/errorHandler.js`

**Purpose**: Standardizes API error messages.

**Function**: `handleApiError(error)`

**Error Handling**:
- Parses error response structure
- Extracts error messages
- Transforms technical messages to user-friendly
- Handles different HTTP status codes:
  - 400/422: Validation errors
  - 401: Authentication errors (redirects to login)
  - 403: Permission denied
  - 404: Resource not found
  - 409: Conflict/duplicate
  - 500+: Server errors

**Message Transformations**:
- "email must be a valid email" → "Please enter a valid email address (e.g., name@example.com)."
- "password length must be at least 8 characters" → "Password must be at least 8 characters long for security."
- "email already exists" → "This email address is already registered. Please use a different email or sign in."

### 3. `src/utils/helpers.js`

**Purpose**: Common utility functions.

**Functions**:

1. **`formatDate(dateString)`**:
   - Formats date string to readable format
   - Uses `Intl.DateTimeFormat` or fallback

2. **`truncateText(text, maxLength)`**:
   - Truncates text to max length
   - Adds ellipsis if truncated

### 4. `src/utils/pwaCache.js`

**Purpose**: PWA cache management utilities.

**Functions**:

1. **`getCacheVersion()`**: Get stored cache version
2. **`setCacheVersion(version)`**: Store cache version
3. **`getBackendVersion()`**: Get stored backend version
4. **`setBackendVersion(version)`**: Store backend version
5. **`checkBackendVersion()`**: Check backend version endpoint and clear cache if updated
6. **`clearAllCaches()`**: Clear all service worker caches
7. **`forceServiceWorkerUpdate()`**: Force service worker update check
8. **`setupServiceWorkerUpdateListener()`**: Set up update event listeners
9. **`startUpdateChecker(intervalMinutes)`**: Start periodic update checking

**Backend Version Checking**:
- Calls `/api/version` endpoint
- Compares with stored version
- Clears caches if version changed
- Prompts user to reload

### 5. `src/utils/clearCache.js`

**Purpose**: Development utilities for manually clearing caches.

**Functions**:

1. **`clearAllCaches()`**: Clear all caches, service workers, and localStorage
2. **`clearApiCaches()`**: Clear only API caches
3. **`clearCacheAndReload()`**: Clear caches and reload page

**Development Mode**:
- Exposes functions to `window` object in development
- Available in browser console:
  - `window.clearPWACache()`
  - `window.clearApiCache()`
  - `window.clearCacheAndReload()`

---

## Context Documentation

### `src/context/AuthContext.jsx`

**Purpose**: React Context for authentication state management.

**State**:
- `user`: Current user object (null if not logged in)
- `loading`: Boolean indicating auth check in progress

**Methods**:

1. **`checkAuth()`**:
   - Called on mount
   - Fetches current user from `/api/auth/me`
   - Sets user state or null

2. **`login(email, password, role)`**:
   - Calls auth service login
   - Refreshes auth state after login
   - Returns response or throws error

3. **`register(data)`**:
   - Calls auth service register
   - Refreshes auth state after registration
   - Returns response or throws error

4. **`logout()`**:
   - Calls auth service logout
   - Clears user state

5. **`getUserRole()`**:
   - Extracts role from user object
   - Handles different role structures
   - Returns role name string or null

**Computed Values**:
- `isAuthenticated`: Boolean (!!user)
- `isAdmin`: Boolean (role === 'admin')
- `isAuthority`: Boolean (role === 'authority')
- `isCitizen`: Boolean (role === 'citizen')
- `role`: Role name string or null

**Provider**:
- Wraps entire app in `App.jsx`
- Provides auth state to all children

**Hook**:
- `useAuth()`: Custom hook to access auth context
- Throws error if used outside AuthProvider

---

## Features & Functionality

### Authentication & Authorization

1. **User Registration**:
   - Name, email, password required
   - Client-side validation
   - Automatic login after registration

2. **User Login**:
   - Email, password, role selection
   - Cookie-based authentication
   - Role-based redirects

3. **Password Change**:
   - User self-service: Requires old password
   - Admin override: No old password required
   - Auto-logout after password change

4. **Role-Based Access Control**:
   - Three roles: Citizen, Authority, Admin
   - Route protection based on role
   - UI elements shown/hidden based on role

### Issue Management

1. **Issue Reporting**:
   - Required fields: Title, Description, Category, City, Region
   - Optional: Latitude, Longitude, Images
   - Automatic authority assignment based on category, city, region

2. **Issue Viewing**:
   - List all issues with filtering
   - Search functionality
   - Category and status filters
   - Issue detail page

3. **Issue Status Updates**:
   - Authority and Admin can update status
   - Statuses: Reported, In Progress, Resolved, Rejected

4. **Issue Filtering**:
   - Filter by status
   - Filter by category
   - Search by title, description, city, region

### Flagging System

1. **Flag Reports**:
   - Citizens can flag inappropriate reports
   - Select flag type/reason
   - One flag per user per report (updates existing)

2. **Flag Management**:
   - Admin can view all flagged reports
   - Admin can delete individual flags
   - Admin can hide reports

3. **Flag Display**:
   - Flag count per report
   - Flag details (type, user, timestamp)
   - Visible to all users on issue detail page

### Category Management

1. **Category CRUD**:
   - Create, Read, Update, Delete categories
   - Auto-generate URL-friendly slugs
   - Manual slug editing

2. **Category Assignment**:
   - Admin assigns categories to authorities
   - Authorities can only handle assigned categories

### Authority Management

1. **Authority CRUD**:
   - Create, Read, Update, Delete authorities
   - Link authorities to departments
   - Manage authority location (city, region)

2. **Authority-User Linking**:
   - One-to-one relationship
   - Admin links authority users to authorities
   - Authority users see only assigned issues

3. **Authority-Issue Linking**:
   - Many-to-many relationship
   - Authorities handle multiple issue categories
   - Automatic assignment based on matching criteria

### PWA Features

1. **Service Worker**:
   - Automatic registration
   - Update notifications
   - Offline support

2. **Caching Strategies**:
   - NetworkFirst for API calls (5-minute cache)
   - CacheFirst for static assets (images, fonts)

3. **Cache Management**:
   - Backend version checking
   - Automatic cache clearing on updates
   - Manual cache clearing utilities

### Responsive Design

1. **Mobile Navigation**:
   - Hamburger menu on mobile
   - Full navigation on desktop
   - Sticky header

2. **Responsive Layouts**:
   - Mobile-first design
   - Breakpoints: sm (640px), md (768px), lg (1024px)
   - Responsive grids and typography

---

## Development Guide

### Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create `.env` file (optional):
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:5173`
   - API requests proxied to `http://localhost:8080`

### Code Style

1. **ESLint**:
   - Run: `npm run lint`
   - Uses React hooks rules
   - React refresh rules

2. **File Naming**:
   - Components: PascalCase (e.g., `Header.jsx`)
   - Utilities: camelCase (e.g., `errorHandler.js`)
   - Pages: PascalCase (e.g., `Login.jsx`)

3. **Import Order**:
   - React imports first
   - Third-party libraries
   - Local components/services/utils
   - CSS imports last

### Adding New Features

1. **New Page**:
   - Create file in `src/pages/`
   - Add route in `src/App.jsx`
   - Add navigation link in `Header.jsx` if needed

2. **New Component**:
   - Create file in appropriate `src/components/` subdirectory
   - Export default component
   - Import and use in pages/components

3. **New Service**:
   - Create file in `src/services/`
   - Use `api` instance from `api.js`
   - Export service object with methods

### Testing

1. **Manual Testing**:
   - Test all user flows
   - Test on different screen sizes
   - Test PWA offline functionality

2. **Browser DevTools**:
   - Use Console for debugging
   - Use Network tab for API debugging
   - Use Application tab for PWA debugging

---

## Deployment Guide

### Build for Production

1. **Build Command**:
   ```bash
   npm run build
   ```
   - Output: `dist/` directory
   - Includes optimized assets
   - Service worker files

2. **Preview Build**:
   ```bash
   npm run preview
   ```
   - Preview production build locally

### Production Configuration

1. **Environment Variables**:
   - Set `VITE_API_BASE_URL` to production API URL
   - Use HTTPS in production

2. **Server Configuration**:
   - Serve `dist/` directory
   - Configure proper MIME types
   - Enable HTTPS

3. **PWA Requirements**:
   - HTTPS required for service worker
   - Valid manifest.json
   - Service worker file accessible

### Deployment Options

1. **Static Hosting**:
   - Netlify, Vercel, GitHub Pages
   - Upload `dist/` directory

2. **CDN**:
   - Cloudflare, AWS CloudFront
   - Serve static files with caching

3. **Server**:
   - Nginx, Apache
   - Configure proxy for `/api` requests

---

## API Integration

### Backend Endpoints

The frontend expects the following API endpoints:

**Authentication**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password`

**Issues**:
- `GET /api/issues/reports`
- `GET /api/issues/reports/:id`
- `POST /api/issues/reports`
- `PATCH /api/issues/reports/:id/status`
- `GET /api/issues/categories`
- `GET /api/issues/flagged`
- `GET /api/issues/assigned`
- `POST /api/issues/reports/:id/flag`
- `DELETE /api/issues/flags/:flagId`

**Admin**:
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:userId`
- `PATCH /api/admin/users/:userId/roles`
- `PATCH /api/admin/users/:userId/password`
- `DELETE /api/admin/users/:userId`
- Similar endpoints for departments, authorities, categories

### Authentication

- Uses cookie-based authentication
- `withCredentials: true` in Axios config
- Automatic token refresh (if implemented)

### Error Handling

- All errors go through `errorHandler.js`
- User-friendly error messages
- Automatic redirect on 401 errors

---

## Security Considerations

1. **XSS Protection**:
   - React escapes content by default
   - Validate user inputs
   - Sanitize user-generated content

2. **CSRF Protection**:
   - Cookie-based auth (requires CSRF tokens on backend)
   - SameSite cookie attribute

3. **Content Security Policy**:
   - Meta tags in index.html
   - Additional headers via server

4. **Input Validation**:
   - Client-side validation for UX
   - Server-side validation required for security

5. **Password Security**:
   - Minimum 8 characters
   - Complexity requirements
   - Secure transmission (HTTPS)

---

## Performance Optimization

1. **Code Splitting**:
   - Route-based code splitting (if implemented)
   - Lazy loading for heavy components

2. **Image Optimization**:
   - Use appropriate image formats
   - Lazy loading images
   - Responsive images

3. **Caching**:
   - Service worker caching
   - API response caching
   - Static asset caching

4. **Bundle Size**:
   - Tree shaking
   - Minification
   - Gzip compression

---

## Troubleshooting

### Common Issues

1. **Service Worker Not Updating**:
   - Clear browser cache
   - Unregister service worker in DevTools
   - Hard refresh (Ctrl+Shift+R)

2. **API Requests Failing**:
   - Check backend is running
   - Verify API base URL
   - Check CORS settings

3. **Authentication Issues**:
   - Check cookies are enabled
   - Verify session is valid
   - Clear localStorage/sessionStorage

4. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all dependencies are installed

---

## Additional Resources

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Tailwind CSS Documentation**: https://tailwindcss.com
- **React Router Documentation**: https://reactrouter.com
- **Axios Documentation**: https://axios-http.com

---

## Changelog

### Version 0.0.0 (Current)

**Features**:
- User authentication and authorization
- Issue reporting and management
- Flagging system
- Category management
- Authority management
- Password change functionality
- Responsive mobile navigation
- PWA support with offline capabilities
- Automatic cache management

**Improvements**:
- Mobile-responsive design
- Better error handling
- Improved user feedback
- Security enhancements
- Performance optimizations

---

**Last Updated**: 2025-11-22  
**Project**: CivicTrack Frontend  
**Version**: 0.0.0

