# CivicTrack Frontend - TypeScript/JavaScript Types

Complete type definitions for frontend development.

## User Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string; // Never sent from API, only for forms
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
}

interface Role {
  id: number;
  name: 'admin' | 'authority' | 'citizen';
  description?: string;
  is_active?: boolean;
}

interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  user?: User;
  role?: Role;
}
```

## Issue Types

```typescript
interface IssueCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

interface IssueReport {
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

interface IssueImage {
  id: number;
  report_id: number;
  url: string;
}

interface UserIssueFlag {
  id: number;
  report_id: number;
  user_id: number;
  flag_id: number;
  report?: IssueReport;
  user?: User;
  flag?: Flag;
}

interface Flag {
  id: number;
  name: string;
  description?: string;
}

interface Log {
  id: number;
  issue_id: number;
  updated_by: number;
  from_status?: string;
  to_status?: string;
  comment?: string;
  issue?: IssueReport;
  updatedBy?: User;
  created_at: string;
}
```

## Admin Types

```typescript
interface Department {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Authority {
  id: number;
  name: string;
  city: string;
  region: string;
  department_id?: number;
  address?: string;
  department?: Department;
  created_at?: string;
  updated_at?: string;
}

interface AuthorityUser {
  id: number;
  authority_id: number;
  user_id: number;
  authority?: Authority;
  user?: User;
  created_at?: string;
  updated_at?: string;
}
```

## API Response Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiError {
  message: string;
  errors?: string[];
}

// Specific Response Types
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface ListResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
  };
}

interface SingleResponse<T> {
  success: boolean;
  message?: string;
  data: {
    [key: string]: T;
  };
}
```

## Form Types

```typescript
interface LoginForm {
  email: string;
  password: string;
  role?: 'admin' | 'authority' | 'citizen';
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  roleIds?: number[];
}

interface UpdateUserForm {
  name?: string;
  email?: string;
}

interface UpdateUserRolesForm {
  roleIds: number[];
}

interface CreateDepartmentForm {
  name: string;
  description?: string;
}

interface UpdateDepartmentForm {
  name?: string;
  description?: string;
}

interface CreateAuthorityForm {
  name: string;
  city: string;
  region: string;
  departmentId?: number;
  address?: string;
}

interface UpdateAuthorityForm {
  name?: string;
  city?: string;
  region?: string;
  departmentId?: number;
  address?: string;
}

interface CreateAuthorityUserForm {
  authorityId: number;
  userId: number;
}

interface UpdateAuthorityUserForm {
  authorityId: number;
}

interface CreateReportForm {
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

interface UpdateStatusForm {
  status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
  comment?: string;
}

interface FlagReportForm {
  flagId: number;
}
```

## Constants

```typescript
export const ROLES = {
  ADMIN: 'admin',
  AUTHORITY: 'authority',
  CITIZEN: 'citizen',
} as const;

export const ISSUE_STATUS = {
  REPORTED: 'reported',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    DEPARTMENTS: '/api/admin/departments',
    AUTHORITIES: '/api/admin/authorities',
    AUTHORITY_USERS: '/api/admin/authority-users',
  },
  ISSUES: {
    CATEGORIES: '/api/issues/categories',
    REPORTS: '/api/issues/reports',
    UPDATE_STATUS: (id: number) => `/api/issues/reports/${id}/status`,
    FLAG: (id: number) => `/api/issues/reports/${id}/flag`,
    FLAGGED: '/api/issues/reports/flagged',
  },
} as const;
```

## Hook Return Types

```typescript
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthority: boolean;
  isCitizen: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}
```

## Component Props Types

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'authority' | 'citizen';
}

interface IssueCardProps {
  report: IssueReport;
  onStatusUpdate?: (id: number, status: string) => void;
  onFlag?: (id: number, flagId: number) => void;
  showActions?: boolean;
}

interface ImageUploadProps {
  maxImages?: number;
  maxSizeMB?: number;
  onUpload: (files: File[]) => void;
  existingImages?: string[];
}
```

