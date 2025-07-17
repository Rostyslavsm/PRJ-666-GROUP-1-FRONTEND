# Debugging Guide for Past Classes and Archived Courses

## What We've Fixed

### 1. **API Endpoint Corrections**

- ✅ Updated all API calls to use `/v1/courses` and `/v1/classes`
- ✅ Fixed query parameters for past classes and archived courses
- ✅ Added proper error handling for API calls

### 2. **Data Flow Improvements**

- ✅ Separate API calls for active courses (`?active=true`) and archived courses (`?past=true`)
- ✅ Proper API call for past classes (`?past=true&expand=course`)
- ✅ Added `refreshPastClasses()` function for dedicated past classes refresh

### 3. **Debugging Tools Added**

- ✅ Comprehensive logging throughout the data flow
- ✅ Debug information panels in both Past Classes and Archived Courses tabs
- ✅ Test API endpoints button to verify backend connectivity
- ✅ Real-time data count display

## How to Debug the Issue

### Step 1: Check the Console Logs

Open your browser's developer console and look for these log messages:

#### For Archived Courses:

```
🔍 Fetching archived courses with URL: [API_URL]/v1/courses?past=true
🔍 Archived courses response status: [STATUS]
📥 Archived courses response: [RESPONSE_DATA]
📥 Archived courses count: [COUNT]
🔍 ArchivedCoursesList - archivedCourses: [DATA]
```

#### For Past Classes:

```
🔍 Fetching past classes with URL: [API_URL]/v1/classes?past=true&expand=course
🔍 Past classes response status: [STATUS]
📥 Past classes response: [RESPONSE_DATA]
📥 Past classes count: [COUNT]
🔍 PastClassesList - pastClasses: [DATA]
```

### Step 2: Use the Debug Panels

Navigate to the **Archived Courses** or **Past Classes** tabs and you'll see debug panels with:

- Current data count
- "Test API Endpoints" button
- "Refresh Data" button

### Step 3: Test API Endpoints

Click the **"Test API Endpoints"** button to manually test the backend APIs. This will:

- Test the archived courses endpoint
- Test the past classes endpoint
- Show detailed response information in the console

### Step 4: Check for Common Issues

#### Issue 1: API Endpoint Not Found (404)

**Symptoms**: Console shows 404 errors
**Solution**: Verify the backend is running and the API endpoints are correct

#### Issue 2: Authentication Errors (401)

**Symptoms**: Console shows 401 errors
**Solution**: Check authentication headers and ensure user is logged in

#### Issue 3: Backend Logic Issue

**Symptoms**: API returns 200 but empty data
**Solution**: This is likely the backend issue we identified - courses with past end dates are still marked as 'active'

#### Issue 4: No Data in Database

**Symptoms**: API returns 200 with empty arrays
**Solution**: Create test courses with past end dates to verify functionality

## Expected Behavior

### When Working Correctly:

1. **Archived Courses Tab**: Shows courses with `endDate < current date`
2. **Past Classes Tab**: Shows classes with `endTime < current date`
3. **Debug Panels**: Show accurate counts and successful API responses
4. **Console Logs**: Show successful API calls with data

### When There Are Issues:

1. **Empty Tabs**: Check console for API errors or empty responses
2. **Wrong Data**: Check if the backend logic is filtering correctly
3. **No Response**: Check if the backend server is running

## Backend Fix Required

The main issue is likely in the backend `getCourses` function. When `past=true`, it should query ALL courses and filter by end date, not just inactive courses.

**Current Backend Logic (Problematic):**

```javascript
// When past=true, this queries only inactive courses
let courses = await Course.find({ userId, status: active ? 'active' : 'inactive' });
```

**Required Backend Fix:**

```javascript
if (past) {
  // For past courses, get ALL courses and filter by end date
  courses = await Course.find({ userId });
  courses = courses.filter((course) => course.endDate < today);
}
```

## Testing Steps

1. **Create Test Data**: Create a course with an end date in the past
2. **Check API Directly**: Call `GET /api/v1/courses?past=true` in Thunder Client or Postman
3. **Check Frontend**: Navigate to Archived Courses tab and use debug tools
4. **Verify Data Flow**: Check console logs for data at each step

## Quick Fixes to Try

1. **Restart Backend**: Sometimes the backend needs a restart to pick up changes
2. **Clear Browser Cache**: Clear browser cache and reload the page
3. **Check Network Tab**: Look for failed API requests in browser network tab
4. **Test with Different User**: Try with a different user account that has past courses

## Support Information

If you're still having issues:

1. Check the console logs for specific error messages
2. Use the "Test API Endpoints" button to verify backend connectivity
3. Verify the backend fix has been applied to the `getCourses` function
4. Ensure there are courses in the database with past end dates
