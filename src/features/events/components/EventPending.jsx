import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCardAdapter from './EventCardAdapter';
import { useEvents } from '..';

function EventPending({ groups, onGroupsUpdate }) {
  const { toggleEventStatus, deleteEventById, fetchPending } = useEvents();
  const [pages, setPages] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [updatingEventId, setUpdatingEventId] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const perPage = width < 768 ? 1 : width < 1199 ? 2 : 3;

  const markDone = async (task) => {
    // Extract the correct ID based on what's available
    const eventId = task._id || task.id;

    if (!eventId) {
      console.error('Cannot mark as done: Missing task ID', task);
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

      // Update any parent component that uses this state
      if (typeof onGroupsUpdate === 'function') {
        onGroupsUpdate(updatedGroups);
      }

      await toggleEventStatus(eventId, true);
      // Refresh the events list after updating
      await fetchPending();
    } catch (error) {
      console.error('Failed to mark event as done:', error);
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

      // Update any parent component that uses this state
      if (typeof onGroupsUpdate === 'function') {
        onGroupsUpdate(updatedGroups);
      }

      const result = await deleteEventById(eventId);
      if (!result) {
        console.error('Failed to delete event');
        alert('Failed to delete event. Please try again.');
      } else {
        // Refresh the events list after deletion
        await fetchPending();
      }
    } catch (error) {
      console.error('Error during event deletion:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setDeletingEventId(null);
    }
  };

  const changePage = (date) => (selected) => {
    setPages((prev) => ({ ...prev, [date]: selected.selected }));
  };

  useEffect(() => {
    const newPages = { ...pages };
    groups.forEach((g) => {
      const maxPage = Math.ceil(g.tasks.length / perPage) - 1;
      if ((pages[g.date] || 0) > maxPage) {
        newPages[g.date] = Math.max(0, maxPage);
      }
    });
    setPages(newPages);
  }, [groups, width]);

  if (!groups || !groups.length) {
    return <p className="empty-message">No upcoming events!</p>;
  }

  return (
    <>
      {groups.map((group) => {
        const page = pages[group.date] || 0;
        const totalPages = Math.ceil(group.tasks.length / perPage);
        const start = page * perPage;
        const shownTasks = group.tasks.slice(start, start + perPage);

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
              {shownTasks.map((task) => {
                const taskId = task._id || task.id;
                return (
                  <div key={taskId} className="event-card-wrapper">
                    <EventCardAdapter
                      task={task}
                      onToggle={() => markDone(task)}
                      onDelete={deleteEvent}
                      isUpdating={updatingEventId === taskId}
                      isDeleting={deletingEventId === taskId}
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

            {totalPages > 1 && (
              <ReactPaginate
                previousLabel={<span className="events-pagination-arrow">&lt;</span>}
                nextLabel={<span className="events-pagination-arrow">&gt;</span>}
                pageCount={totalPages}
                onPageChange={changePage(group.date)}
                forcePage={page}
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

export default EventPending;
