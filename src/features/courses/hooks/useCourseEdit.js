import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { convertToUTCSeconds } from '../utils/timeUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useCourseEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const editCourse = async (courseId, formattedData) => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);

    try {
      let headers = {
        'Content-Type': 'application/json',
      };

      // In development mode, use mock token
      if (process.env.NODE_ENV === 'development') {
        headers.Authorization = 'Bearer mock-id-token';
      } else {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error('No ID token available');
        headers.Authorization = `Bearer ${idToken}`;
      }

      // Convert time fields to UTC seconds
      const dataToSubmit = {
        ...formattedData,
        instructor: {
          ...formattedData.instructor,
          availableTimeSlots: formattedData.instructor.availableTimeSlots.map((slot) => ({
            ...slot,
            startTime:
              typeof slot.startTime === 'string'
                ? convertToUTCSeconds(slot.startTime, slot.weekday)
                : slot.startTime,
            endTime:
              typeof slot.endTime === 'string'
                ? convertToUTCSeconds(slot.endTime, slot.weekday)
                : slot.endTime,
          })),
        },
        schedule: formattedData.schedule.map((item) => ({
          ...item,
          startTime:
            typeof item.startTime === 'string'
              ? convertToUTCSeconds(item.startTime, item.weekday)
              : item.startTime,
          endTime:
            typeof item.endTime === 'string'
              ? convertToUTCSeconds(item.endTime, item.weekday)
              : item.endTime,
        })),
      };

      console.log('📤 Updating course:', courseId);
      console.log('📦 Data:', JSON.stringify(dataToSubmit, null, 2));

      const response = await fetch(`${API_BASE_URL}/v1/courses/${courseId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData?.errors?.join(', ') || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          console.warn('⚠️ Failed to parse error response:', e);
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('📥 Course updated response:', responseData);

      setSuccess(true);
      return {
        success: true,
        course: responseData.course,
      };
    } catch (err) {
      console.error('❌ Error updating course:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    } finally {
      setIsEditing(false);
    }
  };

  return {
    editCourse,
    isEditing,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
