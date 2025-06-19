import React from 'react';
import CourseCard from '../../../componentShared/CourseCard';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import { LoadingAnimation } from '../../animations';
import styles from '../../../styles/EventCardAdapter.module.css';

/**
 * Adapter component that wraps CourseCard for use with events
 */
function EventCardAdapter({
  task,
  onToggle,
  onSetGrade,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) {
  const { isConfirmationOpen, confirmationData, openConfirmation, closeConfirmation } =
    useConfirmation();

  const isCompletable = !task.isCompleted && typeof onToggle === 'function';
  const isGradable = task.isCompleted && typeof onSetGrade === 'function';
  const isDeletable = typeof onDelete === 'function';

  // Format the due date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDeleteClick = () => {
    openConfirmation({
      title: 'Delete Event',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      onConfirm: () => onDelete(task.id || task._id),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  // Convert task to course format expected by CourseCard
  const courseData = {
    _id: task.id || task._id,
    title: task.title,
    code: task.type || 'Event',
    color: task.color || '#52796f',
    // Custom properties for events
    description: task.description,
    weight: task.weight,
    dueDate: task.dueDate,
    isCompleted: task.isCompleted,
    grade: task.grade,
    // Format the schedule data
    schedule: [
      {
        weekDay: 'Due',
        time: formatDate(task.dueDate),
      },
    ],
  };

  // Add weight to schedule if it exists
  if (task.weight) {
    courseData.schedule.push({
      weekDay: 'Weight',
      time: `${task.weight}%`,
    });
  }

  // Custom actions for events (mark as done/grade)
  const eventActions = (
    <>
      {isCompletable && (
        <button
          className={styles['event-action-button']}
          onClick={onToggle}
          disabled={isUpdating || isDeleting}
        >
          {isUpdating ? (
            <div className={styles['button-loading']}>
              <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
              <span>Updating</span>
            </div>
          ) : (
            'Mark as Done'
          )}
        </button>
      )}
      {isGradable && (
        <div className={styles['event-grade-container']}>
          <label htmlFor={`grade-${courseData._id}`} className={styles['event-grade-label']}>
            Grade:
          </label>
          <input
            id={`grade-${courseData._id}`}
            type="number"
            min="0"
            max="100"
            value={courseData.grade || ''}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSetGrade(courseData._id, e.target.value)}
            className={styles['event-grade-input']}
            disabled={isUpdating || isDeleting}
          />
        </div>
      )}
    </>
  );

  return (
    <>
      <CourseCard
        course={courseData}
        onDelete={handleDeleteClick}
        isDeleting={isDeleting}
        actions={
          <>
            {eventActions}
            {isDeletable && !isGradable && !isCompletable && (
              <div className={styles['event-actions-right']}>
                <button
                  className={styles['event-delete-button']}
                  onClick={handleDeleteClick}
                  disabled={isUpdating || isDeleting}
                  title="Delete event"
                >
                  {isDeleting ? (
                    <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            )}
          </>
        }
        customStyles={{
          backgroundColor: task.isCompleted ? '#e8f5e9' : '#fff',
        }}
      />

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

export default EventCardAdapter;
