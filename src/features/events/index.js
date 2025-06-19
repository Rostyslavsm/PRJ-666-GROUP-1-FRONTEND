export { useEvents } from './hooks/useEvents';
export { useCourses } from './hooks/useCourses';
export { default as Events } from './components/Events';
export {
  fetchUpcomingEvents,
  fetchPendingEvents,
  fetchCompletedEvents,
  fetchCourses,
  createEvent,
  updateEventStatus,
  deleteEvent,
} from './services/eventService';

// Export components
export { default as EventForm } from './components/EventForm';
export { default as EventPending } from './components/EventPending';
export { default as EventCompleted } from './components/EventCompleted';
export { default as EventsLoading } from './components/EventsLoading';
export { default as EventsError } from './components/EventsError';

// Export hooks
export { useEventDelete } from './hooks/useEventDelete';

// Export utils
export { groupTasksByDate, getDateKey } from './utils/dateUtils';
