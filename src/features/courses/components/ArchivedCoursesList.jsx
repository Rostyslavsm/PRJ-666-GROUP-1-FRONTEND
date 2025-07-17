import React from 'react';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import CourseCard from '../../../componentShared/CourseCard';

export default function ArchivedCoursesList({ archivedCourses, handleDelete, isDeleting }) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const handleDeleteClick = (course) => {
    openConfirmation({
      title: 'Delete Archived Course',
      message: `Are you sure you want to delete the archived course "${course.title}" (${course.code})? This will also delete all associated classes and assignments. This action cannot be undone.`,
      onConfirm: () => handleDelete(course._id),
      confirmText: 'Delete Course',
      cancelText: 'Cancel',
    });
  };

  if (!archivedCourses || archivedCourses.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">You have no archived courses.</p>
      </div>
    );
  }

  return (
    <div className="courses-list">
      {archivedCourses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onDelete={() => handleDeleteClick(course)}
          isDeleting={isDeleting}
        />
      ))}
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
