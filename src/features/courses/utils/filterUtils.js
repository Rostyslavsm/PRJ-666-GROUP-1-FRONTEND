/**
 * Utility functions for handling classes filtering
 */

/**
 * Builds query parameters for classes filtering
 * @param {Object} filters - The filter object containing courseId, date (course start date), professor, room
 * @returns {URLSearchParams} - URLSearchParams object with the query parameters
 */
export function buildClassesQueryParams(filters = {}) {
  const queryParams = new URLSearchParams();

  // Always include course expansion
  queryParams.append('expand', 'course');

  // Only add past=true if no date filter is provided
  // If date filter is provided, we want classes in that specific date range
  if (!filters.date || !filters.date.trim()) {
    queryParams.append('past', 'true');
  }

  // Add filter parameters if provided and not empty
  if (filters.courseId && filters.courseId.trim()) {
    // Validate courseId format before adding
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (objectIdRegex.test(filters.courseId.trim())) {
      queryParams.append('courseId', filters.courseId.trim());
    }
  }

  if (filters.date && filters.date.trim()) {
    // Validate and format date for backend (course start date range)
    try {
      // Check if the date string is in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(filters.date.trim())) {
        // For course start date filtering, we'll use the same date for both from and to
        // to get classes from courses that started on that specific date
        const dateValue = filters.date.trim();
        queryParams.append('from', `${dateValue}T00:00:00Z`);
        queryParams.append('to', `${dateValue}T23:59:59Z`);
      } else {
        // Try to parse other date formats
        const dateObj = new Date(filters.date);
        if (!isNaN(dateObj.getTime())) {
          // Format as YYYY-MM-DD for backend comparison
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const isoDate = `${year}-${month}-${day}`;
          queryParams.append('from', `${isoDate}T00:00:00Z`);
          queryParams.append('to', `${isoDate}T23:59:59Z`);
        }
      }
    } catch (error) {
      console.warn('Invalid date format:', filters.date);
    }
  }

  if (filters.professor && filters.professor.trim()) {
    queryParams.append('professor', filters.professor.trim());
  }

  if (filters.room && filters.room.trim()) {
    queryParams.append('room', filters.room.trim());
  }

  return queryParams;
}

/**
 * Validates filter parameters
 * @param {Object} filters - The filter object to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export function validateFilters(filters = {}) {
  const errors = [];

  // Validate date format if provided (course start date)
  if (filters.date && filters.date.trim()) {
    // Check if the date string is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(filters.date.trim())) {
      // Validate the date components
      const [year, month, day] = filters.date.trim().split('-').map(Number);
      const dateObj = new Date(year, month - 1, day); // month is 0-indexed

      // Check if the date is valid
      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
      ) {
        errors.push('Invalid date format');
      } else {
        // For course start date, we can allow future dates since courses can start in the future
        // But we should still validate that it's a reasonable date (not too far in the past or future)
        const today = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        const fiveYearsFromNow = new Date();
        fiveYearsFromNow.setFullYear(today.getFullYear() + 5);

        if (dateObj < fiveYearsAgo) {
          errors.push('Course start date cannot be more than 5 years in the past');
        } else if (dateObj > fiveYearsFromNow) {
          errors.push('Course start date cannot be more than 5 years in the future');
        }
      }
    } else {
      // Try to parse other date formats
      const dateObj = new Date(filters.date);
      if (isNaN(dateObj.getTime())) {
        errors.push('Invalid date format');
      } else {
        // For course start date, we can allow future dates
        const today = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(today.getFullYear() - 5);
        const fiveYearsFromNow = new Date();
        fiveYearsFromNow.setFullYear(today.getFullYear() + 5);

        if (dateObj < fiveYearsAgo) {
          errors.push('Course start date cannot be more than 5 years in the past');
        } else if (dateObj > fiveYearsFromNow) {
          errors.push('Course start date cannot be more than 5 years in the future');
        }
      }
    }
  }

  // Validate courseId format if provided (should be a valid MongoDB ObjectId)
  if (filters.courseId && filters.courseId.trim()) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(filters.courseId.trim())) {
      errors.push('Invalid course ID format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if any filters are active
 * @param {Object} filters - The filter object to check
 * @returns {boolean} - True if any filter is active
 */
export function hasActiveFilters(filters = {}) {
  return Object.values(filters).some((value) => value && value.trim() !== '');
}

/**
 * Creates a default filter object
 * @returns {Object} - Default filter object with empty values
 */
export function createDefaultFilters() {
  return {
    courseId: '',
    date: '',
    professor: '',
    room: '',
  };
}
