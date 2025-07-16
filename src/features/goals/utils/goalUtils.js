// src/features/goals/utils/goalUtils.js
export const getAvailableCourses = (courses, goals) => {
  const coursesWithGoals = goals.map((goal) => goal.courseId._id || goal.courseId);
  return courses.filter((course) => !coursesWithGoals.includes(course._id));
};

// src/features/goals/utils/goalUtils.js
export const getCourseById = (courses, courseIdOrObject) => {
  // If courseIdOrObject is a full course object, return it directly
  if (typeof courseIdOrObject === 'object' && courseIdOrObject !== null) {
    return courseIdOrObject;
  }

  // Otherwise, treat it as a string ID and find in courses array
  return courses.find((course) => course._id === courseIdOrObject);
};
export const calculateProgress = (currentGrade, targetGrade, totalWeightSoFar, weightRemaining) => {
  // Handle edge cases
  if (currentGrade >= targetGrade) return 100;
  if (totalWeightSoFar <= 0) return 0;
  if (currentGrade === 0) return 0; // ⬅️ added safety check
  if (weightRemaining <= 0) return Math.round((currentGrade / targetGrade) * 100);

  const currentContribution = (currentGrade * totalWeightSoFar) / 100;
  const neededFromRemaining = targetGrade - currentContribution;
  const requiredRemainingGrade = (neededFromRemaining * 100) / weightRemaining;

  // Prevent division by zero
  if (requiredRemainingGrade === 0) return 100;

  const progress = (currentGrade / requiredRemainingGrade) * 100;
  return Math.min(Math.round(progress), 100);
};

export const getProgressColor = (progress) => {
  if (progress === 0) return '#000000';
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
