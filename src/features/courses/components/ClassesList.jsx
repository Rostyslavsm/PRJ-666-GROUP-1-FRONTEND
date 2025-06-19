import React from 'react';
import { LoadingAnimation } from '../../animations';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import DeleteButton from '../../../componentShared/DeleteButton';

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
            {sessions.map((s, idx) => (
              <div key={`${s.code}-${idx}`} className="session-card">
                <div className="session-actions">
                  <DeleteButton
                    onClick={() => handleDeleteClick(s.id, s)}
                    isLoading={isDeletingClass}
                    disabled={isDeletingClass}
                    title="Delete class"
                  />
                </div>
                <h5 className="session-title">{s.title || s.code}</h5>
                <div className="session-meta">
                  <div className="session-time">
                    <strong>Time:</strong> {s.from} - {s.until}
                  </div>
                  <div className="session-type">
                    <span className="session-type-badge">{s.type}</span>
                  </div>
                </div>
                <div className="session-details">
                  <div>
                    <strong>Room:</strong> {s.room}
                  </div>
                  <div>
                    <strong>Code:</strong> {s.code}
                  </div>
                  <div>
                    <strong>Section:</strong> {s.section}
                  </div>
                  <div>
                    <strong>Professor:</strong> {s.professor}
                  </div>
                </div>
              </div>
            ))}
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
