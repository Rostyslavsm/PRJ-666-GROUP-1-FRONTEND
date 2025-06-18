// goals/components/GoalsPage
import React from 'react';
import { useGoals } from '@/features/goals/hooks/useGoals';
import { useGoalForm } from '@/features/goals/hooks/useGoalForm';
import { createGoal, updateGoal, deleteGoal } from '@/features/goals/services/goalService';
import {
  getAvailableCourses,
  getCourseById,
  validateGoalForm,
} from '@/features/goals/utils/goalUtils';
import GoalCard from '@/features/goals/components/GoalCard';
import GoalForm from '@/features/goals/components/GoalForm';
import EmptyState from '@/features/goals/components/EmptyState';
import ErrorState from '@/features/goals/components/ErrorState';
import LoadingState from '@/features/goals/components/LoadingState';

const GoalsPage = () => {
  const { courses, goals, loading, error, setGoals } = useGoals();
  const {
    showForm,
    setShowForm,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    editingId,
    setEditingId,
    editingCourse,
    setEditingCourse,
    resetForm,
  } = useGoalForm();

  const availableCourses = getAvailableCourses(courses, goals);

  const handleFormDataChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateGoalForm(formData, editingId);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (editingId) {
        // Update existing goal
        const updatedGoal = await updateGoal(editingId, parseFloat(formData.targetGrade));
        setGoals(goals.map((goal) => (goal._id === editingId ? updatedGoal : goal)));
      } else {
        // Add new goal
        const newGoal = await createGoal({
          courseId: formData.courseId,
          targetGrade: parseFloat(formData.targetGrade),
        });
        setGoals([...goals, newGoal]);
      }

      resetForm();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setFormErrors({ submit: err.message || 'Failed to save goal' });
    }
  };

  const handleEdit = (goal) => {
    const course = getCourseById(courses, goal.courseId);
    setEditingId(goal._id);
    setEditingCourse(course);
    setFormData({
      courseId: goal.courseId._id || goal.courseId,
      targetGrade: goal.targetGrade.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const result = await deleteGoal(id);
        if (result.success) {
          setGoals(goals.filter((goal) => goal._id !== id));
        }
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div className="gradegoals-container">
        <div className="gradegoals-content">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gradegoals-container">
        <div className="gradegoals-content">
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="gradegoals-container">
      <div className="gradegoals-content">
        <div className="gradegoals-header">
          <div>
            <h1 className="gradegoals-title">Study Goals</h1>
            <p className="gradegoals-subtitle">Set and track your academic targets</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={availableCourses.length === 0}
            className={`gradegoals-button ${
              availableCourses.length === 0
                ? 'gradegoals-button-disabled'
                : 'gradegoals-button-primary'
            }`}
          >
            Add New Goal
          </button>
        </div>

        <GoalForm
          showForm={showForm}
          formData={formData}
          formErrors={formErrors}
          editingId={editingId}
          editingCourse={editingCourse}
          courses={courses}
          goals={goals}
          onFormDataChange={handleFormDataChange}
          onCancel={resetForm}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {goals.length === 0 ? (
          <EmptyState courses={courses} onAddGoal={() => setShowForm(true)} />
        ) : (
          <div className="gradegoals-grid">
            {goals.map((goal) => {
              const course = getCourseById(courses, goal.courseId);
              if (!course) return null;

              return (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              );
            })}
          </div>
        )}

        {!showForm && availableCourses.length > 0 && (
          <div className="gradegoals-info-text">
            <p>
              You can set goals for {availableCourses.length} more course
              {availableCourses.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
