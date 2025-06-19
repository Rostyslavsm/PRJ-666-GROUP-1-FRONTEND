// src/features/goals/hooks/useGoals.js
import { useState, useEffect, useCallback } from 'react';
import { fetchGoals, fetchCourses } from '../services/goalService';

export const useGoals = () => {
  const [courses, setCourses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, goalsData] = await Promise.all([fetchCourses(), fetchGoals(true)]);
      setCourses(coursesData);
      setGoals(goalsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    courses,
    goals,
    loading,
    error,
    operationLoading,
    setGoals,
    refreshGoals: loadData,
    setOperationLoading,
  };
};
