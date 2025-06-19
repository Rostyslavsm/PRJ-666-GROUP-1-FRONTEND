import React from 'react';
import { LoadingAnimation } from '../../animations';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import DeleteButton from '../../../componentShared/DeleteButton';

// Helper function to convert hex color to RGB values
const hexToRgb = (hex) => {
  // Remove the # if present
  const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;

  // Parse the hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Return as string "r, g, b"
  return `${r}, ${g}, ${b}`;
};

export default function CoursesList({ courses, handleAdd, handleEdit, handleDelete, isDeleting }) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const handleDeleteClick = (course) => {
    openConfirmation({
      title: 'Delete Course',
      message: `Are you sure you want to delete the course "${course.title}" (${course.code})? This will also delete all associated classes and assignments. This action cannot be undone.`,
      onConfirm: () => handleDelete(course._id),
      confirmText: 'Delete Course',
      cancelText: 'Cancel',
    });
  };

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">You haven't added any courses yet.</p>
        <button className="add-course-button" onClick={handleAdd}>
          + Add Course
        </button>
      </div>
    );
  }

  return (
    <div className="courses-list">
      {courses.map((course) => {
        const courseColor = course.color || '#52796f';
        const rgbColor = hexToRgb(courseColor);

        return (
          <div
            key={course._id}
            className="course-card"
            style={{
              borderLeft: `5px solid ${courseColor}`,
              '--schedule-item-color': rgbColor,
            }}
          >
            <div className="course-actions">
              <button className="edit-course-button" onClick={() => handleEdit(course)}>
                Edit
              </button>
              <DeleteButton
                onClick={() => handleDeleteClick(course)}
                isLoading={isDeleting}
                disabled={isDeleting}
                title="Delete course"
              />
            </div>
            <div className="course-title-row">
              <h3 className="course-name">{course.title}</h3>
              <div className="course-code-badge" style={{ backgroundColor: courseColor }}>
                {course.code}
              </div>
            </div>
            <div className="course-metadata">
              <div>
                <span className="course-label">Professor:</span> {course.professor}
              </div>
            </div>
            <h4 className="schedule-heading">Schedule</h4>
            <div className="course-schedule">
              {course.schedule.map((s, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-day">{s.weekDay}</div>
                  <div className="schedule-time">{s.time}</div>
                </div>
              ))}
            </div>
            <div className="course-grade">
              <span className="course-label">Current grade:</span> {course.grade}
            </div>
          </div>
        );
      })}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        title={confirmationData.title}
        message={confirmationData.message}
        confirmText={confirmationData.confirmText}
        cancelText={confirmationData.cancelText}
        onConfirm={confirmationData.onConfirm}
      />
    </div>
  );
}
