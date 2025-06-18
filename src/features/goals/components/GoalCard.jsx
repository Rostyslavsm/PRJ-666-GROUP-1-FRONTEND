// src/features/goals/components/GoalCard.jsx
import React from 'react';
import { calculateProgress, getProgressColor } from '../utils/goalUtils';

const GoalCard = ({ goal, course, onEdit, onDelete, loading }) => {
  const progress = calculateProgress(course.currentGrade, goal.targetGrade);
  const progressColor = getProgressColor(progress);

  return (
    <div className="goals-card">
      <div className="goals-card-content">
        <div className="goals-card-header">
          <div>
            <h3 className="goals-card-title">{course.name}</h3>
            <p className="goals-card-subtitle">
              {course.code} • {course.department}
            </p>
          </div>
          <div className="goals-card-actions">
            <button
              onClick={() => onEdit(goal)}
              className="goals-action-button"
              title="Edit goal"
              disabled={loading}
            >
              <div className="goals-edit-icon"></div>
            </button>
            <button
              onClick={() => onDelete(goal._id)}
              className="goals-delete-button"
              title="Delete goal"
              disabled={loading}
            >
              <span className="goals-del-icon"></span>
            </button>
          </div>
        </div>

        <div className="goals-stats-grid">
          <div className="goals-stat-box">
            <p className="goals-stat-label">Current Grade</p>
            <p className="goals-stat-value">{course.currentGrade}%</p>
          </div>
          <div className="goals-stat-box">
            <p className="goals-stat-label">Target Grade</p>
            <p className="goals-stat-value goals-target-value">{goal.targetGrade}%</p>
          </div>
        </div>

        <div className="goals-progress-container">
          <div className="goals-progress-info">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="goals-progress-bar">
            <div
              className="goals-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor,
              }}
            ></div>
          </div>
        </div>

        <div className="goals-card-footer">
          <span>Created: {new Date(goal.dateCreated).toLocaleDateString()}</span>
          <div className="goals-status-indicator">
            <span className="goals-status-dot" style={{ backgroundColor: progressColor }}></span>
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
