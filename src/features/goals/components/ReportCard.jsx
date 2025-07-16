import React from 'react';
import styles from '@/styles/ReportCard.module.css';

const getWeightColor = (weight) => {
  if (weight >= 30) return '#e74c3c';
  if (weight >= 15) return '#f39c12';
  if (weight >= 5) return '#3498db';
  return '#2ecc71';
};

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid date';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Invalid date';
  }
};

const ReportCard = ({ report }) => {
  const {
    course = {},
    targetGrade = 0,
    currentGrade = {},
    achievable,
    recommendation,
    upcomingTasks = [],
    pastEvents = [],
  } = report;

  const currentAvg = currentGrade || 0;
  const progress = ((currentAvg - targetGrade) / targetGrade) * 100;

  const significantPastEvents = pastEvents
    .filter((e) => e.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <div className={styles['report-card']}>
      {/* Header */}
      <div className={styles['report-header']}>
        <div>
          <div className={styles['report-course-code']}>{course.code}</div>
          <h2 className={styles['report-course-title']}>{course.title}</h2>
        </div>

        <div className={styles['report-stats-container']}>
          <div className={styles['report-pill']}>
            <span className={styles['report-pill-label']}>Current</span>
            <div className={styles['report-pill-value']}>{Math.round(currentAvg)}%</div>
          </div>
          <div className={styles['report-pill']}>
            <span className={styles['report-pill-label']}>Target</span>
            <div className={styles['report-pill-value']}>{Math.round(targetGrade)}%</div>
          </div>
          <div
            className={`${styles['report-pill']} ${achievable ? styles['report-pill-success'] : styles['report-pill-danger']}`}
          >
            {achievable ? '✓ On Track' : '✗ Needs Adjustment'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles['report-progress-container']}>
        <div
          className={styles['report-progress-bar']}
          style={{
            width: `${Math.min(Math.abs(progress), 100)}%`,
            backgroundColor: progress >= 0 ? '#2ecc71' : '#e74c3c',
            left: progress >= 0 ? '50%' : `${50 - Math.abs(progress)}%`,
          }}
        ></div>
        <div className={styles['report-progress-label']}>
          {progress >= 0
            ? `${Math.round(progress)}% ahead`
            : `${Math.round(Math.abs(progress))}% behind`}
        </div>
      </div>

      {/* Recommendation */}
      {!achievable && (
        <div className={styles['report-recommendation']}>
          <h4>Recommendation</h4>
          <p>
            {recommendation?.replace(/_/g, ' ') ||
              'Consider adjusting your target or focusing on high-weight assignments'}
          </p>
        </div>
      )}

      {/* Content */}
      <div className={styles['report-content']}>
        {/* Upcoming Tasks */}
        <div className={styles['report-section']}>
          <h3>Upcoming Milestones</h3>
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((event) => (
              <div key={event._id} className={styles['report-event-card']}>
                <div
                  className={styles['report-event-indicator']}
                  style={{ backgroundColor: getWeightColor(event.weight) }}
                ></div>
                <div className={styles['report-event-details']}>
                  <strong>{event.title}</strong>
                  <small>
                    {formatDate(event.end)} · {event.weight}%
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className={styles['report-empty-message']}>No upcoming events</p>
          )}
        </div>

        {/* Past Events */}
        <div className={styles['report-section']}>
          <h3>Key Past Assessments</h3>
          {significantPastEvents.length > 0 ? (
            significantPastEvents.map((event) => (
              <div key={event._id} className={styles['report-past-event-card']}>
                <div className={styles['report-past-event-grade']}>{event.grade}%</div>
                <div className={styles['report-past-event-details']}>
                  <div>{event.title}</div>
                  <small>{event.weight}% of grade</small>
                </div>
              </div>
            ))
          ) : (
            <p className={styles['report-empty-message']}>No significant past assessments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
