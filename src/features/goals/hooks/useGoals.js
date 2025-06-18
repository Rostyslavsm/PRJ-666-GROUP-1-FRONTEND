// src/features/goals/hooks/useGoals.js
import { useState, useEffect } from 'react';
import { fetchGoals, fetchCourses } from '../services/goalService';

export const useGoals = () => {
  const [courses, setCourses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesData, goalsData] = await Promise.all([
          fetchCourses(),
          fetchGoals(true), // Expand courses data
        ]);
        setCourses(coursesData);
        setGoals(goalsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { courses, goals, loading, error, setGoals };
};
