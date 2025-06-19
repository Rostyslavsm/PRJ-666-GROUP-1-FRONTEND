// src/features/goals/components/EmptyState.jsx
import React from 'react';

const EmptyState = ({ courses, onAddGoal }) => {
  return (
    <div className="goals-empty-state">
      <div className="goals-empty-icon">
        <div className="goals-document-icon"></div>
      </div>
      <h3 className="goals-empty-title">No Goals Set Yet</h3>
      <p className="goals-empty-text">Start by setting a goal for one of your courses.</p>
      <button
        onClick={onAddGoal}
        disabled={courses.length === 0}
        className={`goals-button ${
          courses.length === 0 ? 'goals-button-disabled' : 'goals-button-primary'
        }`}
      >
        {courses.length === 0 ? 'No Courses Available' : 'Create Your First Goal'}
      </button>
    </div>
  );
};

export default EmptyState;
