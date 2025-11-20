# CivicTrack Frontend - Component Structure Guide

Recommended component structure for React + Vite + PWA app.

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Sidebar (Admin/Authority)
│   └── Footer
├── Auth Pages
│   ├── Login
│   └── Register
├── Citizen Pages
│   ├── Dashboard
│   ├── ReportIssue
│   │   ├── IssueForm
│   │   ├── ImageUpload
│   │   └── LocationPicker
│   └── MyReports
│       └── ReportCard
├── Authority Pages
│   ├── Dashboard
│   ├── AssignedIssues
│   │   ├── IssueList
│   │   └── IssueDetail
│   │       └── StatusUpdate
│   └── IssueHistory
├── Admin Pages
│   ├── Dashboard
│   ├── UserManagement
│   │   ├── UserList
│   │   ├── UserForm
│   │   └── UserCard
│   ├── DepartmentManagement
│   ├── AuthorityManagement
│   └── FlaggedReports
└── Common Pages
    ├── IssueList
    ├── IssueDetail
    └── NotFound
```

## Key Components to Build

### 1. Authentication Components

#### Login Component
```javascript
// src/pages/auth/Login.jsx
- Email input
- Password input
- Role selector (dropdown)
- Submit button
- Link to register
- Error message display
```

#### Register Component
```javascript
// src/pages/auth/Register.jsx
- Name input
- Email input
- Password input
- Confirm password
- Submit button
- Link to login
- Error message display
```

### 2. Layout Components

#### Header Component
```javascript
// src/components/layout/Header.jsx
- Logo/Brand
- Navigation menu (role-based)
- User menu dropdown
- Logout button
```

#### ProtectedRoute Component
```javascript
// src/components/common/ProtectedRoute.jsx
- Check authentication
- Check role permissions
- Redirect if unauthorized
- Show loading state
```

### 3. Citizen Components

#### ReportIssue Component
```javascript
// src/pages/citizen/ReportIssue.jsx
- Issue category selector
- Title input
- Description textarea
- Location picker (map)
- Image upload (max 5)
- Authority selector (optional)
- Submit button
```

#### MyReports Component
```javascript
// src/pages/citizen/MyReports.jsx
- Filter by status
- List of user's reports
- Report cards with status badges
- View details button
- Flag button
```

### 4. Authority Components

#### AssignedIssues Component
```javascript
// src/pages/authority/AssignedIssues.jsx
- Filter by status
- List of assigned issues
- Issue cards
- Quick status update
- View details
```

#### StatusUpdate Component
```javascript
// src/components/issue/StatusUpdate.jsx
- Status dropdown
- Comment textarea
- Submit button
- Status history display
```

### 5. Admin Components

#### UserManagement Component
```javascript
// src/pages/admin/UserManagement.jsx
- User list table
- Create user button
- Edit user modal
- Delete user confirmation
- Role assignment
```

#### DepartmentManagement Component
```javascript
// src/pages/admin/DepartmentManagement.jsx
- Department list
- Create department form
- Edit department
- Delete department
```

#### AuthorityManagement Component
```javascript
// src/pages/admin/AuthorityManagement.jsx
- Authority list
- Create authority form
- Edit authority
- Delete authority
- Link users to authorities
```

### 6. Common Components

#### IssueCard Component
```javascript
// src/components/issue/IssueCard.jsx
- Issue title
- Description preview
- Status badge
- Category badge
- Images preview
- Location info
- Action buttons (role-based)
- Created date
```

#### ImageUpload Component
```javascript
// src/components/forms/ImageUpload.jsx
- File input
- Image preview grid
- Remove image button
- Upload progress
- Max images indicator
- File size validation
```

#### LocationPicker Component
```javascript
// src/components/forms/LocationPicker.jsx
- Map component (Leaflet/Google Maps)
- Marker placement
- Latitude/longitude display
- Address search (optional)
- Current location button
```

#### StatusBadge Component
```javascript
// src/components/common/StatusBadge.jsx
- Color-coded status
- Status text
- Icon (optional)
```

## State Management Recommendations

### 1. Authentication State
- Use React Context (AuthContext)
- Store user info and role
- Provide login/logout functions

### 2. API Data State
- Use React Query or SWR for server state
- Cache API responses
- Handle loading and error states

### 3. Form State
- Use react-hook-form for forms
- Local component state for UI state

### 4. Global UI State
- Loading indicators
- Toast notifications
- Modal states

## Styling Recommendations

### Option 1: Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Option 2: Material-UI
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Option 3: Headless UI + Custom CSS
```bash
npm install @headlessui/react @heroicons/react
```

## PWA Features to Implement

1. **Service Worker Registration**
   - Auto-registered by vite-plugin-pwa
   - Handle offline scenarios

2. **Install Prompt**
   - Show install button when PWA is installable
   - Handle beforeinstallprompt event

3. **Offline Support**
   - Cache API responses
   - Show offline indicator
   - Queue actions when offline

4. **Push Notifications** (Optional)
   - Notify on status updates
   - Notify on new assignments

## Example Component Implementation

### IssueCard Component Example

```javascript
// src/components/issue/IssueCard.jsx
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../common/StatusBadge';
import { issueService } from '../../services/issue.service';

function IssueCard({ report, onUpdate }) {
  const { isCitizen, isAuthority, isAdmin } = useAuth();

  const handleStatusUpdate = async (newStatus) => {
    try {
      await issueService.updateStatus(report.id, {
        status: newStatus,
        comment: 'Status updated',
      });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="issue-card">
      <h3>{report.title}</h3>
      <StatusBadge status={report.status} />
      <p>{report.description}</p>
      {report.images && (
        <div className="image-gallery">
          {report.images.map(img => (
            <img key={img.id} src={img.url} alt="Issue" />
          ))}
        </div>
      )}
      {(isAuthority || isAdmin) && (
        <select onChange={(e) => handleStatusUpdate(e.target.value)}>
          <option value="reported">Reported</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      )}
      {isCitizen && (
        <button onClick={() => handleFlag(report.id)}>
          Flag Report
        </button>
      )}
    </div>
  );
}
```

## Routing Structure

```javascript
// Recommended routes
/                    → Dashboard (role-based)
/login               → Login page
/register            → Register page
/report              → Report issue (citizen)
/issues              → View all issues
/issues/:id          → Issue details
/admin/users         → User management (admin)
/admin/departments   → Department management (admin)
/admin/authorities   → Authority management (admin)
/authority/issues    → Assigned issues (authority)
```

## Form Validation

Use react-hook-form with zod:

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  issueId: z.number().min(1, 'Please select a category'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

function ReportForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
  });

  // ...
}
```

## Error Handling

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 422:
        return data.errors?.join(', ') || 'Validation error';
      default:
        return data.message || 'An error occurred';
    }
  }
  return 'Network error. Please check your connection.';
};
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic into hooks
   - Use composition over inheritance

2. **API Calls**
   - Centralize API logic in services
   - Use React Query for caching
   - Handle loading and error states

3. **State Management**
   - Use Context for auth state
   - Use local state for UI state
   - Consider Zustand for complex state

4. **Performance**
   - Lazy load routes
   - Memoize expensive computations
   - Optimize images

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels
   - Keyboard navigation support

6. **PWA**
   - Test offline functionality
   - Handle service worker updates
   - Show update prompts

