import React from 'react';
import DeleteButton from './DeleteButton';
import { hexToRgb } from './utils/colorUtils';
import styles from '../styles/CourseCard.module.css';

/**
 * Reusable Course Card component
 *
 * @param {Object} course - Course data object
 * @param {string} course._id - Course ID
 * @param {string} course.title - Course title
 * @param {string} course.code - Course code
 * @param {string} course.professor - Course professor
 * @param {string} course.color - Course color (hex)
 * @param {Array} course.schedule - Course schedule array
 * @param {Object|number|string} course.currentGrade - Course grade object or direct value
 * @param {string} course.room - Room location (for sessions)
 * @param {string} course.section - Section identifier
 * @param {Function} onEdit - Edit handler
 * @param {Function} onDelete - Delete handler
 * @param {boolean} isDeleting - Whether delete is in progress
 * @param {Object} customStyles - Additional custom styles
 * @param {Array} actions - Custom action buttons to render instead of defaults
 * @param {Function} onCardClick - Handler for clicking the entire card
 * @param {React.ReactNode} eventButtons - Custom buttons to display between title and schedule
 */
const CourseCard = ({
  course,
  onEdit,
  onDelete,
  isDeleting = false,
  customStyles = {},
  actions = null,
  onCardClick = null,
  eventButtons = null,
}) => {
  if (!course) return null;

  const courseColor = course.color || '#52796f';
  const rgbColor = hexToRgb(courseColor);

  const handleCardClick = () => {
    if (onCardClick) onCardClick(course);
  };

  // Handle both legacy and new grade format
  const renderGrade = () => {
    if (course.currentGrade === undefined && course.grade === undefined) {
      return null;
    }

    // If we have the new format with currentGrade object
    if (course.currentGrade && typeof course.currentGrade === 'object') {
      return (
        <div className={styles.grade}>
          <div className={styles.gradeRow}>
            <span className={styles.label}>Current grade:</span>
            <span className={styles.gradeScore}>{Math.round(course.currentGrade.avg)}%</span>
          </div>
          <div className={styles.gradeDetails}>
            <small>
              ({Math.round(course.currentGrade.totalWeightSoFar)}% of course completed,{' '}
              {Math.round(course.currentGrade.weightRemaining)}% remaining)
            </small>
          </div>
        </div>
      );
    }

    // Fall back to the old format
    const gradeValue = course.currentGrade || course.grade;
    // Ensure the grade is displayed as an integer
    const formattedGrade = typeof gradeValue === 'number' ? Math.round(gradeValue) : gradeValue;
    return (
      <div className={styles.grade}>
        <div className={styles.gradeRow}>
          <span className={styles.label}>Current grade:</span>
          <span className={styles.gradeScore}>{formattedGrade}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.courseCard}
      style={{
        borderLeft: `5px solid ${courseColor}`,
        '--schedule-item-color': rgbColor,
        cursor: onCardClick ? 'pointer' : 'default',
        ...customStyles,
      }}
      onClick={handleCardClick}
    >
      <div className={styles.actions}>
        {actions || (
          <>
            {onEdit && (
              <button
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(course);
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course);
                }}
                isLoading={isDeleting}
                disabled={isDeleting}
                title="Delete course"
              />
            )}
          </>
        )}
      </div>

      <div className={styles.titleRow}>
        <h3 className={styles.courseName}>{course.title}</h3>
        <div className={styles.codeBadge} style={{ backgroundColor: courseColor }}>
          {course.code}
        </div>
      </div>

      {eventButtons && <div className={styles.eventButtonsRow}>{eventButtons}</div>}

      <div className={styles.metadata}>
        {course.professor && (
          <div>
            <span className={styles.label}>Professor:</span> {course.professor}
          </div>
        )}
        {course.room && (
          <div>
            <span className={styles.label}>Room:</span> {course.room}
          </div>
        )}
        {course.section && (
          <div>
            <span className={styles.label}>Section:</span> {course.section}
          </div>
        )}
      </div>

      {course.schedule && course.schedule.length > 0 && (
        <>
          <div className={styles.schedule}>
            {course.schedule.map((s, i) => (
              <div key={i} className={styles.scheduleItem}>
                <div className={styles.scheduleDay}>{s.weekDay}</div>
                <div className={styles.scheduleTime}>{s.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {renderGrade()}
    </div>
  );
};

export default CourseCard;
