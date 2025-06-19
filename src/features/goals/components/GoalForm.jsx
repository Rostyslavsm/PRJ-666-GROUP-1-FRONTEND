// src/features/goals/components/GoalForm.jsx
import React from 'react';
import { getAvailableCourses, getCourseById } from '../utils/goalUtils';

const GoalForm = ({
  showForm,
  formData,
  formErrors,
  editingId,
  editingCourse,
  courses,
  goals,
  onFormDataChange,
  onCancel,
  onSubmit,
  loading,
}) => {
  if (!showForm) return null;

  const availableCourses = getAvailableCourses(courses, goals);

  return (
    <div className="goals-form-container">
      <h2 className="goals-form-title">{editingId ? 'Edit Goal' : 'Create New Goal'}</h2>
      <form onSubmit={onSubmit}>
        <div className="goals-form-group">
          <label className="goals-form-label">
            {editingId ? 'Course (Cannot be changed)' : 'Select Course'}
          </label>

          {editingId ? (
            <div className="goals-course-display">
              <div className="goals-course-name">{editingCourse?.name}</div>
              <div className="goals-course-details">
                {editingCourse?.code} • {editingCourse?.department}
              </div>
            </div>
          ) : (
            <select
              value={formData.courseId}
              onChange={(e) => onFormDataChange('courseId', e.target.value)}
              className="goals-form-select"
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          )}

          {formErrors.courseId && <p className="goals-error">{formErrors.courseId}</p>}
        </div>

        <div className="goals-form-group">
          <label className="goals-form-label">Target Grade (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.targetGrade}
            onChange={(e) => onFormDataChange('targetGrade', e.target.value)}
            className="goals-form-input"
            placeholder="Enter target grade (0-100)"
          />
          {formErrors.targetGrade && <p className="goals-error">{formErrors.targetGrade}</p>}
        </div>

        <div className="goals-form-actions">
          <button type="button" onClick={onCancel} className="goals-button goals-button-secondary">
            Cancel
          </button>
          <button type="submit" className="goals-button goals-button-primary" disabled={loading}>
            {loading ? 'Processing...' : editingId ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
