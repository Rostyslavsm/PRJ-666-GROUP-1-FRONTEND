// src/features/goals/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="goals-loading">
      <div className="goals-spinner"></div>
      <p>Loading your goals...</p>
    </div>
  );
};

export default LoadingState;
