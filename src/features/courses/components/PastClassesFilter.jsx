import React, { useState, useEffect } from 'react';
import { validateFilters, hasActiveFilters } from '../utils/filterUtils';

/**
 * Renders a filter bar for past classes with manual apply and clear actions.
 * @param {object} props - The component props.
 * @param {Array} props.courses - The list of courses to populate the dropdown.
 * @param {object} props.activeFilters - The filters currently applied in the parent.
 * @param {Function} props.onApplyFilters - Callback to apply new filters.
 * @param {Function} props.onClearFilters - Callback to clear all filters.
 */
export default function PastClassesFilter({
  courses,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}) {
  // Local state to manage form inputs without triggering parent re-renders on every keystroke
  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state if the active filters from the parent are cleared externally
  useEffect(() => {
    setLocalFilters(activeFilters);
    setValidationErrors({});
  }, [activeFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const validation = validateFilters(localFilters);

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        if (error.includes('date')) {
          if (error.includes('Invalid date format')) {
            errors.date = 'Please enter a valid date';
          } else if (error.includes('cannot be more than 5 years')) {
            errors.date = error; // Use the specific error message
          } else {
            errors.date = 'Please enter a valid course start date';
          }
        } else if (error.includes('course')) {
          errors.courseId = 'Please select a valid course';
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      onApplyFilters(localFilters);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setValidationErrors({});
    onClearFilters();
  };

  const hasLocalChanges = () => {
    return Object.keys(localFilters).some((key) => localFilters[key] !== activeFilters[key]);
  };

  const hasActiveFiltersState = hasActiveFilters(activeFilters);

  return (
    <div className="filter-wrapper">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-header">
          <h4 className="filter-title">Filter Past Classes</h4>
          {hasActiveFiltersState && <span className="filter-badge">Filters Active</span>}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="courseId-filter" className="filter-label">
              Course
            </label>
            <select
              id="courseId-filter"
              name="courseId"
              value={localFilters.courseId}
              onChange={handleInputChange}
              className={`filter-input ${validationErrors.courseId ? 'error' : ''}`}
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
            {validationErrors.courseId && (
              <span className="error-message">{validationErrors.courseId}</span>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="date-filter" className="filter-label">
              Course Start Date
            </label>
            <input
              type="date"
              id="date-filter"
              name="date"
              placeholder="Select course start date"
              value={localFilters.date}
              onChange={handleInputChange}
              className={`filter-input ${validationErrors.date ? 'error' : ''}`}
            />
            {validationErrors.date && (
              <span className="error-message">{validationErrors.date}</span>
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="professor-filter" className="filter-label">
              Professor
            </label>
            <input
              type="text"
              id="professor-filter"
              name="professor"
              placeholder="e.g., Prof. Smith"
              value={localFilters.professor}
              onChange={handleInputChange}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button
            type="button"
            onClick={handleClear}
            className="filter-button clear-button"
            disabled={!hasActiveFiltersState}
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="filter-button apply-button"
            disabled={isSubmitting || !hasLocalChanges()}
          >
            {isSubmitting ? 'Applying...' : 'Apply Filters'}
          </button>
        </div>
      </form>
      <style jsx>{`
        .filter-wrapper {
          background-color: #cad2c5; /* Theme background */
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem; /* Reduced margin */
          animation: slideInFromBottom 0.6s ease-out;
        }
        .filter-form {
          display: flex;
          flex-direction: column;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .filter-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2f3e46; /* Dark text color */
        }
        .filter-badge {
          background-color: #52796f;
          color: #f0f2f0;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .filter-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        .filter-label {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3a5a40; /* Darker green from theme */
        }
        .filter-input {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #84a98c; /* Theme border color */
          background-color: #fdfdfd;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
          color: #2f3e46;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }
        .filter-input:focus {
          outline: none;
          border-color: #52796f; /* Active color */
          box-shadow: 0 0 0 3px rgba(82, 121, 111, 0.2);
        }
        .filter-input.error {
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
        }
        .error-message {
          color: #e74c3c;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        .filter-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #84a98c;
        }
        .filter-button {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        .apply-button {
          background-color: #52796f;
          color: #f0f2f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .apply-button:hover:not(:disabled) {
          background-color: #3a5a40;
          transform: translateY(-2px);
        }
        .clear-button {
          background-color: transparent;
          color: #3a5a40;
          border: 1px solid #52796f;
        }
        .clear-button:hover:not(:disabled) {
          background-color: rgba(82, 121, 111, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .filter-controls {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .filter-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          .filter-button {
            width: 100%;
          }
          .filter-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
