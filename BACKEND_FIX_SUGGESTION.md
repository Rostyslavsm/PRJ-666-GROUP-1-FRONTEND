# Backend Fix for Archived Courses Issue

## Problem Identified

The backend `getCourses` function in `course.controller.js` has a logic issue when `past=true` is used.

### Current Backend Logic (Problematic):

```javascript
async function getCourses(userId, active = true, past = false) {
  // This line is the problem when past=true
  let courses = await Course.find({ userId, status: active ? 'active' : 'inactive' });

  const today = new Date();

  if (past) {
    // This only filters courses that are already marked as 'inactive'
    courses = courses.filter((course) => course.endDate < today);
  }
  // ...
}
```

### The Issue:

When `past=true`, the `active` parameter becomes `false`, so the query becomes:

```javascript
Course.find({ userId, status: 'inactive' });
```

This means it only looks for courses that are already marked as 'inactive' in the database, but courses that have ended might still be marked as 'active' if they haven't been updated yet.

## Suggested Backend Fix:

```javascript
async function getCourses(userId, active = true, past = false) {
  logger.info(`Fetching courses for user ${userId} with active status: ${active}, past: ${past}`);

  try {
    let courses;
    const today = new Date();

    if (past) {
      // For past courses, get ALL courses and filter by end date
      courses = await Course.find({ userId });
      courses = courses.filter((course) => course.endDate < today);
      logger.info(`Filtered to ${courses.length} past courses for user ${userId}`);
    } else {
      // For active courses, use the original logic
      courses = await Course.find({ userId, status: active ? 'active' : 'inactive' });

      if (active == true) {
        const courseIdsToUpdate = [];

        logger.info(`Checking ${courses.length} active courses for end dates`);
        courses = courses.filter((course) => {
          logger.debug(`Checking if course ${course._id} is still active`);

          if (course.endDate < today) {
            courseIdsToUpdate.push(course._id);
            logger.debug(`Course ${course._id} marked as inactive due to end date`);
            return false;
          }

          return true;
        });

        try {
          await Course.updateMany({ _id: { $in: courseIdsToUpdate } }, { status: 'inactive' });
          logger.info(`Updated ${courseIdsToUpdate.length} courses to inactive status`);
        } catch (err) {
          logger.error({ err }, 'Error updating courses to inactive status');
          return { success: false, status: 500, errors: ['Internal server error'] };
        }
      }
    }

    logger.info(`Fetched ${courses.length} courses for user ${userId}`);
    logger.debug({ courses }, 'Courses fetched from database');

    // Fetching Grades for each course
    logger.debug(`Fetching current grades for user ${userId} with active status: ${active}`);
    // Fetching all grades for the current courses
    courses = await getCoursesWithGrades(courses, userId);
    return { success: true, courses };
  } catch (err) {
    logger.error({ err }, 'Error fetching courses from database');
    return { success: false, status: 500, errors: ['Internal server error'] };
  }
}
```

## Alternative Fix (If you want to keep the status-based approach):

If you prefer to keep using the status field, you could modify the query to include both active and inactive courses when `past=true`:

```javascript
let courses;
if (past) {
  // For past courses, get both active and inactive courses
  courses = await Course.find({ userId });
} else {
  // For non-past courses, use status filter
  courses = await Course.find({ userId, status: active ? 'active' : 'inactive' });
}
```

## Testing the Fix:

1. Create a course with an end date in the past
2. Call `GET /api/v1/courses?past=true`
3. Verify that the course appears in the response
4. Check the frontend archived courses tab

## Frontend Changes Made:

1. ✅ Fixed API endpoints to use `/v1/courses` and `/v1/classes`
2. ✅ Added debugging to track archived courses data
3. ✅ Updated all service files to use correct endpoints

The frontend should now work correctly once the backend fix is applied.
