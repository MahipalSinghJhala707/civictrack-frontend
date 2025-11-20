# CivicTrack Backend API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All protected endpoints require a JWT token stored in an HTTP-only cookie named `token`. The token is automatically sent with requests that include credentials.

### Authentication Flow
1. Register or Login to receive a JWT token
2. Token is stored in an HTTP-only cookie
3. Subsequent requests automatically include the token
4. Use `/api/auth/logout` to clear the token

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user account
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "Registered successfully.",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and receive JWT token
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "role": "citizen"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  }
  ```
- **Note:** Token is set as HTTP-only cookie automatically

#### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Clear authentication token
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

#### Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Description:** Get authenticated user information
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "role": "citizen"
      }
    }
  }
  ```

---

### 👥 Admin - Users (`/api/admin/users`)

**All admin routes require:**
- Authentication (JWT token)
- Admin role

#### List All Users
- **Endpoint:** `GET /api/admin/users`
- **Description:** Get list of all users with their roles
- **Authentication:** Required (Admin only)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "roles": [
            {
              "id": 3,
              "name": "citizen",
              "description": "Regular citizen user"
            }
          ]
        }
      ]
    }
  }
  ```

#### Create User
- **Endpoint:** `POST /api/admin/users`
- **Description:** Create a new user account
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "roleIds": [1, 3]
  }
  ```
- **Response:** `201 Created`

#### Update User
- **Endpoint:** `PATCH /api/admin/users/:userId`
- **Description:** Update user information (name and/or email)
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `userId` (integer, required)
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
  ```
- **Response:** `200 OK`

#### Update User Roles
- **Endpoint:** `PATCH /api/admin/users/:userId/roles`
- **Description:** Update user roles
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `userId` (integer, required)
- **Request Body:**
  ```json
  {
    "roleIds": [1, 2, 3]
  }
  ```
- **Response:** `200 OK`

#### Delete User
- **Endpoint:** `DELETE /api/admin/users/:userId`
- **Description:** Soft delete a user
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `userId` (integer, required)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "User deleted successfully."
  }
  ```

---

### 🏢 Admin - Departments (`/api/admin/departments`)

**All admin routes require:**
- Authentication (JWT token)
- Admin role

#### List All Departments
- **Endpoint:** `GET /api/admin/departments`
- **Description:** Get list of all departments
- **Authentication:** Required (Admin only)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "departments": [
        {
          "id": 1,
          "name": "Public Works",
          "description": "Handles infrastructure issues"
        }
      ]
    }
  }
  ```

#### Create Department
- **Endpoint:** `POST /api/admin/departments`
- **Description:** Create a new department
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "name": "Public Works",
    "description": "Handles infrastructure and maintenance issues"
  }
  ```
- **Response:** `201 Created`

#### Update Department
- **Endpoint:** `PATCH /api/admin/departments/:departmentId`
- **Description:** Update department information
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `departmentId` (integer, required)
- **Request Body:**
  ```json
  {
    "name": "Public Works & Infrastructure",
    "description": "Updated description"
  }
  ```
- **Response:** `200 OK`

#### Delete Department
- **Endpoint:** `DELETE /api/admin/departments/:departmentId`
- **Description:** Soft delete a department
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `departmentId` (integer, required)
- **Response:** `200 OK`

---

### 🏛️ Admin - Authorities (`/api/admin/authorities`)

**All admin routes require:**
- Authentication (JWT token)
- Admin role

#### List All Authorities
- **Endpoint:** `GET /api/admin/authorities`
- **Description:** Get list of all authorities with department information
- **Authentication:** Required (Admin only)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "authorities": [
        {
          "id": 1,
          "name": "City Hall",
          "city": "New York",
          "region": "Manhattan",
          "department": {
            "id": 1,
            "name": "Public Works"
          }
        }
      ]
    }
  }
  ```

#### Create Authority
- **Endpoint:** `POST /api/admin/authorities`
- **Description:** Create a new authority
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "name": "City Hall",
    "city": "New York",
    "region": "Manhattan",
    "departmentId": 1,
    "address": "123 Main St, New York, NY 10001"
  }
  ```
- **Response:** `201 Created`

#### Update Authority
- **Endpoint:** `PATCH /api/admin/authorities/:authorityId`
- **Description:** Update authority information
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `authorityId` (integer, required)
- **Request Body:**
  ```json
  {
    "name": "City Hall - Updated",
    "city": "New York",
    "region": "Manhattan",
    "departmentId": 2,
    "address": "Updated address"
  }
  ```
- **Response:** `200 OK`

#### Delete Authority
- **Endpoint:** `DELETE /api/admin/authorities/:authorityId`
- **Description:** Soft delete an authority
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `authorityId` (integer, required)
- **Response:** `200 OK`

---

### 🔗 Admin - Authority Users (`/api/admin/authority-users`)

**All admin routes require:**
- Authentication (JWT token)
- Admin role

#### List All Authority Users
- **Endpoint:** `GET /api/admin/authority-users`
- **Description:** Get list of all authority-user mappings
- **Authentication:** Required (Admin only)
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "authorityUsers": [
        {
          "id": 1,
          "authority": {
            "id": 1,
            "name": "City Hall",
            "city": "New York",
            "region": "Manhattan"
          },
          "user": {
            "id": 2,
            "name": "Authority User",
            "email": "authority@example.com"
          }
        }
      ]
    }
  }
  ```

#### Create Authority User
- **Endpoint:** `POST /api/admin/authority-users`
- **Description:** Link a user to an authority (one-to-one relationship)
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "authorityId": 1,
    "userId": 2
  }
  ```
