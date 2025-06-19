// src/features/goals/components/ErrorState.jsx
import React from 'react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="goals-error-state">
      <div className="goals-error-icon">!</div>
      <h3 className="goals-error-title">Error Loading Data</h3>
      <p className="goals-error-text">{error}</p>
      <button onClick={onRetry} className="goals-button goals-button-primary">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
