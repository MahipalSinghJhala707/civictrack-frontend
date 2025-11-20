#!/bin/bash

# Script to create feature branches from feature/complete-frontend
# This will help organize the complete frontend into logical PRs

BASE_BRANCH="feature/complete-frontend"
MAIN_BRANCH="main"

echo "🚀 Creating feature branches from $BASE_BRANCH..."

# Create feature branches with their respective files
# Each branch will have specific files related to that feature

create_branch() {
    local branch_name=$1
    shift
    local files=("$@")
    
    echo "📦 Creating branch: $branch_name"
    git checkout -b "$branch_name" "$MAIN_BRANCH" 2>/dev/null || git checkout "$branch_name"
    
    # Checkout files from complete-frontend branch
    git checkout "$BASE_BRANCH" -- "${files[@]}"
    
    if [ $? -eq 0 ]; then
        echo "✅ Branch $branch_name created successfully"
    else
        echo "❌ Failed to create branch $branch_name"
    fi
}

# 1. PWA Setup
create_branch "feature/pwa-setup" \
    "vite.config.js" \
    "src/main.jsx" \
    "public/manifest.json" \
    "public/icons/" \
    "index.html"

# 2. Authentication
create_branch "feature/authentication" \
    "src/context/AuthContext.jsx" \
    "src/services/auth.service.js" \
    "src/services/api.js" \
    "src/pages/auth/Login.jsx" \
    "src/pages/auth/Register.jsx" \
    "src/components/common/ProtectedRoute.jsx"

# 3. Core Layout
create_branch "feature/core-layout" \
    "src/components/layout/Header.jsx" \
    "src/components/layout/Footer.jsx" \
    "src/App.jsx" \
    "src/pages/Dashboard.jsx"

# 4. Styling Config
create_branch "feature/styling-config" \
    "tailwind.config.js" \
    "postcss.config.js" \
    "src/index.css" \
    "package.json" \
    ".gitignore"

# 5. Utilities & Services
create_branch "feature/utilities-services" \
    "src/utils/errorHandler.js" \
    "src/utils/helpers.js" \
    "src/utils/constants.js" \
    "src/services/issue.service.js" \
    "src/services/admin.service.js"

# 6. Common Components
create_branch "feature/common-components" \
    "src/components/common/StatusBadge.jsx" \
    "src/components/forms/ImageUpload.jsx"

# 7. Citizen Features
create_branch "feature/citizen-features" \
    "src/pages/citizen/Dashboard.jsx" \
    "src/pages/citizen/ReportIssue.jsx" \
    "src/pages/citizen/MyReports.jsx"

# 8. Issue Management
create_branch "feature/issue-management" \
    "src/pages/IssueList.jsx" \
    "src/pages/IssueDetail.jsx" \
    "src/components/issue/IssueCard.jsx"

# 9. Flagging System
create_branch "feature/flagging-system" \
    "src/components/issue/FlagModal.jsx"

# 10. Authority Features
create_branch "feature/authority-features" \
    "src/pages/authority/Dashboard.jsx" \
    "src/pages/authority/AssignedIssues.jsx"

# 11. Admin Users
create_branch "feature/admin-users" \
    "src/pages/admin/UserManagement.jsx" \
    "src/pages/admin/Dashboard.jsx"

# 12. Admin Categories
create_branch "feature/admin-categories" \
    "src/pages/admin/CategoryManagement.jsx"

# 13. Admin Authorities
create_branch "feature/admin-authorities" \
    "src/pages/admin/AuthorityManagement.jsx" \
    "src/pages/admin/DepartmentManagement.jsx" \
    "src/pages/admin/AuthorityUserManagement.jsx"

# 14. Admin Flagged Reports
create_branch "feature/admin-flagged-reports" \
    "src/pages/admin/FlaggedReports.jsx"

# 15. Misc
create_branch "feature/misc" \
    "src/pages/NotFound.jsx" \
    "DEBUGGING_GUIDE.md"

# Return to base branch
git checkout "$BASE_BRANCH"

echo ""
echo "✨ All feature branches created!"
echo "📝 Review each branch and create PRs as needed"
echo ""
echo "Next steps:"
echo "1. Review each branch: git checkout <branch-name>"
echo "2. Add commits with proper messages"
echo "3. Push branches: git push origin <branch-name>"
echo "4. Create PRs from feature branches to main"

