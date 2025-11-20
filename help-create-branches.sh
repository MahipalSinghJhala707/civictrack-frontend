#!/bin/bash

# Simplified script to create logical feature branches
# This creates branches AFTER infrastructure setup PR (which is already done)
# Commits are kept small and focused for easier review

BASE_BRANCH="feature/complete-frontend"
DEVELOPMENT_BRANCH="development"

echo "🚀 Creating logical feature branches with small, focused commits..."
echo "Base branch (source of files): $BASE_BRANCH"
echo "Target branch for PRs: $DEVELOPMENT_BRANCH"
echo "Note: Infrastructure setup PR is already done, skipping those files"
echo ""

# Make sure we're on development to start
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null || { echo "❌ Error: development branch doesn't exist. Please create it first or check branch name."; exit 1; }

# 1. PWA Support (service worker registration, if not in infrastructure)
echo "📦 Creating feature/pwa-support..."
git checkout -b feature/pwa-support 2>/dev/null || git checkout feature/pwa-support
git checkout "$BASE_BRANCH" -- src/main.jsx
git add src/main.jsx
git commit -m "feat: add PWA service worker registration" || echo "Skip or already exists"
git checkout "$BASE_BRANCH" -- public/manifest.json
git add public/manifest.json
git commit -m "feat: add PWA manifest configuration" || echo "Skip or already exists"
git checkout "$BASE_BRANCH" -- public/icons/ 2>/dev/null && git add public/icons/ && git commit -m "feat: add PWA icons" || echo "Icons already handled"

# 2. Authentication System
echo "📦 Creating feature/authentication-system..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/authentication-system 2>/dev/null || git checkout feature/authentication-system

# Auth context and services
git checkout "$BASE_BRANCH" -- src/services/api.js
git add src/services/api.js
git commit -m "feat: add API service with interceptors"
git checkout "$BASE_BRANCH" -- src/services/auth.service.js
git add src/services/auth.service.js
git commit -m "feat: add authentication service"
git checkout "$BASE_BRANCH" -- src/context/AuthContext.jsx
git add src/context/AuthContext.jsx
git commit -m "feat: add authentication context"

# Login page
git checkout "$BASE_BRANCH" -- src/pages/auth/Login.jsx
git add src/pages/auth/Login.jsx
git commit -m "feat: add login page"

# Register page
git checkout "$BASE_BRANCH" -- src/pages/auth/Register.jsx
git add src/pages/auth/Register.jsx
git commit -m "feat: add register page"

# Protected route component
git checkout "$BASE_BRANCH" -- src/components/common/ProtectedRoute.jsx
git add src/components/common/ProtectedRoute.jsx
git commit -m "feat: add protected route component"

# Error handler (auth-related)
git checkout "$BASE_BRANCH" -- src/utils/errorHandler.js
git add src/utils/errorHandler.js
git commit -m "feat: add error handler utility with auth error handling"

# 3. Core Layout & Components
echo "📦 Creating feature/core-layout-components..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/core-layout-components 2>/dev/null || git checkout feature/core-layout-components

# Utilities first (dependencies)
git checkout "$BASE_BRANCH" -- src/utils/helpers.js
git add src/utils/helpers.js
git commit -m "feat: add helper utilities"
git checkout "$BASE_BRANCH" -- src/utils/constants.js
git add src/utils/constants.js
git commit -m "feat: add constants file"

# Common components
git checkout "$BASE_BRANCH" -- src/components/common/StatusBadge.jsx
git add src/components/common/StatusBadge.jsx
git commit -m "feat: add status badge component"
git checkout "$BASE_BRANCH" -- src/components/forms/ImageUpload.jsx
git add src/components/forms/ImageUpload.jsx
git commit -m "feat: add image upload component"

# Layout components
git checkout "$BASE_BRANCH" -- src/components/layout/Header.jsx
git add src/components/layout/Header.jsx
git commit -m "feat: add header component"
git checkout "$BASE_BRANCH" -- src/components/layout/Footer.jsx
git add src/components/layout/Footer.jsx
git commit -m "feat: add footer component"

# App routing
git checkout "$BASE_BRANCH" -- src/App.jsx
git add src/App.jsx
git commit -m "feat: add app routing structure"

# Dashboard and error pages
git checkout "$BASE_BRANCH" -- src/pages/Dashboard.jsx
git add src/pages/Dashboard.jsx
git commit -m "feat: add dashboard page"
git checkout "$BASE_BRANCH" -- src/pages/NotFound.jsx
git add src/pages/NotFound.jsx
git commit -m "feat: add 404 not found page"

# 4. Issue Management (includes Citizen features)
echo "📦 Creating feature/issue-management..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/issue-management 2>/dev/null || git checkout feature/issue-management

# Issue service
git checkout "$BASE_BRANCH" -- src/services/issue.service.js
git add src/services/issue.service.js
git commit -m "feat: add issue service for API calls"

# Issue components
git checkout "$BASE_BRANCH" -- src/components/issue/IssueCard.jsx
git add src/components/issue/IssueCard.jsx
git commit -m "feat: add issue card component"

# Issue pages
git checkout "$BASE_BRANCH" -- src/pages/IssueList.jsx
git add src/pages/IssueList.jsx
git commit -m "feat: add issue list page"
git checkout "$BASE_BRANCH" -- src/pages/IssueDetail.jsx
git add src/pages/IssueDetail.jsx
git commit -m "feat: add issue detail page"

