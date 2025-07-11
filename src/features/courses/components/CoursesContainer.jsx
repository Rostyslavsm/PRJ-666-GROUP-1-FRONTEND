import React, { useState, useEffect } from 'react';
import Modal from '../../../componentShared/Modal';
import { LoadingAnimation } from '../../animations';
import TabsBar from '../../../componentShared/TabsBar';
import CourseForm from './CourseForm';
import ClassesList from './ClassesList';
import CoursesList from './CoursesList';
import { useCourseSubmit, useClassDelete, useCourseDeletion, useCourseEdit } from '../';
import { useCourses } from '../hooks/useCourses';
import { secondsToTime, getWeekday, weekdayToIndex } from '../utils/timeUtils';

// Define tab constants for better readability
const TABS = {
  CLASSES: 'classes',
  COURSES: 'courses',
};

// Define tab display names
const TAB_LABELS = {
  [TABS.CLASSES]: 'My Classes',
  [TABS.COURSES]: 'My Courses',
};

export default function CoursesContainer() {
  const [activeTab, setActiveTab] = useState(TABS.CLASSES);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const { myCourses, schedule, isLoading, error, addCourse, refreshClasses, refreshCourses } =
    useCourses();

  const {
    submitCourse,
    isSubmitting,
    error: submitError,
    success: submitSuccess,
    resetState,
  } = useCourseSubmit();

  const {
    deleteClass,
    isDeleting: isDeletingClass,
    success: deleteClassSuccess,
    resetState: resetClassDeleteState,
  } = useClassDelete();

  const {
    deleteCourse,
    isDeleting: isDeletingCourse,
    success: deleteCourseSuccess,
    resetState: resetCourseDeletionState,
  } = useCourseDeletion();

  const {
    editCourse,
    isEditing,
    error: editError,
    success: editSuccess,
    resetState: resetEditState,
  } = useCourseEdit();

  // Reset the submit state when the form is closed
  useEffect(() => {
    if (!showForm) {
      resetState();
    }
  }, [showForm, resetState]);

  // If submission was successful, update UI
  useEffect(() => {
    if (submitSuccess) {
      setShowForm(false);
    }
  }, [submitSuccess]);

  // Refresh class data when a class is deleted successfully
  useEffect(() => {
    if (deleteClassSuccess) {
      refreshClasses();
      // Reset the success state after refreshing to prevent multiple refreshes
      resetClassDeleteState();
    }
  }, [deleteClassSuccess, refreshClasses, resetClassDeleteState]);

  // Refresh course data when a course is deleted successfully
  useEffect(() => {
    if (deleteCourseSuccess) {
      refreshCourses();
      // Reset the success state after refreshing to prevent multiple refreshes
      resetCourseDeletionState();
    }
  }, [deleteCourseSuccess, refreshCourses, resetCourseDeletionState]);

  // Refresh data when tab changes to ensure we have the latest data
  useEffect(() => {
    if (activeTab === TABS.CLASSES) {
      console.log('🔄 Tab changed to Classes, refreshing data');
      refreshClasses();
    } else if (activeTab === TABS.COURSES) {
      console.log('🔄 Tab changed to Courses, refreshing data');
      refreshCourses();
    }
  }, [activeTab]);

  // Add new useEffect for edit success
  useEffect(() => {
    if (editSuccess) {
      setShowForm(false);
      refreshCourses();
      resetEditState();
    }
  }, [editSuccess, refreshCourses, resetEditState]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  function handleAdd() {
    setEditData(null);
    setEditIndex(null);

    // If on Classes tab, switch to Courses tab before showing the form
    if (activeTab === TABS.CLASSES) {
      setActiveTab(TABS.COURSES);
    }

    setShowForm(true);
  }

  const handleDeleteClass = async (classId) => {
    if (!classId) {
      console.error('No class ID provided for deletion');
      return;
    }

    try {
      const result = await deleteClass(classId);

      if (!result.success && result.error) {
        // Show error message to user
        console.error('Error deleting class:', result.error);
        alert(`Failed to delete class: ${result.error}`);
      } else if (result.success) {
        console.log('Class deleted successfully');
        // The success state is already set in the hook, which will trigger the useEffect to refresh
      }
    } catch (err) {
      console.error('Exception during class deletion:', err);
      alert(`An error occurred: ${err.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) {
      console.error('No course ID provided for deletion');
      return;
    }

    try {
      const result = await deleteCourse(courseId);

      if (!result.success && result.error) {
        // Show error message to user
        console.error('Error deleting course:', result.error);
        alert(`Failed to delete course: ${result.error}`);
      } else if (result.success) {
        console.log('Course deleted successfully');
        // The success state is already set in the hook, which will trigger the useEffect to refresh
      }
    } catch (err) {
      console.error('Exception during course deletion:', err);
      alert(`An error occurred: ${err.message}`);
    }
  };

  const handleEditCourse = (course) => {
    // Transform the course data to match the form structure
    const formattedCourse = {
      title: course.title,
      code: course.code,
      section: course.section || 'A',
      color: course.color || '#4054e7',
      instructor: {
        name: course.professor || '',
        email: course.instructorEmail || '',
        availableTimeSlots: course.instructorTimeSlots?.map((slot) => ({
          weekday: weekdayToIndex(slot.weekDay),
          startTime: slot.startTime,
          endTime: slot.endTime,
        })) || [{ weekday: 1, startTime: '09:00', endTime: '10:00' }],
      },
      startDate: course.startDate || new Date().toISOString().split('T')[0],
      endDate:
        course.endDate ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      schedule: course.schedule.map((s) => {
        const [startTime, endTime] = s.time.split('–');
        return {
          classType: s.classType || 'lecture',
          weekday: weekdayToIndex(s.weekDay),
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          location: s.location || 'TBD',
        };
      }),
    };

    setEditData({
      ...formattedCourse,
      _id: course._id,
      currentGrade: course.currentGrade,
    });
    setShowForm(true);
  };

  async function handleSubmit(data) {
    if (
      !data.title ||
      !data.code ||
      !data.startDate ||
      !data.endDate ||
      !data.instructor?.name ||
      !data.instructor?.email ||
      !data.instructor?.availableTimeSlots?.length ||
      !data.schedule?.length
    ) {
      alert('All fields are required.');
      return;
    }

    try {
      const courseData = {
        title: data.title,
        code: data.code,
        section: data.section,
        status: 'active',
        startDate: data.startDate,
        endDate: data.endDate,
        color: data.color,
        // Preserve the currentGrade if it exists in editData
        ...(editData?.currentGrade && { currentGrade: editData.currentGrade }),
        instructor: {
          name: data.instructor.name,
          email: data.instructor.email,
          availableTimeSlots: data.instructor.availableTimeSlots.map((s) => ({
            weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekDay),
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
        schedule: data.schedule.map((s) => ({
          classType: s.classType || 'lecture',
          weekday: typeof s.weekday === 'number' ? s.weekday : weekdayToIndex(s.weekDay),
          startTime: s.startTime,
          endTime: s.endTime,
          location: s.location || 'TBD',
        })),
      };

      let result;
      if (editData?._id) {
        // Edit existing course
        console.log('📝 Updating course:', editData._id);
        result = await editCourse(editData._id, courseData);
      } else {
        // Create new course
        console.log('📤 Creating new course');
        result = await submitCourse(courseData);
      }

      if (result.success) {
        console.log('✅ Operation successful:', result);
        setShowForm(false);

        if (!editData?._id) {
          // Only add to UI immediately for new courses
          addCourse({
            _id: result.courseId || (result.course && result.course._id) || `temp-${Date.now()}`,
            title: result.course?.title || courseData.title,
            code: result.course?.code || courseData.code,
            section: result.course?.section || courseData.section,
            professor: result.course?.instructor?.name || courseData.instructor.name,
            color: result.course?.color || courseData.color,
            currentGrade: result.course?.currentGrade || {
              avg: 0,
              totalWeightSoFar: 0,
              weightRemaining: 100,
            },
            schedule: (result.course?.schedule || courseData.schedule).map((s) => ({
              time:
                typeof s.startTime === 'number'
                  ? `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`
                  : `${s.startTime}–${s.endTime}`,
              weekDay: getWeekday(s.weekday),
            })),
          });
        }

        // Refresh data
        await refreshClasses();
        await refreshCourses();

        // Switch to Classes tab for new courses
        if (!editData?._id) {
          setActiveTab(TABS.CLASSES);
        }
      } else {
        console.error('❌ Operation failed:', result.errors);
        alert(`Operation failed: ${result.errors?.join(', ') || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Exception during operation:', error);
      alert(`An error occurred: ${error.message}`);
    }
  }

  return (
    <div className="courses-container">
      <div className="profile-card">
        <TabsBar
          tabs={[
            { id: TABS.CLASSES, label: TAB_LABELS[TABS.CLASSES] },
            { id: TABS.COURSES, label: TAB_LABELS[TABS.COURSES] },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {!showForm && (
          <div className="add-course-row">
            <button className="button button-primary add-course-button" onClick={handleAdd}>
              + Add Course
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <LoadingAnimation size="large" />
            <p className="loading-text">Loading your courses...</p>
          </div>
        ) : (
          <div className="profile-content mt-4">
            {activeTab === TABS.CLASSES && (
              <ClassesList
                schedule={schedule}
                handleDeleteClass={handleDeleteClass}
                isDeletingClass={isDeletingClass}
              />
            )}

            {activeTab === TABS.COURSES && (
              <>
                <Modal
                  isOpen={showForm}
                  onClose={() => {
                    setShowForm(false);
                    setEditData(null);
                    resetState();
                    resetEditState();
                  }}
                  title={editData ? 'Edit Course' : 'Add New Course'}
                >
                  <CourseForm
                    initialData={editData}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setShowForm(false);
                      setEditData(null);
                      resetState();
                      resetEditState();
                    }}
                    isSubmitting={isSubmitting || isEditing}
                    error={submitError || editError}
                  />
                </Modal>

                <CoursesList
                  courses={myCourses}
                  handleAdd={handleAdd}
                  handleEdit={handleEditCourse}
                  handleDelete={handleDeleteCourse}
                  isDeleting={isDeletingCourse}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
