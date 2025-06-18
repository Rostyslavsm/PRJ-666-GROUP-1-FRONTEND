// src/features/goals/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="gradegoals-loading">
      <div className="gradegoals-spinner"></div>
      <p>Loading your goals...</p>
    </div>
  );
};

export default LoadingState;
