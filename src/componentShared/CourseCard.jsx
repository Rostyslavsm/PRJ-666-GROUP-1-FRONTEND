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
 * @param {number|string} course.grade - Course grade
 * @param {string} course.room - Room location (for sessions)
 * @param {string} course.section - Section identifier
 * @param {Function} onEdit - Edit handler
 * @param {Function} onDelete - Delete handler
 * @param {boolean} isDeleting - Whether delete is in progress
 * @param {Object} customStyles - Additional custom styles
 * @param {Array} actions - Custom action buttons to render instead of defaults
 * @param {Function} onCardClick - Handler for clicking the entire card
 */
const CourseCard = ({
  course,
  onEdit,
  onDelete,
  isDeleting = false,
  customStyles = {},
  actions = null,
  onCardClick = null,
}) => {
  if (!course) return null;

  const courseColor = course.color || '#52796f';
  const rgbColor = hexToRgb(courseColor);

  const handleCardClick = () => {
    if (onCardClick) onCardClick(course);
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
          <h4 className={styles.scheduleHeading}>Schedule</h4>
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

      {course.grade !== undefined && (
        <div className={styles.grade}>
          <span className={styles.label}>Current grade:</span> {course.grade}
        </div>
      )}
    </div>
  );
};

export default CourseCard;
