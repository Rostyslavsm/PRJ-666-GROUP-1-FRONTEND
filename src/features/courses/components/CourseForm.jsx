import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Predefined color options for courses
const COURSE_COLORS = [
  '#4054e7', // Blue
  '#f44336', // Red
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#795548', // Brown
  '#607D8B', // Blue Grey
];

export default function CourseForm({ initialData, onSubmit, onCancel, isSubmitting, error }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      code: '',
      section: 'A',
      color: '#4054e7', // Default color
      instructor: {
        name: '',
        email: '',
        availableTimeSlots: [{ weekday: 1, startTime: '09:00', endTime: '10:00' }],
      },
      startDate: '',
      endDate: '',
      schedule: [
        { classType: 'lecture', weekday: 1, startTime: '09:00', endTime: '10:00', location: 'TBD' },
      ],
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        instructor: {
          name: initialData.instructor?.name || '',
          email: initialData.instructor?.email || '',
          availableTimeSlots: initialData.instructor?.availableTimeSlots || [
            { weekday: 1, startTime: '09:00', endTime: '10:00' },
          ],
        },
        schedule: initialData.schedule || [
          {
            classType: 'lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:00',
            location: 'TBD',
          },
        ],
      });
    }
  }, [initialData, reset]);

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: 'schedule',
  });

  const {
    fields: slotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({
    control,
    name: 'instructor.availableTimeSlots',
  });

  // Watch the current color value
  const currentColor = watch('color');

  // Handle preset color selection
  const handleColorPresetClick = (color) => {
    setValue('color', color);
  };

  return (
    <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Display any API errors */}
      {error && <div className="modal-error">{error}</div>}

      {/* Title */}
      <div className="modal-form-group">
        <label className="modal-label">Course Title</label>
        <input {...register('title', { required: 'Required' })} className="modal-input" />
        {errors.title && <span className="error-message">{errors.title.message}</span>}
      </div>

      {/* Code */}
      <div className="modal-form-group">
        <label className="modal-label">Course Code</label>
        <input {...register('code', { required: 'Required' })} className="modal-input" />
        {errors.code && <span className="error-message">{errors.code.message}</span>}
      </div>

      {/* Section */}
      <div className="modal-form-group">
        <label className="modal-label">Section</label>
        <input {...register('section', { required: 'Required' })} className="modal-input" />
        {errors.section && <span className="error-message">{errors.section.message}</span>}
      </div>

      {/* Color Picker */}
      <div className="modal-form-group">
        <label className="modal-label">Course Color</label>
        <div className="color-picker-container">
          <input
            type="color"
            {...register('color', { required: 'Required' })}
            className="form-color-input"
          />
          <span className="color-value">{currentColor}</span>
        </div>

        {/* Color presets */}
        <div className="color-presets">
          {COURSE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-preset ${color === currentColor ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorPresetClick(color)}
              title={color}
            />
          ))}
        </div>

        {errors.color && <span className="error-message">{errors.color.message}</span>}
      </div>

      {/* Instructor */}
      <div className="modal-form-group">
        <label className="modal-label">Instructor Name</label>
        <input {...register('instructor.name', { required: 'Required' })} className="modal-input" />
        <label className="modal-label">Instructor Email</label>
        <input
          {...register('instructor.email', {
            required: 'Required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="modal-input"
          type="email"
        />
        {errors.instructor?.email && (
          <span className="error-message">{errors.instructor.email.message}</span>
        )}
      </div>

      {/* Instructor Time Slots */}
      <div className="modal-form-group">
        <label className="modal-label">Instructor Available Time Slots</label>
        {slotFields.map((field, idx) => (
          <div key={field.id} className="form-schedule-item">
            <select
              {...register(`instructor.availableTimeSlots.${idx}.weekday`, { valueAsNumber: true })}
              className="modal-input"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>
            <input
              type="time"
              {...register(`instructor.availableTimeSlots.${idx}.startTime`)}
              className="modal-input"
            />
            <input
              type="time"
              {...register(`instructor.availableTimeSlots.${idx}.endTime`)}
              className="modal-input"
            />
            <button
              type="button"
              onClick={() => removeSlot(idx)}
              className="modal-button modal-cancel-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendSlot({ weekday: 1, startTime: '09:00', endTime: '10:00' })}
          className="modal-button modal-cancel-button"
        >
          + Add Slot
        </button>
      </div>

      {/* Start / End Date */}
      <div className="course-form-row">
        <div className="modal-form-group">
          <label className="modal-label">Start Date</label>
          <input
            type="date"
            {...register('startDate', { required: 'Required' })}
            className="modal-input"
          />
        </div>
        <div className="modal-form-group">
          <label className="modal-label">End Date</label>
          <input
            type="date"
            {...register('endDate', { required: 'Required' })}
            className="modal-input"
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="modal-form-group">
        <label className="modal-label">Schedule</label>
        {scheduleFields.map((field, idx) => (
          <div key={field.id} className="form-schedule-item">
            <select {...register(`schedule.${idx}.classType`)} className="modal-input">
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
            </select>
            <select
              {...register(`schedule.${idx}.weekday`, { valueAsNumber: true })}
              className="modal-input"
            >
              {DAYS.map((d, i) => (
                <option key={i} value={i + 1}>
                  {d}
                </option>
              ))}
            </select>
            <input type="time" {...register(`schedule.${idx}.startTime`)} className="modal-input" />
            <input type="time" {...register(`schedule.${idx}.endTime`)} className="modal-input" />
            <input
              {...register(`schedule.${idx}.location`)}
              className="modal-input"
              placeholder="Location (room number)"
            />
            <button
              type="button"
              onClick={() => removeSchedule(idx)}
              className="modal-button modal-cancel-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            appendSchedule({
              classType: 'lecture',
              weekday: 1,
              startTime: '09:00',
              endTime: '10:00',
              location: 'TBD',
            })
          }
          className="modal-button modal-cancel-button"
        >
          + Add Class
        </button>
      </div>

      {/* Submit buttons */}
      <div className="modal-actions">
        <button
          type="button"
          onClick={onCancel}
          className="modal-button modal-cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="modal-button modal-submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Course' : 'Add Course'}
        </button>
      </div>

      <style jsx>{`
        .course-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          color: #2f3e46;
          padding-right: 5px;
          background-color: #cad2c5; /* Match the modal background color */
        }

        .color-picker-container {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .form-color-input {
          width: 50px;
          height: 40px;
          padding: 0;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }

        .color-value {
          margin-left: 10px;
          font-family: monospace;
        }

        .color-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .color-preset {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid #e0e0e0;
          cursor: pointer;
          transition:
            transform 0.2s,
            border-color 0.2s;
        }

        .color-preset:hover {
          transform: scale(1.1);
        }

        .color-preset.active {
          border-color: #333;
          transform: scale(1.1);
        }

        .course-form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
        }

        .course-form-row .modal-form-group {
          flex: 1;
        }

        .form-schedule-item {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.3);
          padding: 10px;
          border-radius: 8px;
        }

        .error-message {
          color: #a72f38;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .course-form-row {
            flex-direction: column;
            gap: 10px;
          }

          .form-schedule-item {
            flex-direction: column;
            align-items: stretch;
          }

          .form-schedule-item .modal-input {
            margin-bottom: 5px;
          }
        }
      `}</style>
    </form>
  );
}
