import React from 'react';
import { LoadingAnimation } from '../../animations';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import DeleteButton from '../../../componentShared/DeleteButton';

function EventCard({
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

  // Use the event's color or default to the theme color
  const eventColor = task.color || '#52796f';

  const handleDeleteClick = () => {
    openConfirmation({
      title: 'Delete Event',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      onConfirm: () => onDelete(task.id || task._id),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  return (
    <>
      <div
        className={`event-card ${task.isCompleted ? 'event-completed' : 'event-pending'}`}
        style={{ '--event-color': eventColor }}
      >
        <div className="event-title-row">
          <h3 className="event-title">{task.title}</h3>
          <div className="event-type-badge">{task.type}</div>
        </div>

        <div className="event-metadata">
          <div className="event-due">
            <span className="event-label">Due:</span> {formatDate(task.dueDate)}
          </div>
          <div className="event-weight">
            <span className="event-label">Weight:</span> {task.weight}%
          </div>
        </div>

        {task.description && (
          <div className="event-description">
            <p>{task.description}</p>
          </div>
        )}

        <div className="event-actions">
          {isCompletable && (
            <button
              className="event-action-button"
              onClick={onToggle}
              disabled={isUpdating || isDeleting}
            >
              {isUpdating ? (
                <div className="button-loading">
                  <LoadingAnimation size="small" style={{ width: 24, height: 24 }} />
                  <span>Updating</span>
                </div>
              ) : (
                'Mark as Done'
              )}
            </button>
          )}

          {isGradable && (
            <div className="event-grade-container">
              <label htmlFor={`grade-${task.id || task._id}`} className="event-grade-label">
                Grade:
              </label>
              <input
                id={`grade-${task.id || task._id}`}
                type="number"
                min="0"
                max="100"
                value={task.grade || ''}
                onChange={(e) => onSetGrade(task.id || task._id, e.target.value)}
                className="event-grade-input"
                disabled={isUpdating || isDeleting}
              />
            </div>
          )}

          {isDeletable && (
            <DeleteButton
              onClick={handleDeleteClick}
              isLoading={isDeleting}
              disabled={isUpdating || isDeleting}
              title="Delete event"
            />
          )}
        </div>
      </div>

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

export default EventCard;
