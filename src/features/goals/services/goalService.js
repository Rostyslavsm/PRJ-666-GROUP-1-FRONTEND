import { fetchAuthSession } from 'aws-amplify/auth';

// Use the same API base URL as defined previously
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

/**
 * Get authorization headers for API requests
 * @returns {Promise<Object>} Headers object with authorization
 */
const getHeaders = async () => {
  const baseHeaders = {
    'Content-Type': 'application/json',
  };

  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    // Development headers with mock token
    console.log('Using development mock token');
    return {
      ...baseHeaders,
      Authorization: 'Bearer mock-id-token',
    };
  }

  // Production mode - get real token
  try {
    // Get the current session
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) {
      throw new Error('No ID token available');
    }

    return {
      ...baseHeaders,
      Authorization: `Bearer ${idToken}`,
    };
  } catch (err) {
    console.error('Error getting ID token:', err);
    throw new Error('Failed to get access token');
  }
};

/**
 * Fetches all goals for the user
 * @param {boolean} expandCourses - Whether to expand course data
 * @returns {Promise<Array>} Promise resolving to array of goals
 */
export const fetchGoals = async (expandCourses = false) => {
  try {
    const headers = await getHeaders();
    const url = `${API_BASE_URL}/goals${expandCourses ? '?expand=courses' : ''}`;

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', url);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(url, {
        method: 'GET',
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
          throw new Error('API endpoint not found - Please check server configuration');
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
      return data.goals || [];
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to fetch goals:', error);
    return [];
  }
};

/**
 * Creates a new goal
 * @param {Object} goalData - Goal data to create
 * @param {string} goalData.courseId - ID of the associated course
 * @param {number} goalData.targetGrade - Target grade (0-100)
 * @returns {Promise<Object>} Promise resolving to created goal data
 */
export const createGoal = async (goalData) => {
  try {
    // Validate target grade
    if (
      typeof goalData.targetGrade !== 'number' ||
      goalData.targetGrade < 0 ||
      goalData.targetGrade > 100
    ) {
      throw new Error('Target grade must be a number between 0 and 100');
    }

    // Validate course ID
    if (!goalData.courseId || goalData.courseId.length !== 24) {
      throw new Error('Invalid course ID');
    }

    const headers = await getHeaders();

    const formattedGoal = {
      courseId: goalData.courseId,
      targetGrade: goalData.targetGrade,
      // Include any additional fields if needed
    };

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/goals`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Goal data (formatted):', JSON.stringify(formattedGoal, null, 2));

    // Make the API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedGoal),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }

        if (response.status === 400) {
          throw new Error('Bad request - Please check your goal data');
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
      return data.goal;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to create goal:', error);
    throw error;
  }
};

/**
 * Updates an existing goal's target grade
 * @param {string} goalId - ID of the goal to update
 * @param {number} targetGrade - New target grade (0-100)
 * @returns {Promise<Object>} Promise resolving to updated goal data
 */
export const updateGoal = async (goalId, targetGrade) => {
  try {
    // Validate goal ID
    if (!goalId || goalId.length !== 24) {
      throw new Error('Invalid goal ID');
    }

    // Validate target grade
    if (typeof targetGrade !== 'number' || targetGrade < 0 || targetGrade > 100) {
      throw new Error('Target grade must be a number between 0 and 100');
    }

    const headers = await getHeaders();

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/goals/${goalId}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Update data:', { targetGrade });

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ targetGrade }),
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
          throw new Error('Goal not found');
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
      return data.goal;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to update goal:', error);
    throw error;
  }
};

/**
 * Deletes a goal by ID
 * @param {string} goalId - ID of the goal to delete
 * @returns {Promise<Object>} Promise resolving to deletion result
 */
// src/features/goals/services/goalService.js
export const deleteGoal = async (goalId) => {
  try {
    // Validate goal ID
    if (!goalId || goalId.length !== 24) {
      console.error('Invalid goal ID');
      return { success: false, error: 'Invalid goal ID' };
    }

    const headers = await getHeaders();

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);

      // Handle 204 No Content response
      if (response.status === 204) {
        console.log('Delete successful (204 No Content)');
        return { success: true };
      }

      // Handle other success statuses
      if (response.ok) {
        try {
          const data = await response.json();
          return { success: true, data };
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          return {
            success: false,
            error: 'Failed to parse server response',
          };
        }
      }

      // Handle error statuses
      if (response.status === 401) {
        return { success: false, error: 'Unauthorized - Please log in again' };
      }

      if (response.status === 404) {
        return { success: false, error: 'Goal not found' };
      }

      let errorText = '';
      try {
        errorText = await response.text();
        console.error('Error response body:', errorText);

        // Try to parse as JSON if possible
        try {
          const errorData = JSON.parse(errorText);
          return {
            success: false,
            error:
              errorData.errors?.join(', ') ||
              errorData.message ||
              `Server error: ${response.status} - ${response.statusText}`,
          };
        } catch (parseError) {
          // If not JSON, use text directly
          return {
            success: false,
            error: `Server error: ${response.status} - ${errorText || response.statusText}`,
          };
        }
      } catch (textError) {
        return {
          success: false,
          error: `Server error: ${response.status} - ${response.statusText}`,
        };
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out - The server took too long to respond',
        };
      }
      return { success: false, error: fetchError.message || 'Unknown error occurred' };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return { success: false, error: error.message || 'Failed to delete goal' };
  }
};

/**
 * Fetches all courses for the user
 * @returns {Promise} Promise resolving to courses data
 */
export const fetchCourses = async () => {
  try {
    const headers = await getHeaders();

    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL:', API_BASE_URL);
    console.log('Full request URL:', `${API_BASE_URL}/courses`);
    console.log('Headers:', JSON.stringify(headers, null, 2));

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'GET',
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
          throw new Error('API endpoint not found - Please check server configuration');
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
      return data.courses || [];
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - The server took too long to respond');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
};
