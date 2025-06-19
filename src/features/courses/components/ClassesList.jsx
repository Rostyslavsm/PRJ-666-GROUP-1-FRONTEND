import React from 'react';
import { LoadingAnimation } from '../../animations';
import ConfirmationModal from '../../../componentShared/ConfirmationModal';
import { useConfirmation } from '../../../componentShared/useConfirmation';
import DeleteButton from '../../../componentShared/DeleteButton';

// Helper function to convert hex color to RGB values
const hexToRgb = (hex) => {
  // Default color if none provided
  if (!hex) return '82, 121, 111'; // #52796f in RGB

  // Remove the # if present
  const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;

  // Handle shorthand hex (e.g., #abc)
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }

  // Handle regular hex
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Return as string "r, g, b"
  return `${r}, ${g}, ${b}`;
};

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
            {sessions.map((s, idx) => {
              const sessionColor = s.color || '#52796f';
              const rgbColor = hexToRgb(sessionColor);

              return (
                <div
                  key={`${s.code}-${idx}`}
                  className="session-card"
                  style={{
                    borderLeft: `5px solid ${sessionColor}`,
                    '--schedule-item-color': rgbColor,
                  }}
                >
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
                      <span
                        className="session-type-badge"
                        style={{ backgroundColor: sessionColor }}
                      >
                        {s.type}
                      </span>
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
