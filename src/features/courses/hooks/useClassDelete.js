import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useClassDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteClass = async (classId) => {
    setIsDeleting(true);
    setError(null);

    try {
      // Validate classId
      if (!classId) {
        console.error('ClassID is null or undefined');
        throw new Error('Invalid class ID: Cannot be null or undefined');
      }

      console.log('deleteClass called with classId:', classId, 'type:', typeof classId);

      let headers = {
        'Content-Type': 'application/json',
      };

      // Use mock token in development mode
      if (process.env.NODE_ENV === 'development') {
        headers.Authorization = 'Bearer mock-id-token';
      } else {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error('No ID token available');
        headers.Authorization = `Bearer ${idToken}`;
      }

      // Add debugging information
      console.log('Environment:', process.env.NODE_ENV);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full request URL:', `${API_BASE_URL}/v1/classes/${classId}`);
      console.log('Headers:', JSON.stringify(headers, null, 2));

      // Make the API request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch(`${API_BASE_URL}/v1/classes/${classId}`, {
          method: 'DELETE',
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please log in again');
          }

          if (response.status === 404) {
            throw new Error('Class not found or already deleted');
          }

          let errorText = '';
          try {
            errorText = await response.text();
            console.error('Error response body:', errorText);

            // Try to parse as JSON if possible
            try {
              const errorData = JSON.parse(errorText);
              throw new Error(
                errorData.errors?.join(', ') ||
                  errorData.message ||
                  `Server error: ${response.status} - ${response.statusText}`
              );
            } catch (parseError) {
              // If not JSON, use text directly
              throw new Error(
                `Server error: ${response.status} - ${errorText || response.statusText}`
              );
            }
          } catch (textError) {
            if (textError !== errorText) throw textError;
            throw new Error(`Server error: ${response.status} - ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log('Success response:', data);
        setSuccess(true);
        return data;
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out - The server took too long to respond');
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteClass,
    isDeleting,
    error,
    success,
    resetState: () => {
      setError(null);
      setSuccess(false);
    },
  };
}
