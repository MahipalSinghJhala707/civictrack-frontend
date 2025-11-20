# Branch Organization Plan

This document outlines how to organize the complete frontend into logical branches for PRs.

## Current Status
- **Base Branch**: `feature/complete-frontend` (contains all work)
- **Target**: Organize into logical feature branches for code review

## Proposed Branch Structure

### 1. `feature/pwa-setup`
**Files:**
- `vite.config.js` (PWA plugin configuration)
- `src/main.jsx` (service worker registration)
- `public/manifest.json`
- `public/icons/` (PWA icons)
- `index.html` (PWA meta tags)

### 2. `feature/authentication`
**Files:**
- `src/context/AuthContext.jsx`
- `src/services/auth.service.js`
- `src/services/api.js` (API setup with interceptors)
- `src/pages/auth/Login.jsx`
- `src/pages/auth/Register.jsx`
- `src/components/common/ProtectedRoute.jsx`

### 3. `feature/core-layout`
**Files:**
- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`
- `src/App.jsx` (routing structure)
- `src/pages/Dashboard.jsx`

### 4. `feature/styling-config`
**Files:**
- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`
- `package.json` (dependencies)
- `.gitignore` (updates)

### 5. `feature/utilities-services`
**Files:**
- `src/utils/errorHandler.js`
- `src/utils/helpers.js`
- `src/utils/constants.js`
- `src/services/issue.service.js`
- `src/services/admin.service.js`

### 6. `feature/common-components`
**Files:**
- `src/components/common/StatusBadge.jsx`
- `src/components/forms/ImageUpload.jsx`

### 7. `feature/citizen-features`
**Files:**
- `src/pages/citizen/Dashboard.jsx`
- `src/pages/citizen/ReportIssue.jsx`
- `src/pages/citizen/MyReports.jsx`

### 8. `feature/issue-management`
**Files:**
- `src/pages/IssueList.jsx`
- `src/pages/IssueDetail.jsx`
- `src/components/issue/IssueCard.jsx`

### 9. `feature/flagging-system`
**Files:**
- `src/components/issue/FlagModal.jsx`
- Flag functionality in `IssueCard.jsx` and `IssueDetail.jsx`
- Flagged reports in admin

### 10. `feature/authority-features`
**Files:**
- `src/pages/authority/Dashboard.jsx`
- `src/pages/authority/AssignedIssues.jsx`

### 11. `feature/admin-users`
**Files:**
- `src/pages/admin/UserManagement.jsx`
- `src/pages/admin/Dashboard.jsx` (user stats)

### 12. `feature/admin-categories`
**Files:**
- `src/pages/admin/CategoryManagement.jsx`

### 13. `feature/admin-authorities`
**Files:**
- `src/pages/admin/AuthorityManagement.jsx`
- `src/pages/admin/DepartmentManagement.jsx`
- `src/pages/admin/AuthorityUserManagement.jsx`

### 14. `feature/admin-flagged-reports`
**Files:**
- `src/pages/admin/FlaggedReports.jsx`
- Flag deletion functionality
- Flag details in issue detail page

### 15. `feature/misc`
**Files:**
- `src/pages/NotFound.jsx`
- `DEBUGGING_GUIDE.md`
- Other documentation files

## Implementation Strategy

### Option 1: Create branches from main and cherry-pick (Recommended)
1. Commit everything to `feature/complete-frontend`
2. Create feature branches from `main`
3. Cherry-pick or manually add files for each feature
4. Create PRs from feature branches to main

### Option 2: Create branches from feature/complete-frontend
1. Commit everything to `feature/complete-frontend`
2. Create feature branches from a commit before the complete work
3. Merge specific features into each branch
4. Create PRs from feature branches to main

### Option 3: Keep one branch, create PR descriptions
1. Keep everything in `feature/complete-frontend`
2. Create a comprehensive PR with sections for each feature
3. Organize review by sections

## Recommended Approach

I recommend **Option 1** for clean separation and easier code review.
