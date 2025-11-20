# Debugging Guide for CivicTrack Frontend

## Bug Analysis

### Bug 1: New User Registration - Issues Not Showing

**Symptoms:**
- User registers successfully
- User logs in successfully
- Issues list is empty (no issues showing)

**Possible Causes:**

1. **Backend Issue (Most Likely)**: 
   - New users might not have a role assigned automatically
   - The API endpoint `/api/issues/reports` might filter by role
   - If user has no role, API might return empty array or error

2. **Frontend Issue**:
   - Role extraction might be failing
   - API response structure might be different

**How to Debug:**

1. Open browser console (F12)
2. Register a new user
3. Check console logs for:
   - "Register response:" - Check if user has roles
   - "Auth check response:" - Check user object structure
   - "User roles:" - Check if roles array exists
   - "Loading reports with params:" - Check API call
   - "API Response:" - Check what API returns
   - "Number of reports:" - Check if reports array is empty

**Expected Backend Behavior:**
- New users should automatically get a "citizen" role assigned
- `/api/auth/me` should return user with roles array
- `/api/issues/reports` should return all public issues for citizens

**Fix Required:**
- **Backend**: Ensure registration endpoint assigns default "citizen" role
- **Backend**: Ensure `/api/auth/me` returns user with roles array
- **Backend**: Ensure `/api/issues/reports` returns issues for users with citizen role

---

### Bug 2: Flagging Functionality Not Working

**Symptoms:**
- Clicking "Flag" button doesn't work
- Error message appears or nothing happens

**Possible Causes:**

1. **Backend Issue (Most Likely)**:
   - Flag ID `1` might not exist in the database
   - Backend might require a different flag ID
   - Backend might need flags to be created first
   - API might return error for invalid flagId

2. **Frontend Issue**:
   - Error handling might be swallowing the error
   - API endpoint might be wrong

**How to Debug:**

1. Open browser console (F12)
2. Click "Flag" on any issue
3. Check console logs for:
   - "Flagging report:" - Check report ID
   - "Flag response:" - Check if API call succeeds
   - "Flag error response:" - Check error details
   - "Flag error data:" - Check error message from backend

**Expected Backend Behavior:**
- Backend should have flag types defined (e.g., "inappropriate", "spam", etc.)
- Flag ID should be valid (1, 2, 3, etc.)
- API should return success response when flagging

**Fix Required:**
- **Backend**: Ensure flag types exist in database
- **Backend**: Return list of available flags or validate flagId
- **Frontend**: Fetch available flags first, or use correct flagId

---

## Console Logging Added

The following components now have detailed logging:

1. **AuthContext**:
   - Registration attempts and responses
   - Login attempts and responses
   - Auth check responses
   - User role extraction

2. **IssueList**:
   - API call parameters
   - API responses
   - Report extraction
   - Empty results warnings

3. **IssueCard**:
   - Flagging attempts
   - Flag API responses
   - Flag errors

## Next Steps

1. **Test with console open**:
   - Register a new user
   - Try to view issues
   - Try to flag an issue
   - Check all console logs

2. **Share console output**:
   - Copy all console logs
   - Share error messages
   - Share API responses

3. **Check backend**:
   - Verify new users get roles assigned
   - Verify flag types exist
   - Check API responses match documentation

## Quick Fixes to Try

### For Bug 1 (Issues Not Showing):
- Check if user has role after registration
- If no role, manually assign "citizen" role via admin panel
- Check if API returns issues for users without roles

### For Bug 2 (Flagging):
- Try different flagId values (1, 2, 3)
- Check backend database for flag types
- Verify flag endpoint accepts the request format

