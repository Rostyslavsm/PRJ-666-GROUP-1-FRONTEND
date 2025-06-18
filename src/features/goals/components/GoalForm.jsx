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
    <div className="gradegoals-form-container">
      <h2 className="gradegoals-form-title">{editingId ? 'Edit Goal' : 'Create New Goal'}</h2>
      <form onSubmit={onSubmit}>
        <div className="gradegoals-form-group">
          <label className="gradegoals-form-label">
            {editingId ? 'Course (Cannot be changed)' : 'Select Course'}
          </label>

          {editingId ? (
            <div className="gradegoals-course-display">
              <div className="gradegoals-course-name">{editingCourse?.name}</div>
              <div className="gradegoals-course-details">
                {editingCourse?.code} • {editingCourse?.department}
              </div>
            </div>
          ) : (
            <select
              value={formData.courseId}
              onChange={(e) => onFormDataChange('courseId', e.target.value)}
              className="gradegoals-form-select"
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          )}

          {formErrors.courseId && <p className="gradegoals-error">{formErrors.courseId}</p>}
        </div>

        <div className="gradegoals-form-group">
          <label className="gradegoals-form-label">Target Grade (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.targetGrade}
            onChange={(e) => onFormDataChange('targetGrade', e.target.value)}
            className="gradegoals-form-input"
            placeholder="Enter target grade (0-100)"
          />
          {formErrors.targetGrade && <p className="gradegoals-error">{formErrors.targetGrade}</p>}
        </div>

        <div className="gradegoals-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="gradegoals-button gradegoals-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="gradegoals-button gradegoals-button-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : editingId ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
