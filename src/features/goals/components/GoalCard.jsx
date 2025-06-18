// src/features/goals/components/GoalCard.jsx
import React from 'react';
import { calculateProgress, getProgressColor } from '../utils/goalUtils';

const GoalCard = ({ goal, course, onEdit, onDelete, loading }) => {
  const progress = calculateProgress(course.currentGrade, goal.targetGrade);
  const progressColor = getProgressColor(progress);

  return (
    <div className="gradegoals-card">
      <div className="gradegoals-card-content">
        <div className="gradegoals-card-header">
          <div>
            <h3 className="gradegoals-card-title">{course.name}</h3>
            <p className="gradegoals-card-subtitle">
              {course.code} • {course.department}
            </p>
          </div>
          <div className="gradegoals-card-actions">
            <button
              onClick={() => onEdit(goal)}
              className="gradegoals-action-button"
              title="Edit goal"
              disabled={loading}
            >
              <div className="gradegoals-edit-icon"></div>
            </button>
            <button
              onClick={() => onDelete(goal._id)}
              className="gradegoals-delete-button"
              title="Delete goal"
              disabled={loading}
            >
              <span className="gradegoals-del-icon"></span>
            </button>
          </div>
        </div>

        <div className="gradegoals-stats-grid">
          <div className="gradegoals-stat-box">
            <p className="gradegoals-stat-label">Current Grade</p>
            <p className="gradegoals-stat-value">{course.currentGrade}%</p>
          </div>
          <div className="gradegoals-stat-box">
            <p className="gradegoals-stat-label">Target Grade</p>
            <p className="gradegoals-stat-value gradegoals-target-value">{goal.targetGrade}%</p>
          </div>
        </div>

        <div className="gradegoals-progress-container">
          <div className="gradegoals-progress-info">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="gradegoals-progress-bar">
            <div
              className="gradegoals-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
        </div>

        <div className="gradegoals-card-footer">
          <span>Created: {new Date(goal.dateCreated).toLocaleDateString()}</span>
          <div className="gradegoals-status-indicator">
            <span
              className="gradegoals-status-dot"
              style={{ backgroundColor: progressColor }}
            ></span>
            {progress >= 90
              ? 'Excellent progress'
              : progress >= 70
                ? 'Good progress'
                : progress >= 50
                  ? 'Needs improvement'
                  : 'Critical - needs attention'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
