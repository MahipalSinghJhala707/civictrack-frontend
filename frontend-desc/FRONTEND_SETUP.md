# CivicTrack Frontend Setup Guide

## Tech Stack
- **Framework:** React 18+
- **Build Tool:** Vite
- **PWA:** Progressive Web App support
- **Language:** TypeScript (recommended) or JavaScript

---

## Quick Start

### 1. Create React + Vite App

```bash
# Using npm
npm create vite@latest civictrack-frontend -- --template react

# Or using yarn
yarn create vite civictrack-frontend --template react

# Or using pnpm
pnpm create vite civictrack-frontend --template react
```

### 2. Install Dependencies

```bash
cd civictrack-frontend
npm install

# Additional dependencies for API calls and PWA
npm install axios
npm install react-router-dom
npm install @vite-pwa/vite-plugin workbox-window
```

### 3. Install PWA Plugin

```bash
npm install -D vite-plugin-pwa
```

---

## Project Structure

```
civictrack-frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icons/                 # PWA icons
│   └── ...
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/           # Common UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── pages/                # Page components
│   │   ├── auth/             # Authentication pages
│   │   ├── admin/            # Admin pages
│   │   ├── citizen/          # Citizen pages
│   │   └── authority/        # Authority pages
│   ├── services/             # API services
│   │   ├── api.js            # Axios instance
│   │   ├── auth.service.js   # Auth API calls
│   │   ├── admin.service.js  # Admin API calls
│   │   └── issue.service.js  # Issue API calls
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Authentication hook
│   │   └── useApi.js         # API call hook
│   ├── context/              # React Context
│   │   └── AuthContext.jsx   # Auth context provider
│   ├── utils/                # Utility functions
│   │   ├── constants.js      # App constants
│   │   └── helpers.js        # Helper functions
│   ├── types/                # TypeScript types (if using TS)
│   │   └── index.ts
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── vite.config.js            # Vite configuration
└── package.json
```

---

## Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'CivicTrack',
        short_name: 'CivicTrack',
        description: 'Civic issue tracking and reporting platform',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

---

## Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CivicTrack
```

Access in code: `import.meta.env.VITE_API_BASE_URL`

---

## API Service Setup

### src/services/api.js

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Authentication Service

### src/services/auth.service.js

```javascript
import api from './api';

export const authService = {
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  login: async (email, password, role) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
      role,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};
```

---

## TypeScript Types (if using TypeScript)

### src/types/index.ts

```typescript
// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: 'admin' | 'authority' | 'citizen';
  description?: string;
  is_active?: boolean;
}

// Issue Types
export interface IssueCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export interface IssueReport {
  id: number;
  title: string;
  description: string;
  status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
  issue_id: number;
  reporter_id: number;
  authority_id?: number;
  latitude?: number;
  longitude?: number;
  region?: string;
  is_hidden: boolean;
  issue?: IssueCategory;
  reporter?: User;
  authority?: Authority;
  images?: IssueImage[];
  flags?: UserIssueFlag[];
  logs?: Log[];
  created_at: string;
  updated_at: string;
}

export interface IssueImage {
  id: number;
  report_id: number;
  url: string;
}

// Admin Types
export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Authority {
  id: number;
  name: string;
  city: string;
  region: string;
  department_id?: number;
  address?: string;
  department?: Department;
}