- **Response:** `201 Created`

#### Update Authority User
- **Endpoint:** `PATCH /api/admin/authority-users/:authorityUserId`
- **Description:** Update authority assignment for a user
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `authorityUserId` (integer, required)
- **Request Body:**
  ```json
  {
    "authorityId": 2
  }
  ```
- **Response:** `200 OK`

#### Delete Authority User
- **Endpoint:** `DELETE /api/admin/authority-users/:authorityUserId`
- **Description:** Remove authority-user link
- **Authentication:** Required (Admin only)
- **URL Parameters:**
  - `authorityUserId` (integer, required)
- **Response:** `200 OK`

---

### 📋 Issues (`/api/issues`)

**All issue routes require authentication. Role-based access varies by endpoint.**

#### List Issue Categories
- **Endpoint:** `GET /api/issues/categories`
- **Description:** Get list of available issue categories
- **Authentication:** Required
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "categories": [
        {
          "id": 1,
          "name": "Pothole",
          "slug": "pothole",
          "description": "Road pothole issues"
        }
      ]
    }
  }
  ```

#### Create Issue Report
- **Endpoint:** `POST /api/issues/reports`
- **Description:** Create a new issue report with optional images
- **Authentication:** Required
- **Role:** Citizen only
- **Request Body (multipart/form-data):**
  ```
  title: "Pothole on Main Street"
  description: "Large pothole causing traffic issues"
  issueId: 1
  authorityId: 1 (optional)
  latitude: 40.7128 (optional)
  longitude: -74.0060 (optional)
  region: "Manhattan" (optional)
  imageUrls: ["https://example.com/image.jpg"] (optional, max 5)
  images: [file1, file2, ...] (optional, max 5 files, 5MB each)
  ```
- **Response:** `201 Created`
  ```json
  {
    "success": true,
    "message": "Issue reported successfully.",
    "data": {
      "report": {
        "id": 1,
        "title": "Pothole on Main Street",
        "description": "Large pothole causing traffic issues",
        "status": "reported",
        "images": [...]
      }
    }
  }
  ```

#### List Reports
- **Endpoint:** `GET /api/issues/reports`
- **Description:** Get list of issue reports (filtered by user role)
- **Authentication:** Required
- **Query Parameters:**
  - `status` (optional): Filter by status (reported, in_progress, resolved)
  - `authorityId` (optional): Filter by authority
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "reports": [...]
    }
  }
  ```

#### Update Issue Status
- **Endpoint:** `PATCH /api/issues/reports/:reportId/status`
- **Description:** Update the status of an issue report
- **Authentication:** Required
- **Role:** Authority or Admin only
- **URL Parameters:**
  - `reportId` (integer, required)
- **Request Body:**
  ```json
  {
    "status": "in_progress",
    "comment": "Work has started on this issue"
  }
  ```
- **Valid Status Values:** `reported`, `in_progress`, `resolved`
- **Response:** `200 OK`

#### Update Issue Status (Alternative)
- **Endpoint:** `PUT /api/issues/:id/status`
- **Description:** Alternative endpoint to update issue status
- **Authentication:** Required
- **Role:** Authority or Admin only
- **URL Parameters:**
  - `id` (integer, required)
- **Request Body:**
  ```json
  {
    "status": "resolved",
    "comment": "Issue has been resolved"
  }
  ```
- **Valid Status Values:** `reported`, `in_progress`, `resolved`, `rejected`
- **Response:** `200 OK`

#### Flag Report
- **Endpoint:** `POST /api/issues/reports/:reportId/flag`
- **Description:** Flag an issue report as inappropriate
- **Authentication:** Required
- **Role:** Citizen only
- **URL Parameters:**
  - `reportId` (integer, required)
- **Request Body:**
  ```json
  {
    "flagId": 1
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "message": "Issue flagged for review.",
    "data": {
      "report": {...}
    }
  }
  ```

#### List Flagged Reports
- **Endpoint:** `GET /api/issues/reports/flagged`
- **Description:** Get list of all flagged reports
- **Authentication:** Required
- **Role:** Admin only
- **Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "reports": [...]
    }
  }
  ```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required."
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission to access this resource."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found."
}
```

### 409 Conflict
```json
{
  "message": "Resource already exists."
}
```

### 422 Unprocessable Entity
```json
{
  "errors": [
    "Error message 1",
    "Error message 2"
  ]
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource conflict (e.g., duplicate email)
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server error

---

## Notes

1. **Authentication:** JWT tokens are stored in HTTP-only cookies and sent automatically with requests
2. **Role-Based Access:** Different endpoints require different roles (admin, authority, citizen)
3. **File Uploads:** Image uploads support multipart/form-data with max 5 images, 5MB each
4. **Soft Deletes:** Delete operations are soft deletes (records are marked as deleted, not removed)
5. **Pagination:** List endpoints may support pagination in future versions
6. **Filtering:** Some list endpoints support query parameters for filtering

---

## Base URL Configuration

The API base URL can be configured via environment variables:
- Default: `http://localhost:8080`
- Set `PORT` environment variable to change port
- Set `FRONTEND_ORIGIN` for CORS configuration

