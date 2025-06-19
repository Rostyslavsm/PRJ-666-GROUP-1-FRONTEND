import { secondsToTime } from './timeUtils';

/**
 * Transform classes data for display in the UI
 * @param {Array} classes - Raw classes data from API
 * @param {Array} courses - Courses data for reference
 * @returns {Array} - Transformed classes data grouped by date
 */
export function transformClasses(classes, courses) {
  const courseMap = {};
  courses.forEach((c) => {
    courseMap[c._id] = {
      title: c.title,
      code: c.code,
      professor: c.instructor?.name,
      color: c.color,
    };
  });

  const dayMap = {};
  classes.forEach((cls) => {
    const start = new Date(cls.startTime);
    const dateStr = start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
    });

    if (!dayMap[dateStr]) {
      dayMap[dateStr] = [];
    }

    const courseInfo = courseMap[cls.courseId] || {};

    // Format times correctly
    let fromTime, untilTime;
    try {
      // For ISO date strings
      if (typeof cls.startTime === 'string' && cls.startTime.includes('T')) {
        fromTime = new Date(cls.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        untilTime = new Date(cls.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      // For seconds-based time
      else if (typeof cls.startTime === 'number') {
        fromTime = secondsToTime(cls.startTime);
        untilTime = secondsToTime(cls.endTime);
      }
      // Fallback
      else {
        fromTime = 'Unknown';
        untilTime = 'Unknown';
      }
    } catch (error) {
      console.error('❌ Error formatting class time:', error);
      fromTime = 'Error';
      untilTime = 'Error';
    }

    dayMap[dateStr].push({
      id: cls._id, // Save the class ID for delete operations
      from: fromTime,
      until: untilTime,
      room: cls.location || 'TBD',
      type: cls.classType,
      title: courseInfo.title,
      code: courseInfo.code,
      section: 'A',
      professor: courseInfo.professor,
      events: '',
      color: courseInfo.color,
    });
  });

  return Object.entries(dayMap).map(([date, sessions]) => ({ date, sessions }));
}