export interface AuthorityUser {
  id: number;
  authority_id: number;
  user_id: number;
  authority?: Authority;
  user?: User;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: string[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface CreateReportForm {
  title: string;
  description: string;
  issueId: number;
  authorityId?: number;
  latitude?: number;
  longitude?: number;
  region?: string;
  images?: File[];
  imageUrls?: string[];
}
```

---

## Authentication Context

### src/context/AuthContext.jsx

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    const response = await authService.login(email, password, role);
    await checkAuth();
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAuthority: user?.role === 'authority',
    isCitizen: user?.role === 'citizen',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## Routing Setup

### src/App.jsx

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssueReport from './pages/citizen/IssueReport';
import IssueList from './pages/IssueList';
import AuthorityDashboard from './pages/authority/AuthorityDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/authority/*"
        element={
          <ProtectedRoute requiredRole="authority">
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute requiredRole="citizen">
            <IssueReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/issues"
        element={
          <ProtectedRoute>
            <IssueList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## Service Examples

### src/services/admin.service.js

```javascript
import api from './api';

export const adminService = {
  // Users
  listUsers: () => api.get('/api/admin/users'),
  createUser: (data) => api.post('/api/admin/users', data),
  updateUser: (userId, data) => api.patch(`/api/admin/users/${userId}`, data),
  updateUserRoles: (userId, roleIds) =>
    api.patch(`/api/admin/users/${userId}/roles`, { roleIds }),
  deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),

  // Departments
  listDepartments: () => api.get('/api/admin/departments'),
  createDepartment: (data) => api.post('/api/admin/departments', data),
  updateDepartment: (departmentId, data) =>
    api.patch(`/api/admin/departments/${departmentId}`, data),
  deleteDepartment: (departmentId) =>
    api.delete(`/api/admin/departments/${departmentId}`),

  // Authorities
  listAuthorities: () => api.get('/api/admin/authorities'),
  createAuthority: (data) => api.post('/api/admin/authorities', data),
  updateAuthority: (authorityId, data) =>
    api.patch(`/api/admin/authorities/${authorityId}`, data),
  deleteAuthority: (authorityId) =>
    api.delete(`/api/admin/authorities/${authorityId}`),

  // Authority Users
  listAuthorityUsers: () => api.get('/api/admin/authority-users'),
  createAuthorityUser: (data) => api.post('/api/admin/authority-users', data),
  updateAuthorityUser: (authorityUserId, data) =>
    api.patch(`/api/admin/authority-users/${authorityUserId}`, data),
  deleteAuthorityUser: (authorityUserId) =>
    api.delete(`/api/admin/authority-users/${authorityUserId}`),
};
```

### src/services/issue.service.js

```javascript
import api from './api';

export const issueService = {
  listCategories: () => api.get('/api/issues/categories'),
  
  createReport: (formData) => {
    return api.post('/api/issues/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  listReports: (params = {}) => {
    return api.get('/api/issues/reports', { params });
  },
  
  updateStatus: (reportId, data) =>
    api.patch(`/api/issues/reports/${reportId}/status`, data),
  
  flagReport: (reportId, flagId) =>
    api.post(`/api/issues/reports/${reportId}/flag`, { flagId }),
  
  listFlaggedReports: () => api.get('/api/issues/reports/flagged'),
};
```

---

## PWA Manifest (public/manifest.json)

```json
{
  "name": "CivicTrack",
  "short_name": "CivicTrack",
  "description": "Civic issue tracking and reporting platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## Key Frontend Features to Implement

### 1. Authentication Flow
- Login page with role selection
- Registration page
- Protected routes based on roles
- Auto-redirect on 401 errors
- Token refresh handling

### 2. Role-Based Dashboards
- **Citizen Dashboard:**
  - Report new issues
  - View my reports
  - Filter by status
  - Flag inappropriate content

- **Authority Dashboard:**
  - View assigned issues
  - Update issue status
  - Add comments
  - View issue history

- **Admin Dashboard:**
  - User management
  - Department management
  - Authority management
  - View flagged reports
  - System statistics

### 3. Issue Reporting
- Form with image upload (max 5 images)
- Location picker (latitude/longitude)
- Category selection
- Authority assignment (optional)

### 4. State Management
- Use React Context for auth state
- Consider Zustand or Redux for complex state
- Local state for forms and UI

### 5. Image Handling
- Upload images via FormData
- Display images in reports
- Image preview before upload
- Image compression (optional)

---

## Important Notes

1. **Cookie-Based Auth:** Ensure `withCredentials: true` in axios config
2. **CORS:** Backend is configured for `http://localhost:5173` by default
3. **File Uploads:** Use `multipart/form-data` for image uploads
4. **Error Handling:** Implement global error handler for API errors
5. **Loading States:** Show loading indicators during API calls
6. **Form Validation:** Use react-hook-form or formik for form management
7. **PWA:** Test PWA features on HTTPS or localhost

---

## Recommended Additional Packages

```bash
# Form handling
npm install react-hook-form @hookform/resolvers zod

# UI components (optional)
npm install @headlessui/react @heroicons/react
# or
npm install @mui/material @emotion/react @emotion/styled

# State management (optional)
npm install zustand
# or
npm install @reduxjs/toolkit react-redux

# Date handling
npm install date-fns

# Maps (for location picker)
npm install react-leaflet leaflet
```

---

## Development Workflow

1. Start backend: `npm run dev` (port 8080)
2. Start frontend: `npm run dev` (port 5173)
3. Frontend proxies `/api` requests to backend
4. Test PWA features in browser DevTools > Application > Service Workers

---

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# PWA will be included automatically
```

---

## Next Steps

1. Set up the React + Vite project
2. Install dependencies
3. Configure PWA plugin
4. Set up API service layer
5. Implement authentication flow
6. Create role-based dashboards
7. Build issue reporting feature
8. Test PWA functionality

