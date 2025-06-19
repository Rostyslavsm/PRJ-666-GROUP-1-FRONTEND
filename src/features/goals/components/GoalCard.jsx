// src/features/goals/components/GoalCard.jsx
import React from 'react';
import CourseCard from '@/componentShared/CourseCard';
import { calculateProgress, getProgressColor } from '../utils/goalUtils';
import styles from '@/styles/GoalCard.module.css';

const GoalCard = ({ goal, onEdit, onDelete, disabled }) => {
  const course = goal.course || {};

  const currentGrade = course.currentGrade || {};

  // Handle NaN values with default values
  const avg = isNaN(currentGrade.avg) ? 0 : (currentGrade.avg ?? 0);
  const totalWeightSoFar = isNaN(currentGrade.totalWeightSoFar)
    ? 0
    : (currentGrade.totalWeightSoFar ?? 0);
  const weightRemaining = isNaN(currentGrade.weightRemaining)
    ? 100
    : (currentGrade.weightRemaining ?? 100);

  const progress = calculateProgress(avg, goal.targetGrade, totalWeightSoFar, weightRemaining);
  const progressColor = getProgressColor(progress);

  // Format numbers to prevent NaN display
  const formatNumber = (num) => {
    return isNaN(num) ? 0 : Math.round(num);
  };

  // Prepare the course data with goal-specific information
  const courseWithGoalData = {
    ...course,
    // Override the current grade to show target grade info with NaN handling
    currentGrade: {
      avg: formatNumber(avg),
      totalWeightSoFar: formatNumber(totalWeightSoFar),
      weightRemaining: formatNumber(weightRemaining),
      targetGrade: goal.targetGrade,
      progress: formatNumber(progress),
    },
  };

  // Custom content to add to the CourseCard
  const goalContent = (
    <div className={styles.goalProgressContainer}>
      <div className={styles.progressInfo}>
        <span className={styles.progressLabel}>
          Progress toward target ({formatNumber(goal.targetGrade)}%)
        </span>
        <span className={styles.progressValue}>{formatNumber(progress)}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${isNaN(progress) ? 0 : progress}%`,
            backgroundColor: progressColor,
          }}
        ></div>
      </div>

      <div className={styles.weightIndicator}>
        <div
          className={styles.weightCompleted}
          style={{ width: `${formatNumber(totalWeightSoFar)}%` }}
        ></div>
        <div
          className={styles.weightRemaining}
          style={{ width: `${formatNumber(weightRemaining)}%` }}
        ></div>
      </div>

      <div className={styles.targetInfo}>
        <span>Completed: {formatNumber(totalWeightSoFar)}%</span>
        <span>Remaining: {formatNumber(weightRemaining)}%</span>
      </div>

      <div className={styles.statusIndicator}>
        <span className={styles.statusDot} style={{ backgroundColor: progressColor }}></span>
        {progress === 0
          ? 'Good luck!'
          : progress >= 90
            ? 'Excellent progress'
            : progress >= 70
              ? 'Good progress'
              : progress >= 50
                ? 'Needs improvement'
                : 'Critical - needs attention'}
      </div>
    </div>
  );

  return (
    <CourseCard
      course={courseWithGoalData}
      onEdit={() => onEdit(goal)}
      onDelete={() => onDelete(goal._id)}
      isDeleting={disabled}
      customStyles={{ marginBottom: '1rem' }}
      eventButtons={goalContent}
    />
  );
};

export default GoalCard;
