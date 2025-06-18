// src/features/goals/components/EmptyState.jsx
import React from 'react';

const EmptyState = ({ courses, onAddGoal }) => {
  return (
    <div className="gradegoals-empty-state">
      <div className="gradegoals-empty-icon">
        <div className="gradegoals-document-icon"></div>
      </div>
      <h3 className="gradegoals-empty-title">No Goals Set Yet</h3>
      <p className="gradegoals-empty-text">Start by setting a goal for one of your courses.</p>
      <button
        onClick={onAddGoal}
        disabled={courses.length === 0}
        className={`gradegoals-button ${
          courses.length === 0 ? 'gradegoals-button-disabled' : 'gradegoals-button-primary'
        }`}
      >
        {courses.length === 0 ? 'No Courses Available' : 'Create Your First Goal'}
      </button>
    </div>
  );
};

export default EmptyState;
