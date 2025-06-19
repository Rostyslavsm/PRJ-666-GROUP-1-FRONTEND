import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCardAdapter from './EventCardAdapter';
import { useEvents } from '..';

function EventCompleted({ groups, onGroupsUpdate }) {
  const { toggleEventStatus, deleteEventById, fetchCompleted, setEventGrade } = useEvents();
  const [width, setWidth] = useState(window.innerWidth);
  const [updatingEventId, setUpdatingEventId] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [savingGradeId, setSavingGradeId] = useState(null);
  const [pageNumbers, setPageNumbers] = useState({});

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const tasksPerPage = () => {
    if (width < 768) return 1;
    if (width < 1199) return 2;
    return 3;
  };

  const markIncomplete = async (task) => {
    // Extract the correct ID based on what's available
    const eventId = task._id || task.id;

    if (!eventId) {
      console.error('Cannot mark as incomplete: Missing task ID', task);
      return;
    }

    setUpdatingEventId(eventId);
    try {
      // Optimistically update UI by removing the event from the local state
      const updatedGroups = groups
        .map((group) => ({
          ...group,
          tasks: group.tasks.filter((t) => t._id !== eventId && t.id !== eventId),
        }))
        .filter((group) => group.tasks.length > 0);

      // Update parent component state
      if (typeof onGroupsUpdate === 'function') {
        onGroupsUpdate(updatedGroups);
      }

      await toggleEventStatus(eventId, false);
      // Refresh the completed events list after updating
      await fetchCompleted();
    } catch (error) {
      console.error('Failed to mark event as incomplete:', error);
    } finally {
      setUpdatingEventId(null);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!eventId) {
      console.error('Cannot delete: Missing event ID');
      return;
    }

    setDeletingEventId(eventId);
    try {
      // Optimistically update UI by removing the event from the local state
      const updatedGroups = groups
        .map((group) => ({
          ...group,
          tasks: group.tasks.filter((t) => t._id !== eventId && t.id !== eventId),
        }))
        .filter((group) => group.tasks.length > 0);

      // Update parent component state
      if (typeof onGroupsUpdate === 'function') {
        onGroupsUpdate(updatedGroups);
      }

      const result = await deleteEventById(eventId);
      if (!result) {
        console.error('Failed to delete event');
        alert('Failed to delete event. Please try again.');
      } else {
        // Refresh the events list after deletion
        await fetchCompleted();
      }
    } catch (error) {
      console.error('Error during event deletion:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleSaveGrade = async (eventId, grade) => {
    if (!eventId) {
      console.error('Cannot save grade: Missing event ID');
      return false;
    }

    setSavingGradeId(eventId);
    try {
      // Find the task in the groups to get the group date
      let updatedGroups = [...groups];
      let groupWithEvent;

      // Find the group containing this event
      for (const group of groups) {
        const taskIndex = group.tasks.findIndex((t) => t._id === eventId || t.id === eventId);

        if (taskIndex !== -1) {
          // Update the grade in our local state
          const updatedTasks = [...group.tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            grade,
          };

          groupWithEvent = {
            ...group,
            tasks: updatedTasks,
          };

          updatedGroups = groups.map((g) => (g.date === group.date ? groupWithEvent : g));

          break;
        }
      }

      // Update parent component state if we found the event
      if (groupWithEvent && typeof onGroupsUpdate === 'function') {
        onGroupsUpdate(updatedGroups);
      }

      // Call the API to update the grade
      const success = await setEventGrade(eventId, grade);

      if (!success) {
        console.error('Failed to save grade');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving grade:', error);
      return false;
    } finally {
      setSavingGradeId(null);
    }
  };

  const onPageChange = (groupDate) => (data) => {
    setPageNumbers((prev) => ({
      ...prev,
      [groupDate]: data.selected,
    }));
  };

  if (!groups || groups.length === 0) {
    return <p className="empty-message">No completed events yet!</p>;
  }

  return (
    <>
      {groups.map((group) => {
        const perPage = tasksPerPage();
        const currentPage = pageNumbers[group.date] || 0;
        const pageCount = Math.ceil(group.tasks.length / perPage);
        const visibleTasks = group.tasks.slice(currentPage * perPage, (currentPage + 1) * perPage);

        return (
          <div key={group.date} className="events-group-container">
            <h2 className="events-group-date">
              {new Date(group.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: '2-digit',
                day: '2-digit',
              })}
            </h2>

            <div className="events-tasks-grid">
              {visibleTasks.map((task) => {
                const taskId = task._id || task.id;

                return (
                  <div key={taskId} className="event-card-wrapper">
                    <EventCardAdapter
                      task={task}
                      onToggle={() => markIncomplete(task)}
                      onSetGrade={handleSaveGrade}
                      onDelete={deleteEvent}
                      isUpdating={updatingEventId === taskId}
                      isDeleting={deletingEventId === taskId}
                      isSavingGrade={savingGradeId === taskId}
                    />
                    {process.env.NODE_ENV === 'development' && (
                      <div
                        className="debug-info"
                        style={{
                          fontSize: '10px',
                          color: '#999',
                          marginTop: '-12px',
                          marginBottom: '8px',
                        }}
                      >
                        ID: {task.id}, _ID: {task._id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={<span className="events-pagination-arrow">&lt;</span>}
                nextLabel={<span className="events-pagination-arrow">&gt;</span>}
                pageCount={pageCount}
                onPageChange={onPageChange(group.date)}
                forcePage={currentPage}
                containerClassName="events-pagination-container"
                pageClassName="events-pagination-item"
                pageLinkClassName="events-pagination-link"
                activeClassName="events-active-page"
                previousClassName="events-pagination-nav"
                nextClassName="events-pagination-nav"
                disabledClassName="events-disabled-nav"
                breakLabel="..."
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default EventCompleted;
