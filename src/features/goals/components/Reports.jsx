// src/features/goals/pages/GoalReportPage.jsx
import React, { useEffect, useState } from 'react';
import styles from '@/styles/GoalCard.module.css';
import { fetchGoals, fetchGoalReports } from '../services/goalService';
import ReportCard from '@/features/goals/components/ReportCard';
import LoadingState from '@/features/goals/components/LoadingState';
import ErrorState from '@/features/goals/components/ErrorState';

const GoalReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAllReports = async () => {
      try {
        setLoading(true);
        const goals = await fetchGoals();

        if (!Array.isArray(goals)) throw new Error('Failed to load goals');

        const reportResults = await Promise.all(goals.map((goal) => fetchGoalReports(goal._id)));

        const validReports = reportResults
          .filter((res) => res.success && res.report)
          .map((res) => res.report);

        setReports(validReports);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllReports();
  }, []);

  if (loading && !reports.length) {
    return (
      <div className="goals-container">
        <div className="goals-content">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="goals-container">
        <div className="goals-content">
          <ErrorState error={error} />
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="goals-container">
        <div className="goals-content">
          <h2>No Reports Available</h2>
          <p>You don't have any goal reports yet. Set up your academic goals to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-content">
      <div className="goals-info-text" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <p>Track your progress toward your academic goals</p>
      </div>

      <div className={styles.reportsGrid}>
        {reports.map((report) => (
          <ReportCard key={report.goalId} report={report} />
        ))}
      </div>
    </div>
  );
};

export default GoalReportPage;
