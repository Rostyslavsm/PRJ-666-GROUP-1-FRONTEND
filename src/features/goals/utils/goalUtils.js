// src/features/goals/utils/goalUtils.js
export const getAvailableCourses = (courses, goals) => {
  const coursesWithGoals = goals.map((goal) => goal.courseId._id || goal.courseId);
  return courses.filter((course) => !coursesWithGoals.includes(course._id));
};

export const getCourseById = (courses, courseId) => {
  if (typeof courseId === 'object') {
    return courseId; // Already expanded course object
  }
  return courses.find((course) => course._id === courseId);
};

export const calculateProgress = (currentGrade, targetGrade) => {
  if (currentGrade >= targetGrade) return 100;
  return Math.round((currentGrade / targetGrade) * 100);
};

export const getProgressColor = (progress) => {
  if (progress >= 90) return '#10B981'; // Green
  if (progress >= 70) return '#FBBF24'; // Yellow
  if (progress >= 50) return '#F97316'; // Orange
  return '#EF4444'; // Red
};

export const validateGoalForm = (formData, editingId) => {
  const errors = {};

  if (!formData.courseId && !editingId) {
    errors.courseId = 'Please select a course';
  }

  if (!formData.targetGrade) {
    errors.targetGrade = 'Target grade is required';
  } else {
    const target = parseFloat(formData.targetGrade);
    if (isNaN(target)) {
      errors.targetGrade = 'Please enter a valid number';
    } else if (target < 0 || target > 100) {
      errors.targetGrade = 'Grade must be between 0 and 100';
    }
  }

  return errors;
};
