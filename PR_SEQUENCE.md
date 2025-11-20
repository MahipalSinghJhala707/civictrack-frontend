# PR Merge Sequence Guide

This document outlines the recommended order for creating and merging PRs to minimize conflicts and ensure dependencies are met.

## 📋 Recommended PR Sequence

### 1. 🔐 **Authentication System** (First Priority)
**Branch:** `feature/authentication-system`
**Why First:** 
- Core foundation - everything depends on authentication
- Contains API service with interceptors (used by all features)
- Protected routes needed for routing structure
- Auth context used throughout the app

**Dependencies:** None (Infrastructure already merged)

---

### 2. 🎨 **Core Layout & Components** (Second Priority)
**Branch:** `feature/core-layout-components`
**Why Second:**
- Provides routing structure (`App.jsx`)
- Header/Footer components needed for all pages
- Common components (StatusBadge, ImageUpload) used elsewhere
- Utilities (helpers, constants) used by many features

**Dependencies:** 
- ✅ Authentication System (for ProtectedRoute in routing)

**Merge Order:** After Authentication System

---

### 3. 📦 **PWA Support** (Can go early or after core)
**Branch:** `feature/pwa-support`
**Why Third:**
- Independent feature, but better to add after core structure
- Service worker registration in `main.jsx`
- PWA manifest and icons

**Dependencies:** 
- ✅ Infrastructure (already merged)
- ✅ Core Layout (for proper app structure)

**Merge Order:** After Core Layout (or can go earlier if needed)

---

### 4. 🐛 **Issue Management** (Third Priority)
**Branch:** `feature/issue-management`
**Why Fourth:**
- Core functionality of the application
- Includes citizen features (report issue, my reports)
- Issue service used by other features
- Issue components (IssueCard, IssueList, IssueDetail) needed by flagging

**Dependencies:**
- ✅ Authentication System (for user context, protected routes)
- ✅ Core Layout (for navigation, routing)
- ✅ Utilities & Common Components

**Merge Order:** After Authentication + Core Layout

---

### 5. 🚩 **Flagging System** (Fourth Priority)
**Branch:** `feature/flagging-system`
**Why Fifth:**
- Depends on issue management
- FlagModal component used in IssueCard
- Flagged reports page in admin

**Dependencies:**
- ✅ Issue Management (flags are attached to issues)
- ✅ Authentication System (for user context)
- ✅ Core Components (StatusBadge, etc.)

**Merge Order:** After Issue Management

---

### 6. 👮 **Authority Features** (Fifth Priority)
**Branch:** `feature/authority-features`
**Why Sixth:**
- Needs issues to show assigned issues
- Needs authentication for role-based access
- Dashboard shows issue statistics

**Dependencies:**
- ✅ Authentication System (for authority role)
- ✅ Issue Management (to display assigned issues)
- ✅ Core Layout (for routing, navigation)

**Merge Order:** After Issue Management

---

### 7. 👨‍💼 **Admin Features** (Last Priority)
**Branch:** `feature/admin-features`
**Why Last:**
- Most comprehensive feature
- Depends on flagging (FlaggedReports page)
- User management affects all other features
- Category management affects issue reporting

**Dependencies:**
- ✅ Authentication System (for admin role)
- ✅ Issue Management (for categories, issue context)
- ✅ Flagging System (for flagged reports management)
- ✅ Core Layout (for routing, navigation)

**Merge Order:** After Flagging System

---

## 🎯 Summary: Merge Order

1. **Authentication System** → Foundation
2. **Core Layout & Components** → Structure  
3. **PWA Support** → Enhancement (can merge anytime after core)
4. **Issue Management** → Core Functionality
5. **Flagging System** → Issue Enhancement
6. **Authority Features** → Role-based Feature
7. **Admin Features** → Management Features

## ⚠️ Important Notes

- **Sequential Merging:** Merge PRs in this order to avoid conflicts
- **Review Each PR:** Even though order is recommended, review each PR thoroughly
- **Test After Each Merge:** Test the application after each PR is merged
- **Resolve Conflicts Early:** If conflicts arise, resolve them before proceeding

## 📝 Quick Reference

```
development (infrastructure already merged)
    ↓
1. feature/authentication-system
    ↓
2. feature/core-layout-components
    ↓
3. feature/pwa-support (can merge after #2)
    ↓
4. feature/issue-management
    ↓
5. feature/flagging-system
    ↓
6. feature/authority-features
    ↓
7. feature/admin-features
    ↓
All features complete!
```

