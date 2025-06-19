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
  const { courses, goals, loading, error, operationLoading, setGoals, refreshGoals } = useGoals();

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
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
  } = useGoalForm();

  const availableCourses = getAvailableCourses(courses, goals);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateGoalForm(formData, editingId);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const updatedGoal = await updateGoal(editingId, parseFloat(formData.targetGrade));
        setGoals((prev) => prev.map((goal) => (goal._id === editingId ? updatedGoal : goal)));
      } else {
        const newGoal = await createGoal({
          courseId: formData.courseId,
          targetGrade: parseFloat(formData.targetGrade),
        });
        setGoals((prev) => [...prev, newGoal]);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setFormErrors({
        submit: err.message || 'Failed to save goal',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    const course = getCourseById(courses, goal.courseId);
    if (!course) {
      console.error('Course not found for goal:', goal);
      return;
    }

    setEditingId(goal._id);
    setEditingCourse(course);
    setFormData({
      courseId: goal.courseId._id || goal.courseId,
      targetGrade: goal.targetGrade.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    const originalGoals = [...goals];

    try {
      // Optimistic update
      setGoals((prev) => prev.filter((goal) => goal._id !== id));

      const result = await deleteGoal(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete goal on server');
      }

      // Refresh to ensure full consistency
      await refreshGoals();
    } catch (err) {
      // Revert on error
      setGoals(originalGoals);
      alert(err.message || 'Failed to delete goal');
      console.error('Delete error:', err);
    }
  };

  if (loading && !goals.length) {
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
          <ErrorState error={error} onRetry={refreshGoals} />
        </div>
      </div>
    );
  }

  return (
    <div className="goals-content">
      <div className="goals-header">
        <div>
          <h1 className="goals-title">Study Goals</h1>
          <p className="goals-subtitle">Set and track your academic targets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={availableCourses.length === 0 || operationLoading}
          className={`goals-button ${
            availableCourses.length === 0 ? 'goals-button-disabled' : 'goals-button-primary'
          }`}
        >
          Add New Goal
        </button>
      </div>

      {!showForm && availableCourses.length > 0 && (
        <div className="goals-info-text" style={{ marginTop: '10px', marginBottom: '20px' }}>
          <p>
            You can set goals for {availableCourses.length} more course
            {availableCourses.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <GoalForm
        showForm={showForm}
        formData={formData}
        formErrors={formErrors}
        editingId={editingId}
        editingCourse={editingCourse}
        courses={courses}
        goals={goals}
        onFormDataChange={handleInputChange}
        onCancel={resetForm}
        onSubmit={handleSubmit}
        loading={isSubmitting}
      />

      {goals.length === 0 ? (
        <EmptyState courses={courses} onAddGoal={() => setShowForm(true)} />
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const course = getCourseById(courses, goal.courseId);
            if (!course) {
              console.warn('Missing course for goal:', goal);
              return null;
            }

            return (
              <GoalCard
                key={goal._id}
                goal={goal}
                course={course}
                onEdit={() => handleEdit(goal)}
                onDelete={() => handleDelete(goal._id)}
                disabled={operationLoading}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
