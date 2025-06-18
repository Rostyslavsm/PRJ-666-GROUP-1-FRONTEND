import React from 'react';
import { LoadingAnimation } from '../../animations';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';

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
      {courses.map((course) => (
        <div
          key={course._id}
          className="course-card"
          style={{ borderLeft: `5px solid ${course.color || '#cad2c5'}` }}
        >
          <div className="course-actions">
            <button className="edit-course-button" onClick={() => handleEdit(course)}>
              Edit
            </button>
            <button
              className="delete-course-button"
              onClick={() => handleDeleteClick(course)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
              ) : (
                'Delete'
              )}
            </button>
          </div>
          <div className="course-title-row">
            <h3 className="course-name">{course.title}</h3>
            <div
              className="course-code-badge"
              style={{ backgroundColor: course.color || '#cad2c5' }}
            >
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
      ))}

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
