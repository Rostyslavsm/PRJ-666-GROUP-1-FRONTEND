// src/features/goals/components/GoalCard.jsx
import React from 'react';
import { calculateProgress, getProgressColor } from '../utils/goalUtils';
import { Edit, Trash2 } from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete, loading }) => {
  // alert(JSON.stringify(goal.course));
  const course = goal.course || {};

  const currentGrade = course.currentGrade || {};
  const avg = currentGrade.avg ?? 0;
  const totalWeightSoFar = currentGrade.totalWeightSoFar ?? 0;
  const weightRemaining = currentGrade.weightRemaining ?? 100;

  const progress = calculateProgress(avg, goal.targetGrade, totalWeightSoFar, weightRemaining);
  const progressColor = getProgressColor(progress);

  return (
    <div className="goals-card">
      <div className="goals-card-content">
        <div className="goals-card-header">
          <div>
            <h3 className="goals-card-title">{course.title || 'Untitled Course'}</h3>
            <p className="goals-card-subtitle">{course.code || 'N/A'}</p>
          </div>
          <div className="goals-card-actions">
            <button onClick={() => onEdit(goal)} disabled={loading}>
              <Edit size={16} />
            </button>
            <button onClick={() => onDelete(goal._id)} disabled={loading}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <div className="goals-stats-grid">
          <div className="goals-stat-box">
            <p className="goals-stat-label">Current Grade</p>
            <p className="goals-stat-value">{avg}%</p>
            <p className="goals-stat-note">
              <span>✅</span> {totalWeightSoFar}% completed
            </p>
          </div>
          <div className="goals-stat-box">
            <p className="goals-stat-label">Target Grade</p>
            <p className="goals-stat-value goals-target-value">{goal.targetGrade}%</p>
            <p className="goals-stat-note">
              <span>⏳</span> {weightRemaining}% remaining
            </p>
          </div>
        </div>

        <div className="goals-progress-container">
          <div className="goals-progress-info">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="goals-progress-bar">
            <div
              className="goals-progress-fill"
              style={{ width: `${progress}%`, backgroundColor: progressColor }}
            ></div>
          </div>
          <div className="goals-weight-indicator">
            <span style={{ width: `${totalWeightSoFar}%` }}></span>
            <span style={{ width: `${weightRemaining}%` }}></span>
          </div>
        </div>

        <div className="goals-card-footer">
          <span>Created: {new Date(goal.dateCreated).toLocaleDateString()}</span>
          <div className="goals-status-indicator">
            <span className="goals-status-dot" style={{ backgroundColor: progressColor }}></span>
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
      </div>
    </div>
  );
};

export default GoalCard;
