import React from 'react';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import CourseCard from '../../../componentShared/CourseCard';

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
      </div>
    );
  }

  return (
    <div className="courses-list">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isDeleting={isDeleting}
        />
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
