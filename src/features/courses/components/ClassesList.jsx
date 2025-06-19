import React from 'react';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import CourseCard from '../../../componentShared/CourseCard';

export default function ClassesList({ schedule, handleDeleteClass, isDeletingClass }) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const handleDeleteClick = (classId, classInfo) => {
    openConfirmation({
      title: 'Delete Class',
      message: `Are you sure you want to delete this ${classInfo.type || ''} class${classInfo.code ? ` for ${classInfo.code}` : ''}? This action cannot be undone.`,
      onConfirm: () => handleDeleteClass(classId),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  if (schedule.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">You don't have any classes scheduled.</p>
      </div>
    );
  }

  return (
    <>
      {schedule.map(({ date, sessions }) => (
        <div key={date} className="class-group">
          <h4 className="class-group-title">{date}</h4>
          <div className="session-container">
            {sessions.map((session, idx) => {
              // Convert session data to course-like structure for CourseCard
              const courseData = {
                _id: session.id,
                title: session.title || session.code,
                code: session.code,
                color: session.color,
                professor: session.professor,
                section: session.section,
                schedule: [
                  {
                    weekDay: session.type || 'Class',
                    time: `${session.from} - ${session.until}`,
                  },
                ],
                // Additional custom data for sessions
                room: session.room,
              };

              return (
                <CourseCard
                  key={`${session.code}-${idx}`}
                  course={courseData}
                  onDelete={(course) => handleDeleteClick(course._id, course)}
                  isDeleting={isDeletingClass}
                  customStyles={
                    {
                      // Optionally add any session-specific styling here
                    }
                  }
                />
              );
            })}
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
    </>
  );
}
