// src/features/goals/components/GoalForm.jsx
import React from 'react';
import { getAvailableCourses } from '../utils/goalUtils';
import styles from '@/styles/GoalForm.module.css';

const GoalForm = ({
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
  const availableCourses = getAvailableCourses(courses, goals);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            {editingId ? 'Course (Cannot be changed)' : 'Select Course'}
          </label>

          {editingId ? (
            <div className={styles.courseDisplay}>
              <div className={styles.courseName}>{editingCourse?.title || editingCourse?.name}</div>
              <div className={styles.courseDetails}>
                {editingCourse?.code}{' '}
                {editingCourse?.section && `• Section ${editingCourse.section}`}
              </div>
            </div>
          ) : (
            <select
              value={formData.courseId}
              onChange={(e) => onFormDataChange('courseId', e.target.value)}
              className={styles.formSelect}
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title || course.name} ({course.code})
                </option>
              ))}
            </select>
          )}

          {formErrors.courseId && <p className={styles.error}>{formErrors.courseId}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Target Grade (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.targetGrade}
            onChange={(e) => onFormDataChange('targetGrade', e.target.value)}
            className={styles.formInput}
            placeholder="Enter target grade (0-100)"
          />
          {formErrors.targetGrade && <p className={styles.error}>{formErrors.targetGrade}</p>}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.button} ${styles.buttonSecondary}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
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
