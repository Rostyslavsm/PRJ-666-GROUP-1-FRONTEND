/**
 * Courses module exports
 * This file centralizes all courses-related exports
 */

// Hooks
export { useCourseSubmit } from './hooks/useCourseSubmit';
export { useClassDelete } from './hooks/useClassDelete';
export { useCourseDeletion } from './hooks/useCourseDeletion';
export { useCourseEdit } from './hooks/useCourseEdit';
export { useCourses } from './hooks/useCourses';

// Components
export { default as CoursesContainer } from './components/CoursesContainer';
export { default as CourseForm } from './components/CourseForm';
export { default as CoursesList } from './components/CoursesList';
export { default as ClassesList } from './components/ClassesList';
export { default as PastClassesList } from './components/PastClassesList';
export { default as ArchivedCoursesList } from './components/ArchivedCoursesList';

// Utilities
export {
  convertToSeconds,
  convertToUTCSeconds,
  secondsToTime,
  getWeekday,
  weekdayToIndex,
} from './utils/timeUtils';
export { transformClasses } from './utils/classUtils';