# Citizen features
git checkout "$BASE_BRANCH" -- src/pages/citizen/Dashboard.jsx
git add src/pages/citizen/Dashboard.jsx
git commit -m "feat: add citizen dashboard"
git checkout "$BASE_BRANCH" -- src/pages/citizen/ReportIssue.jsx
git add src/pages/citizen/ReportIssue.jsx
git commit -m "feat: add report issue page"
git checkout "$BASE_BRANCH" -- src/pages/citizen/MyReports.jsx
git add src/pages/citizen/MyReports.jsx
git commit -m "feat: add my reports page for citizens"

# 5. Flagging System
echo "📦 Creating feature/flagging-system..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/flagging-system 2>/dev/null || git checkout feature/flagging-system

# Flag modal component
git checkout "$BASE_BRANCH" -- src/components/issue/FlagModal.jsx
git add src/components/issue/FlagModal.jsx
git commit -m "feat: add flag modal component"

# Flagging functionality in issue card (if changes needed)
# Note: IssueCard might need updates for flagging - review manually

# Flagged reports page
git checkout "$BASE_BRANCH" -- src/pages/admin/FlaggedReports.jsx
git add src/pages/admin/FlaggedReports.jsx
git commit -m "feat: add flagged reports management page"

# Flag deletion in issue service
# Note: Flag deletion might be in issue.service.js - review manually

# 6. Authority Features
echo "📦 Creating feature/authority-features..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/authority-features 2>/dev/null || git checkout feature/authority-features

git checkout "$BASE_BRANCH" -- src/pages/authority/Dashboard.jsx
git add src/pages/authority/Dashboard.jsx
git commit -m "feat: add authority dashboard"
git checkout "$BASE_BRANCH" -- src/pages/authority/AssignedIssues.jsx
git add src/pages/authority/AssignedIssues.jsx
git commit -m "feat: add assigned issues page for authorities"

# 7. Admin Features
echo "📦 Creating feature/admin-features..."
git checkout "$DEVELOPMENT_BRANCH" 2>/dev/null
git checkout -b feature/admin-features 2>/dev/null || git checkout feature/admin-features

# Admin service
git checkout "$BASE_BRANCH" -- src/services/admin.service.js
git add src/services/admin.service.js
git commit -m "feat: add admin service for API calls"

# Admin dashboard
git checkout "$BASE_BRANCH" -- src/pages/admin/Dashboard.jsx
git add src/pages/admin/Dashboard.jsx
git commit -m "feat: add admin dashboard"

# User management
git checkout "$BASE_BRANCH" -- src/pages/admin/UserManagement.jsx
git add src/pages/admin/UserManagement.jsx
git commit -m "feat: add user management page"

# Category management
git checkout "$BASE_BRANCH" -- src/pages/admin/CategoryManagement.jsx
git add src/pages/admin/CategoryManagement.jsx
git commit -m "feat: add category management page"

# Authority management
git checkout "$BASE_BRANCH" -- src/pages/admin/AuthorityManagement.jsx
git add src/pages/admin/AuthorityManagement.jsx
git commit -m "feat: add authority management page"

# Department management
git checkout "$BASE_BRANCH" -- src/pages/admin/DepartmentManagement.jsx
git add src/pages/admin/DepartmentManagement.jsx
git commit -m "feat: add department management page"

# Authority-user management
git checkout "$BASE_BRANCH" -- src/pages/admin/AuthorityUserManagement.jsx
git add src/pages/admin/AuthorityUserManagement.jsx
git commit -m "feat: add authority-user linking management"

# Push all branches to origin
echo ""
echo "📤 Pushing branches to origin..."
branches=(
  "feature/pwa-support"
  "feature/authentication-system"
  "feature/core-layout-components"
  "feature/issue-management"
  "feature/flagging-system"
  "feature/authority-features"
  "feature/admin-features"
)

for branch in "${branches[@]}"; do
  if git rev-parse --verify "$branch" >/dev/null 2>&1; then
    echo "  Pushing $branch..."
    git push -u origin "$branch" 2>/dev/null || echo "    ⚠️  Failed to push $branch (may already exist)"
  else
    echo "  ⚠️  Branch $branch not found, skipping..."
  fi
done

# Return to complete-frontend
git checkout "$BASE_BRANCH"

echo ""
echo "✅ Created and pushed 7 logical feature branches with small, focused commits:"
echo "   1. feature/pwa-support (2-3 commits)"
echo "   2. feature/authentication-system (6 commits)"
echo "   3. feature/core-layout-components (8 commits)"
echo "   4. feature/issue-management (7 commits)"
echo "   5. feature/flagging-system (2-3 commits)"
echo "   6. feature/authority-features (2 commits)"
echo "   7. feature/admin-features (7 commits)"
echo ""
echo "ℹ️  Note: Infrastructure setup (configs, Tailwind, Vite) is already merged"
echo ""
echo "📝 Next steps:"
echo "   1. Review each branch: git checkout <branch-name>"
echo "   2. Check commit history: git log --oneline"
echo "   3. Create PRs manually from feature branches to development on GitHub/GitLab"
echo ""
echo "⚠️  Note: Some interconnected changes (like flagging in IssueCard)"
echo "   may need manual review and adjustment."
