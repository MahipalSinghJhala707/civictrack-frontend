#!/bin/bash

# Simplified script to create logical feature branches
# This creates branches AFTER infrastructure setup PR (which is already done)

BASE_BRANCH="feature/complete-frontend"
MAIN_BRANCH="main"

echo "🚀 Creating logical feature branches..."
echo "Base branch: $BASE_BRANCH"
echo "Target branch for PRs: $MAIN_BRANCH"
echo "Note: Infrastructure setup PR is already done, skipping those files"
echo ""

# Make sure we're on main to start
git checkout "$MAIN_BRANCH" 2>/dev/null || echo "Note: main branch doesn't exist, will create branches from current point"

# 1. PWA Support (service worker registration, if not in infrastructure)
echo "📦 Creating feature/pwa-support..."
git checkout -b feature/pwa-support 2>/dev/null || git checkout feature/pwa-support
git checkout "$BASE_BRANCH" -- src/main.jsx public/manifest.json public/icons/
git add .
git commit -m "feat: PWA support - service worker registration and manifest" || echo "Branch already has changes"

# 2. Authentication System
echo "📦 Creating feature/authentication-system..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/authentication-system 2>/dev/null || git checkout feature/authentication-system
git checkout "$BASE_BRANCH" -- src/context/AuthContext.jsx src/services/auth.service.js src/services/api.js src/pages/auth/ src/components/common/ProtectedRoute.jsx src/utils/errorHandler.js
git add .
git commit -m "feat: authentication system - login, register, protected routes" || echo "Branch already has changes"

# 3. Core Layout & Components
echo "📦 Creating feature/core-layout-components..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/core-layout-components 2>/dev/null || git checkout feature/core-layout-components
git checkout "$BASE_BRANCH" -- src/components/layout/ src/components/common/StatusBadge.jsx src/components/forms/ImageUpload.jsx src/App.jsx src/pages/Dashboard.jsx src/pages/NotFound.jsx src/utils/helpers.js src/utils/constants.js
git add .
git commit -m "feat: core layout components - header, footer, routing, common components" || echo "Branch already has changes"

# 4. Issue Management (includes Citizen features)
echo "📦 Creating feature/issue-management..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/issue-management 2>/dev/null || git checkout feature/issue-management
git checkout "$BASE_BRANCH" -- src/services/issue.service.js src/pages/IssueList.jsx src/pages/IssueDetail.jsx src/components/issue/IssueCard.jsx src/pages/citizen/
git add .
git commit -m "feat: issue management - listing, reporting, citizen features" || echo "Branch already has changes"

# 5. Flagging System
echo "📦 Creating feature/flagging-system..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/flagging-system 2>/dev/null || git checkout feature/flagging-system
git checkout "$BASE_BRANCH" -- src/components/issue/FlagModal.jsx src/pages/admin/FlaggedReports.jsx
# Note: FlagModal changes in IssueCard and IssueDetail need to be manually added or included in their respective branches
git add .
git commit -m "feat: flagging system - flag modal, flagged reports management" || echo "Branch already has changes"

# 6. Authority Features
echo "📦 Creating feature/authority-features..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/authority-features 2>/dev/null || git checkout feature/authority-features
git checkout "$BASE_BRANCH" -- src/pages/authority/
git add .
git commit -m "feat: authority features - dashboard, assigned issues" || echo "Branch already has changes"

# 7. Admin Features
echo "📦 Creating feature/admin-features..."
git checkout "$MAIN_BRANCH" 2>/dev/null
git checkout -b feature/admin-features 2>/dev/null || git checkout feature/admin-features
git checkout "$BASE_BRANCH" -- src/services/admin.service.js src/pages/admin/
git add .
git commit -m "feat: admin features - user management, categories, authorities, flagged reports" || echo "Branch already has changes"

# Return to complete-frontend
git checkout "$BASE_BRANCH"

echo ""
echo "✅ Created 7 logical feature branches (after infrastructure setup):"
echo "   1. feature/pwa-support (PWA manifest and service worker)"
echo "   2. feature/authentication-system"
echo "   3. feature/core-layout-components"
echo "   4. feature/issue-management"
echo "   5. feature/flagging-system"
echo "   6. feature/authority-features"
echo "   7. feature/admin-features"
echo ""
echo "ℹ️  Note: Infrastructure setup (configs, Tailwind, Vite) is already merged"
echo ""
echo "📝 Next steps:"
echo "   1. Review each branch: git checkout <branch-name>"
echo "   2. Push branches: git push origin <branch-name>"
echo "   3. Create PRs from feature branches to main"
echo ""
echo "⚠️  Note: Some files may overlap between branches (e.g., App.jsx, IssueCard.jsx)"
echo "   Review and adjust manually if needed."

