// src/features/goals/components/ErrorState.jsx
import React from 'react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="gradegoals-error-state">
      <div className="gradegoals-error-icon">!</div>
      <h3 className="gradegoals-error-title">Error Loading Data</h3>
      <p className="gradegoals-error-text">{error}</p>
      <button onClick={onRetry} className="gradegoals-button gradegoals-button-primary">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
