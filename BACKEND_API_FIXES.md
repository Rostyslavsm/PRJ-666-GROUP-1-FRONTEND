# Backend API Fixes for Past Classes and Archived Courses

## Issues Identified and Fixed

### 1. **Incorrect API Endpoint Usage**

**Problem**: Frontend was using inconsistent API endpoints (`/courses` vs `/v1/courses`)
**Fix**: Updated all API calls to use the correct `/v1/courses` and `/v1/classes` endpoints

### 2. **Missing Proper API Calls for Past Classes and Archived Courses**

**Problem**: Frontend was not using the correct query parameters for fetching past classes and archived courses
**Fix**: Updated API calls to use the proper query parameters as documented in the backend:

#### Courses API:

- `GET /api/v1/courses?active=true` - Get active courses
- `GET /api/v1/courses?past=true` - Get archived courses (past courses)

#### Classes API:

- `GET /api/v1/classes` - Get current classes
- `GET /api/v1/classes?past=true&expand=course` - Get past classes with course details

### 3. **Incorrect Data Transformation for Past Classes**

**Problem**: Past classes were not being properly transformed for display
**Fix**: Added proper data transformation for past classes with course expansion

## Files Modified

### 1. `src/features/courses/hooks/useCourses.js`

**Major Changes**:

- Added separate API calls for active courses (`?active=true`) and archived courses (`?past=true`)
- Added proper API call for past classes (`?past=true&expand=course`)
- Added `refreshPastClasses()` function for refreshing past classes data
- Improved data transformation for past classes with proper date/time formatting
- Fixed course data transformation to handle both active and archived courses

### 2. `src/features/courses/components/CoursesContainer.jsx`

**Changes**:

- Added `refreshPastClasses` to the destructured hook
- Updated tab change effect to call `refreshPastClasses()` when switching to Past Classes tab
- Added proper dependency array for the useEffect

### 3. `src/features/courses/components/PastClassesList.jsx`

**Changes**:

- Updated to use the transformed past classes data structure
- Fixed course data composition for CourseCard component
- Added proper handling of class type and location data

### 4. `src/features/calendar/hooks/useCalendarData.js`

**Changes**:

- Fixed API endpoint from `/classes` to `/v1/classes`

### 5. `src/features/events/services/eventService.js`

**Changes**:

- Fixed API endpoint from `/courses` to `/v1/courses`

### 6. `src/features/goals/services/goalService.js`

**Changes**:

- Fixed API endpoint from `/courses` to `/v1/courses`

### 7. `src/features/seed/services/seedService.js`

**Changes**:

- Fixed API endpoint from `/courses` to `/v1/courses`

### 8. `src/features/seed/hooks/useSeed.js`

**Changes**:

- Fixed API endpoint from `/courses` to `/v1/courses`

## Backend API Documentation Summary

Based on the backend files provided, the correct API endpoints and parameters are:

### Courses Endpoints:

```
GET /api/v1/courses?active=true     # Get active courses
GET /api/v1/courses?past=true       # Get archived courses (past courses)
GET /api/v1/courses?active=false    # Get completed courses
```

### Classes Endpoints:

```
GET /api/v1/classes                 # Get current classes (default: one week range)
GET /api/v1/classes?past=true       # Get past classes
GET /api/v1/classes?expand=course   # Get classes with expanded course details
GET /api/v1/classes?from=...&to=... # Get classes with date range filter
GET /api/v1/classes?past=true&expand=course # Get past classes with course details
```

## Key Improvements

1. **Proper Data Separation**: Active courses and archived courses are now fetched separately using the correct API parameters
2. **Enhanced Past Classes Display**: Past classes now include expanded course information for better display
3. **Consistent API Usage**: All frontend services now use the correct `/v1/` prefixed endpoints
4. **Better Data Refresh**: Added dedicated refresh functions for past classes and proper tab-based data refresh
5. **Improved Error Handling**: Better error handling for API calls with proper status code checking

## Testing Recommendations

1. **Test Active Courses Tab**: Verify that only active courses are displayed
2. **Test Archived Courses Tab**: Verify that only past/archived courses are displayed
3. **Test Past Classes Tab**: Verify that past classes are displayed with proper course information
4. **Test Data Refresh**: Verify that switching between tabs properly refreshes the data
5. **Test API Endpoints**: Verify that all API calls use the correct endpoints and parameters

## Notes

- The backend API documentation shows that the `past=true` parameter for courses returns courses that have ended (endDate < current date)
- The `past=true` parameter for classes returns classes that have ended (endTime < current date)
- The `expand=course` parameter for classes includes the full course object in the response
- All API calls now include proper error handling and logging for debugging
