import { useState, useEffect } from 'react';
import { Auth } from '../../../features/auth/lib/amplifyClient';
import { secondsToTime, getWeekday } from '../utils/timeUtils';
import { transformClasses } from '../utils/classUtils';

export function useCourses() {
  const [myCourses, setMyCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);

  // Fetch courses and classes from the backend
  useEffect(() => {
    fetchCoursesAndClasses();
  }, []);

  const fetchCoursesAndClasses = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      console.log('🔗 API_BASE_URL:', API_BASE_URL);

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔐 Using development mock headers');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
        console.log('🔐 Auth Headers:', headers);
      }

      // Fetch active courses
      const courseRes = await fetch(`${API_BASE_URL}/v1/courses?active=true`, {
        headers,
      });
      if (!courseRes.ok) {
        throw new Error(`HTTP error! status: ${courseRes.status}`);
      }
      const courseData = await courseRes.json();
      console.log('📥 Active courses response:', courseData);
      const activeCourses = courseData.courses || [];

      // Fetch archived courses (past courses)
      console.log('🔍 Fetching archived courses with URL:', `${API_BASE_URL}/v1/courses?past=true`);
      const archivedCourseRes = await fetch(`${API_BASE_URL}/v1/courses?past=true`, {
        headers,
      });
      console.log('🔍 Archived courses response status:', archivedCourseRes.status);
      console.log('🔍 Archived courses response ok:', archivedCourseRes.ok);

      if (!archivedCourseRes.ok) {
        const errorText = await archivedCourseRes.text();
        console.error('🔍 Archived courses error response:', errorText);
        throw new Error(`HTTP error! status: ${archivedCourseRes.status} - ${errorText}`);
      }

      const archivedCourseData = await archivedCourseRes.json();
      console.log('📥 Archived courses response:', archivedCourseData);
      const archivedCoursesData = archivedCourseData.courses || [];
      console.log('📥 Archived courses count:', archivedCoursesData.length);
      console.log('📥 Archived courses data:', archivedCoursesData);

      // Transform active courses
      const fetchedActiveCourses = activeCourses.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        instructorEmail: course.instructor?.email,
        instructorTimeSlots: course.instructor?.availableTimeSlots?.map((slot) => ({
          weekDay: getWeekday(slot.weekday),
          startTime: secondsToTime(slot.startTime),
          endTime: secondsToTime(slot.endTime),
        })),
        color: course.color || '#cad2c5',
        currentGrade: course.currentGrade || { avg: 0, totalWeightSoFar: 0, weightRemaining: 100 },
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
          classType: s.classType || 'lecture',
          location: s.location || 'TBD',
        })),
      }));

      // Transform archived courses
      const fetchedArchivedCourses = archivedCoursesData.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        instructorEmail: course.instructor?.email,
        instructorTimeSlots: course.instructor?.availableTimeSlots?.map((slot) => ({
          weekDay: getWeekday(slot.weekday),
          startTime: secondsToTime(slot.startTime),
          endTime: secondsToTime(slot.endTime),
        })),
        color: course.color || '#cad2c5',
        currentGrade: course.currentGrade || { avg: 0, totalWeightSoFar: 0, weightRemaining: 100 },
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
          classType: s.classType || 'lecture',
          location: s.location || 'TBD',
        })),
      }));

      // TEMPORARY: Check if any active courses have past end dates
      console.log('🔍 Checking active courses for past end dates...');
      const today = new Date();
      const activeCoursesWithPastDates = activeCourses.filter((course) => {
        if (course.endDate) {
          const endDate = new Date(course.endDate);
          return endDate < today;
        }
        return false;
      });
      console.log('🔍 Active courses with past end dates:', activeCoursesWithPastDates.length);
      if (activeCoursesWithPastDates.length > 0) {
        console.log(
          '🔍 These courses should be archived:',
          activeCoursesWithPastDates.map((c) => ({
            title: c.title,
            endDate: c.endDate,
            status: c.status,
          }))
        );
      }

      setMyCourses(fetchedActiveCourses);
      setArchivedCourses(fetchedArchivedCourses);

      // Fetch current classes
      const classRes = await fetch(`${API_BASE_URL}/v1/classes`, {
        headers,
      });
      if (!classRes.ok) {
        throw new Error(`HTTP error! status: ${classRes.status}`);
      }
      const classData = await classRes.json();
      console.log('📥 Current classes response:', classData);
      const classes = classData.classes || [];

      // Transform classes for the schedule view
      const transformedSchedule = transformClasses(classes, activeCourses);
      setSchedule(transformedSchedule);

      // Fetch past classes
      console.log(
        '🔍 Fetching past classes with URL:',
        `${API_BASE_URL}/v1/classes?past=true&expand=course`
      );
      const pastClassesRes = await fetch(`${API_BASE_URL}/v1/classes?past=true&expand=course`, {
        headers,
      });
      console.log('🔍 Past classes response status:', pastClassesRes.status);
      console.log('🔍 Past classes response ok:', pastClassesRes.ok);

      if (!pastClassesRes.ok) {
        const errorText = await pastClassesRes.text();
        console.error('🔍 Past classes error response:', errorText);
        throw new Error(`HTTP error! status: ${pastClassesRes.status} - ${errorText}`);
      }

      const pastClassesData = await pastClassesRes.json();
      console.log('📥 Past classes response:', pastClassesData);
      const pastClassesList = pastClassesData.classes || [];
      console.log('📥 Past classes count:', pastClassesList.length);

      // Transform past classes for display
      const transformedPastClasses = pastClassesList.map((cls) => {
        const courseInfo = cls.courseId || {};
        const startTime = new Date(cls.startTime);
        const endTime = new Date(cls.endTime);

        return {
          _id: cls._id,
          title: courseInfo.title || 'Unknown Course',
          code: courseInfo.code || 'N/A',
          color: courseInfo.color || '#cad2c5',
          professor: courseInfo.instructor?.name || 'Unknown',
          section: courseInfo.section || 'A',
          date: startTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: '2-digit',
            day: '2-digit',
          }),
          startTime: startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          endTime: endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: cls.location || 'TBD',
          classType: cls.classType || 'lecture',
          topics: cls.topics || [],
        };
      });

      setPastClasses(transformedPastClasses);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Refresh class data after a class is deleted or a course is created
  const refreshClasses = async () => {
    try {
      console.log('🔄 Starting classes refresh');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔄 Using development mock headers for class refresh');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
      }

      // First, refresh active courses to ensure we have the latest course data
      const courseRes = await fetch(`${API_BASE_URL}/v1/courses?active=true`, {
        headers,
      });
      if (!courseRes.ok) {
        throw new Error(`HTTP error! status: ${courseRes.status}`);
      }
      const courseData = await courseRes.json();
      console.log('🔄 Refreshed active courses data for classes view:', courseData);
      const courses = courseData.courses || [];

      const fetchedCourses = courses.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        instructorEmail: course.instructor?.email,
        instructorTimeSlots: course.instructor?.availableTimeSlots?.map((slot) => ({
          weekDay: getWeekday(slot.weekday),
          startTime: secondsToTime(slot.startTime),
          endTime: secondsToTime(slot.endTime),
        })),
        color: course.color || '#cad2c5',
        currentGrade: course.currentGrade || { avg: 0, totalWeightSoFar: 0, weightRemaining: 100 },
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
          classType: s.classType || 'lecture',
          location: s.location || 'TBD',
        })),
      }));
      setMyCourses(fetchedCourses);

      // Then fetch current classes
      const classRes = await fetch(`${API_BASE_URL}/v1/classes`, {
        headers,
      });
      if (!classRes.ok) {
        throw new Error(`HTTP error! status: ${classRes.status}`);
      }

      const classData = await classRes.json();
      console.log('🔄 Refreshed classes data:', classData);

      // Use the freshly fetched courses for transformation
      const transformedSchedule = transformClasses(classData.classes, courses);
      setSchedule(transformedSchedule);
      console.log('🔄 Classes refresh complete');
    } catch (err) {
      console.error('Failed to refresh classes:', err.message);
    }
  };

  // Refresh course data after a course is deleted or added
  const refreshCourses = async () => {
    try {
      console.log('🔄 Starting course refresh');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔄 Using development mock headers for refresh');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
      }

      // Fetch active courses
      const courseRes = await fetch(`${API_BASE_URL}/v1/courses?active=true`, {
        headers,
      });
      if (!courseRes.ok) {
        throw new Error(`HTTP error! status: ${courseRes.status}`);
      }
      const courseData = await courseRes.json();
      console.log('🔄 Refreshed active courses data:', courseData);
      const activeCourses = courseData.courses || [];

      // Fetch archived courses
      console.log('🔄 Fetching archived courses with URL:', `${API_BASE_URL}/v1/courses?past=true`);
      const archivedCourseRes = await fetch(`${API_BASE_URL}/v1/courses?past=true`, {
        headers,
      });
      console.log('🔄 Archived courses response status:', archivedCourseRes.status);

      if (!archivedCourseRes.ok) {
        const errorText = await archivedCourseRes.text();
        console.error('🔄 Archived courses error response:', errorText);
        throw new Error(`HTTP error! status: ${archivedCourseRes.status} - ${errorText}`);
      }

      const archivedCourseData = await archivedCourseRes.json();
      console.log('🔄 Refreshed archived courses data:', archivedCourseData);
      const archivedCoursesData = archivedCourseData.courses || [];
      console.log('🔄 Archived courses count:', archivedCoursesData.length);

      // Debug: Log the full response to understand the structure
      console.log('🔄 Full archived courses response structure:', {
        success: archivedCourseData.success,
        coursesLength: archivedCourseData.courses?.length,
        coursesType: typeof archivedCourseData.courses,
        isArray: Array.isArray(archivedCourseData.courses),
        fullResponse: archivedCourseData,
      });

      // Check if the courses array is the same as the current state to prevent unnecessary updates
      if (
        JSON.stringify(activeCourses.map((c) => c._id)) ===
        JSON.stringify(myCourses.map((c) => c._id))
      ) {
        console.log('🔄 Active course IDs unchanged, skipping update');
      } else {
        const fetchedActiveCourses = activeCourses.map((course) => ({
          _id: course._id,
          title: course.title,
          code: course.code,
          section: course.section || 'A',
          professor: course.instructor?.name,
          instructorEmail: course.instructor?.email,
          instructorTimeSlots: course.instructor?.availableTimeSlots?.map((slot) => ({
            weekDay: getWeekday(slot.weekday),
            startTime: secondsToTime(slot.startTime),
            endTime: secondsToTime(slot.endTime),
          })),
          color: course.color || '#cad2c5',
          currentGrade: course.currentGrade || {
            avg: 0,
            totalWeightSoFar: 0,
            weightRemaining: 100,
          },
          startDate: course.startDate,
          endDate: course.endDate,
          schedule: course.schedule.map((s) => ({
            time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
            weekDay: getWeekday(s.weekday),
            classType: s.classType || 'lecture',
            location: s.location || 'TBD',
          })),
        }));
        console.log('🔄 Setting myCourses with new data:', fetchedActiveCourses);
        setMyCourses(fetchedActiveCourses);
      }

      // Update archived courses
      const fetchedArchivedCourses = archivedCoursesData.map((course) => ({
        _id: course._id,
        title: course.title,
        code: course.code,
        section: course.section || 'A',
        professor: course.instructor?.name,
        instructorEmail: course.instructor?.email,
        instructorTimeSlots: course.instructor?.availableTimeSlots?.map((slot) => ({
          weekDay: getWeekday(slot.weekday),
          startTime: secondsToTime(slot.startTime),
          endTime: secondsToTime(slot.endTime),
        })),
        color: course.color || '#cad2c5',
        currentGrade: course.currentGrade || { avg: 0, totalWeightSoFar: 0, weightRemaining: 100 },
        startDate: course.startDate,
        endDate: course.endDate,
        schedule: course.schedule.map((s) => ({
          time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
          weekDay: getWeekday(s.weekday),
          classType: s.classType || 'lecture',
          location: s.location || 'TBD',
        })),
      }));
      setArchivedCourses(fetchedArchivedCourses);
      console.log('🔄 Course refresh complete');
    } catch (err) {
      console.error('Failed to refresh courses after delete:', err.message);
    }
  };

  // Refresh past classes data
  const refreshPastClasses = async () => {
    try {
      console.log('🔄 Starting past classes refresh');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to view courses.');
        }
        headers = user.authorizationHeaders();
      }

      // Fetch past classes with course expansion
      const pastClassesRes = await fetch(`${API_BASE_URL}/v1/classes?past=true&expand=course`, {
        headers,
      });
      if (!pastClassesRes.ok) {
        throw new Error(`HTTP error! status: ${pastClassesRes.status}`);
      }
      const pastClassesData = await pastClassesRes.json();
      console.log('🔄 Refreshed past classes data:', pastClassesData);
      const pastClassesList = pastClassesData.classes || [];

      // Transform past classes for display
      const transformedPastClasses = pastClassesList.map((cls) => {
        const courseInfo = cls.courseId || {};
        const startTime = new Date(cls.startTime);
        const endTime = new Date(cls.endTime);

        return {
          _id: cls._id,
          title: courseInfo.title || 'Unknown Course',
          code: courseInfo.code || 'N/A',
          color: courseInfo.color || '#cad2c5',
          professor: courseInfo.instructor?.name || 'Unknown',
          section: courseInfo.section || 'A',
          date: startTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: '2-digit',
            day: '2-digit',
          }),
          startTime: startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          endTime: endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: cls.location || 'TBD',
          classType: cls.classType || 'lecture',
          topics: cls.topics || [],
        };
      });

      setPastClasses(transformedPastClasses);
      console.log('🔄 Past classes refresh complete');
    } catch (err) {
      console.error('Failed to refresh past classes:', err.message);
    }
  };

  // Add a new course to the local state
  const addCourse = (course) => {
    setMyCourses((prev) => [...prev, course]);
  };

  // Test function to debug API endpoints
  const testAPIEndpoints = async () => {
    try {
      console.log('🧪 Testing API endpoints...');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
      } else {
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to test API endpoints.');
        }
        headers = user.authorizationHeaders();
      }

      // Test archived courses endpoint
      console.log('🧪 Testing archived courses endpoint...');
      const archivedTest = await fetch(`${API_BASE_URL}/v1/courses?past=true`, { headers });
      console.log('🧪 Archived courses test status:', archivedTest.status);
      const archivedTestData = await archivedTest.json();
      console.log('🧪 Archived courses test response:', archivedTestData);
      console.log('🧪 Archived courses count:', archivedTestData.courses?.length || 0);

      // Test active courses endpoint for comparison
      console.log('🧪 Testing active courses endpoint for comparison...');
      const activeTest = await fetch(`${API_BASE_URL}/v1/courses?active=true`, { headers });
      console.log('🧪 Active courses test status:', activeTest.status);
      const activeTestData = await activeTest.json();
      console.log('🧪 Active courses test response:', activeTestData);
      console.log('🧪 Active courses count:', activeTestData.courses?.length || 0);

      // Test all courses endpoint (no filters)
      console.log('🧪 Testing all courses endpoint (no filters)...');
      const allTest = await fetch(`${API_BASE_URL}/v1/courses`, { headers });
      console.log('🧪 All courses test status:', allTest.status);
      const allTestData = await allTest.json();
      console.log('🧪 All courses test response:', allTestData);
      console.log('🧪 All courses count:', allTestData.courses?.length || 0);

      // Test past classes endpoint
      console.log('🧪 Testing past classes endpoint...');
      const pastClassesTest = await fetch(`${API_BASE_URL}/v1/classes?past=true&expand=course`, {
        headers,
      });
      console.log('🧪 Past classes test status:', pastClassesTest.status);
      const pastClassesTestData = await pastClassesTest.json();
      console.log('🧪 Past classes test response:', pastClassesTestData);
      console.log('🧪 Past classes count:', pastClassesTestData.classes?.length || 0);
    } catch (error) {
      console.error('🧪 API test error:', error);
    }
  };

  return {
    myCourses,
    schedule,
    isLoading,
    error,
    setMyCourses,
    setSchedule,
    fetchCoursesAndClasses,
    refreshClasses,
    refreshCourses,
    refreshPastClasses,
    addCourse,
    archivedCourses,
    pastClasses,
    testAPIEndpoints, // Export the test function
  };
}
