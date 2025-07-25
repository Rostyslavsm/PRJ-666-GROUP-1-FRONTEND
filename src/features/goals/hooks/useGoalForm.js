// src/features/goals/hooks/useGoalForm.js
import { useState } from 'react';

export const useGoalForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    targetGrade: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingCourse(null);
    setFormData({ courseId: '', targetGrade: '' });
    setFormErrors({});
    setIsSubmitting(false);
  };

  return {
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
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    resetForm,
  };
};
