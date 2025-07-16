import React from 'react';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import CourseCard from '../../../componentShared/CourseCard';

export default function PastClassesList({ pastClasses, handleDeleteClass, isDeletingClass }) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const handleDeleteClick = (classId, classInfo) => {
    openConfirmation({
      title: 'Delete Past Class',
      message: `Are you sure you want to delete this past class${classInfo.title ? ` (${classInfo.title})` : ''}? This action cannot be undone.`,
      onConfirm: () => handleDeleteClass(classId),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  if (!pastClasses || pastClasses.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">You have no past classes.</p>
      </div>
    );
  }

  return (
    <>
      <div className="past-classes-list">
        {pastClasses.map((cls, idx) => {
          // Compose a course-like object for CourseCard
          const courseData = {
            _id: cls._id,
            title: cls.title || cls.code,
            code: cls.code,
            color: cls.color,
            professor: cls.professor,
            section: cls.section,
            schedule: [
              {
                weekDay: cls.date,
                time: `${cls.startTime || cls.from} - ${cls.endTime || cls.until}`,
              },
            ],
            room: cls.location || cls.room,
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
    </>
  );
}
