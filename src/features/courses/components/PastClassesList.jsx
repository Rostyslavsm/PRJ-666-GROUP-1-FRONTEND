import React from 'react';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import CourseCard from '../../../componentShared/CourseCard';

export default function PastClassesList({
  pastClasses,
  handleDeleteClass,
  isDeletingClass,
  filtersApplied, // Receive the new prop to know if filters are active
}) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const handleDeleteClick = (classId, classInfo) => {
    openConfirmation({
      title: 'Delete Past Class',
      message: `Are you sure you want to delete this past class${
        classInfo.title ? ` (${classInfo.title})` : ''
      }? This action cannot be undone.`,
      onConfirm: () => handleDeleteClass(classId),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  // Display results count if filters are applied
  const renderResultsCount = () => {
    if (filtersApplied) {
      return (
        <div className="filter-results-count">
          {pastClasses.length === 0
            ? 'No classes found matching your filters'
            : `${pastClasses.length} class${pastClasses.length === 1 ? '' : 'es'} found`}
        </div>
      );
    }
    return null;
  };

  if (!pastClasses || pastClasses.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">
          {/* Display a different message based on whether filters are active */}
          {filtersApplied
            ? 'No past classes match the current filters.'
            : 'You have no past classes.'}
        </p>
      </div>
    );
  }

  return (
    <div className="past-classes-container">
      {renderResultsCount()}
      <div className="courses-list">
        {pastClasses.map((cls, idx) => {
          // Compose a course-like object for CourseCard using the transformed data
          const courseData = {
            _id: cls._id,
            title: cls.title,
            code: cls.code,
            color: cls.color,
            professor: cls.professor,
            section: cls.section,
            schedule: [
              {
                weekDay: cls.date,
                time: `${cls.startTime} - ${cls.endTime}`,
                classType: cls.classType,
                location: cls.location,
              },
            ],
            room: cls.location,
            topics: cls.topics,
          };
          return (
            <CourseCard
              key={cls._id || idx}
              course={courseData}
              onDelete={() => handleDeleteClick(cls._id, courseData)}
              isDeleting={isDeletingClass}
            />
          );
        })}
      </div>
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
