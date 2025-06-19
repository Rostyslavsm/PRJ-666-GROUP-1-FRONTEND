import React, { useState } from 'react';
import CourseCard from '../../../componentShared/CourseCard';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import { LoadingAnimation } from '../../animations';
import DeleteButton from '../../../componentShared/DeleteButton';
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
  isSavingGrade = false,
}) {
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [gradeValue, setGradeValue] = useState(task.grade || '');
  const [error, setError] = useState('');

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

  const handleGradeButtonClick = (e) => {
    e.stopPropagation();
    setIsEditingGrade(true);
  };

  const handleGradeChange = (e) => {
    setGradeValue(e.target.value);
    setError('');
  };

  const handleGradeSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const value = gradeValue.trim();

    if (!/^\d+$/.test(value)) {
      setError('Enter a whole number');
      return;
    }

    const number = parseInt(value, 10);
    if (number < 0 || number > 100) {
      setError('Must be between 0 and 100');
      return;
    }

    setError('');
    onSetGrade(task.id || task._id, number);
    setIsEditingGrade(false);
  };

  const handleGradeCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingGrade(false);
    setGradeValue(task.grade || '');
    setError('');
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
    grade: undefined, // We'll handle grade display ourselves
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

  // Custom actions for delete button
  const eventActions = (
    <>
      {isDeletable && (
        <DeleteButton
          onClick={handleDeleteClick}
          isLoading={isDeleting}
          disabled={isUpdating || isDeleting}
          title="Delete event"
        />
      )}
    </>
  );

  // Event buttons that will be inserted between title and schedule
  const eventButtons = (
    <div className={styles['event-buttons-container']}>
      {isCompletable && (
        <button
          className={styles['event-action-button']}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
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
          {isEditingGrade ? (
            <div className={styles['event-grade-edit-container']}>
              <div className={styles['event-grade-input-row']}>
                <input
                  id={`grade-${courseData._id}`}
                  type="text"
                  min="0"
                  max="100"
                  value={gradeValue}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleGradeChange}
                  className={styles['event-grade-input']}
                  disabled={isUpdating || isDeleting || isSavingGrade}
                  autoFocus
                  placeholder="0-100"
                />
                <span className={styles['percent-sign']}>%</span>
              </div>

              {error && <div className={styles['event-grade-error']}>{error}</div>}

              <div className={styles['event-grade-actions']}>
                <button
                  type="button"
                  onClick={handleGradeSave}
                  className={styles['event-grade-button']}
                  disabled={isUpdating || isDeleting || isSavingGrade}
                >
                  {isSavingGrade ? (
                    <div className={styles['button-loading']}>
                      <LoadingAnimation size="small" style={{ width: 16, height: 16 }} />
                      <span>Saving</span>
                    </div>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGradeCancel}
                  className={`${styles['event-grade-button']} ${styles['event-grade-cancel']}`}
                  disabled={isUpdating || isDeleting || isSavingGrade}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className={styles['event-action-button']}
              onClick={handleGradeButtonClick}
              disabled={isUpdating || isDeleting}
            >
              {task.grade !== undefined && task.grade !== null
                ? `Grade: ${task.grade}%`
                : 'Set Grade'}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <CourseCard course={courseData} actions={eventActions} eventButtons={eventButtons} />

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
