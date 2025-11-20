## 📝 Description

Implements user authentication system with login, registration, and protected routes. Includes authentication context for state management, API service with interceptors, and role-based access control.

**Key Features:**
- User login with role selection
- User registration
- Protected route component
- Authentication context (AuthContext)
- API service with request/response interceptors
- Error handling for authentication failures
- Automatic token refresh and 401 redirect handling

## 🔍 Type of Change

- [x] New feature

## ✅ How Has This Been Tested?

- Tested login with different roles (citizen, authority, admin)
- Verified protected routes redirect unauthenticated users
- Confirmed API interceptors handle authentication tokens
- Tested error handling for invalid credentials

## ✔️ Checklist

- [x] My code follows the project's coding guidelines
- [x] I have self-reviewed my code before submitting

