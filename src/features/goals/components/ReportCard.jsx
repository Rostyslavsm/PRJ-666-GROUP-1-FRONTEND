import React from 'react';
import styles from '@/styles/ReportCard.module.css';
import { getWeightColor } from '../utils/goalUtils';
import { formatDate } from '@/features/events/utils/utils';

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

  // Improved progress calculation
  const calculateProgress = (current, target) => {
    // Calculate percentage towards target (0-100%)
    if (target === 0) return 100;
    return Math.min((current / target) * 100, 100);
  };

  const progress = calculateProgress(currentAvg, targetGrade);

  // Get status information
  const getStatusInfo = () => {
    const difference = currentAvg - targetGrade;
    const absDifference = Math.abs(difference);

    if (difference === 0) {
      return {
        text: 'Exactly on target',
        color: '#84a98c',
        icon: '✓',
      };
    }

    if (difference > 0) {
      return {
        text: `${Math.round(absDifference)}% above target`,
        color: '#2a6f4a',
        icon: '↑',
      };
    }

    return {
      text: `${Math.round(absDifference)}% below target`,
      color: '#9e2a2b',
      icon: '↓',
    };
  };

  const status = getStatusInfo();

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

      {/* NEW Progress Section */}
      <div className={styles['report-progress-section']}>
        <div className={styles['progress-status']} style={{ color: status.color }}>
          <span className={styles['status-icon']}>{status.icon}</span>
          {status.text}
        </div>

        <div className={styles['progress-bar-container']}>
          <div className={styles['progress-labels']}>
            <span>0%</span>
            <span>Target: {Math.round(targetGrade)}%</span>
            <span>100%</span>
          </div>

          <div className={styles['progress-bar-track']}>
            <div
              className={styles['progress-bar-fill']}
              style={{ width: `${Math.min(currentAvg, 100)}%`, backgroundColor: status.color }}
            ></div>
            <div
              className={styles['progress-target-marker']}
              style={{ left: `${Math.min(targetGrade, 100)}%` }}
            ></div>
          </div>
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
