import React from 'react';
import { useGoals } from '@/features/goals/hooks/useGoals';
import { useGoalForm } from '@/features/goals/hooks/useGoalForm';
import { createGoal, updateGoal, deleteGoal } from '@/features/goals/services/goalService';
import { getAvailableCourses, validateGoalForm } from '@/features/goals/utils/goalUtils';
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
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingId) {
        const updatedGoal = await updateGoal(editingId, parseFloat(formData.targetGrade));
        setGoals((prev) =>
          prev.map((goal) =>
            goal._id === editingId
              ? { ...updatedGoal, course: goal.course || {} } // Preserve existing course with fallback
              : goal
          )
        );
      } else {
        const newGoal = await createGoal({
          courseId: formData.courseId,
          targetGrade: parseFloat(formData.targetGrade),
        });

        // Check if API already returned course data
        const hasCourseData = newGoal.course && newGoal.course._id;

        setGoals((prev) => [
          ...prev,
          hasCourseData
            ? newGoal
            : {
                ...newGoal,
                course: courses.find((c) => c._id === formData.courseId) || {},
              },
        ]);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save goal:', err);
      setFormErrors({ submit: err.message || 'Failed to save goal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    // Since goal.course already contains the full course object, use it directly
    const course = goal.course;

    if (!course) {
      console.error('Course not found in goal:', goal);
      return;
    }

    setEditingId(goal._id);
    setEditingCourse(course);
    setFormData({
      courseId: course._id, // Use course._id directly
      targetGrade: goal.targetGrade.toString(),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {!showForm && (
        <div className="add-course-row">
          <button
            className="button button-primary add-course-button"
            onClick={() => setShowForm(true)}
            disabled={availableCourses.length === 0 || operationLoading}
          >
            + Add Goal
          </button>
        </div>
      )}

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
            // Use goal.course directly instead of getCourseById
            const course = goal.course || {};
            if (!course._id) {
              // Check for minimal required data
              console.warn('Incomplete course data for goal:', goal._id);
              return null;
            }

            return (
              <GoalCard
                key={goal._id}
                goal={goal} // Now contains course data
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
