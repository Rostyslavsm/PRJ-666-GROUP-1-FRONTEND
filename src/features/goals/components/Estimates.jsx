import { useGoals } from '@/features/goals/hooks/useGoals';
import { useEvents } from '@/features/events/hooks/useEvents';
import DeleteButton from '../../../componentShared/DeleteButton';
import { useState, useEffect } from 'react';

export default function EstimatesTab() {
  const { courses } = useGoals();
  const { completedEvents, fetchCompleted } = useEvents();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    fetchCompleted();
  }, []);

  const selectedCourse = courses.find(c => c._id === selectedCourseId);
  // Use completed events from the events hook, filtered by course
  const courseCompletedEvents = completedEvents.filter(ev => ev.courseID === selectedCourseId);

  // Calculate projected grade (completed + estimated events)
  // Only include estimates with a valid grade
  const validEstimates = estimates.filter(e => e.grade !== '' && e.grade !== null && e.grade !== undefined && !isNaN(Number(e.grade)));
  const allEvents = [...courseCompletedEvents, ...validEstimates];
  const totalWeight = allEvents.reduce((sum, e) => sum + (Number(e.weight) || 0), 0);
  const weightedSum = allEvents.reduce((sum, e) => sum + ((Number(e.grade) || 0) * (Number(e.weight) || 0)), 0);
  const projectedGrade = totalWeight > 0 ? (weightedSum / totalWeight) : null;

  function handleAddEstimate() {
    setEstimates([...estimates, { name: '', weight: '', grade: '' }]);
  }

  function handleDeleteEstimate(idx) {
  setEstimates(estimates.filter((_, i) => i !== idx));
}

  function handleEstimateChange(idx, field, value) {
    let newValue = value;
    if (field === 'grade' || field === 'weight') {
      if (value === '') {
        newValue = '';
      } else {
        const num = Number(value);
        if (!isNaN(num)) {
          newValue = Math.max(0, Math.min(100, num));
        }
      }
    }
    const updated = estimates.map((e, i) =>
      i === idx ? { ...e, [field]: newValue } : e
    );
    setEstimates(updated);
  }

  return (
  <div className="goals-content">
    {/* Instruction Text and Dropdown */}
    <div className="goals-info-text" style={{ marginTop: '10px', marginBottom: '20px' }}>
      <h2>Please select a course to begin the estimate</h2>
      <select style={{textAlign: 'center', width: '100%', fontSize: 'larger'}}
        value={selectedCourseId}
        onChange={e => {
          setSelectedCourseId(e.target.value);
          setEstimates([]);
        }}
      >
        <option>-- Select a course --</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.code} - {course.title}
          </option>
        ))}
      </select>
    </div>

    {/* Conditionally Show Estimates Section */}
    {selectedCourse && (
      <div className="goals-estimates-group-container">
        <h2 className="goals-estimates-group-title">
          {courseCompletedEvents.length > 0
            ? `Past Events for ${selectedCourse.code} - ${selectedCourse.title}`
            : `No Past Events found for ${selectedCourse.code} - ${selectedCourse.title}, Add Estimates!`}
        </h2>

        <div className="goals-estimates-table-container">
          <table className="goals-estimates-past-events-table">
            <thead>
              <tr>
                <th>Name of Task</th>
                <th>Weight</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {courseCompletedEvents.map((ev, i) => (
                <tr key={`completed-${i}`}>
                  <td>{ev.title}</td>
                  <td>{ev.weight}</td>
                  <td>{ev.grade != null ? ev.grade : 'N/A'}</td>
                </tr>
              ))}

              {estimates.map((ev, i) => (
                <tr key={`est-${i}`}>
                  <td>
                    <input
                      className="goals-input-title"
                      placeholder="Title"
                      value={ev.name}
                      onChange={e => handleEstimateChange(i, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="goals-input"
                      placeholder="Weight"
                      type="number"
                      value={ev.weight}
                      onChange={e => handleEstimateChange(i, 'weight', e.target.value)}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="goals-estimates-grade-cell">
                    <div className="grade-cell-wrapper">
                      <input
                        className="goals-input-grade"
                        placeholder="Grade"
                        type="number"
                        value={ev.grade}
                        onChange={e => handleEstimateChange(i, 'grade', e.target.value)}
                        min="0"
                        max="100"
                      />
                      <DeleteButton style={{ marginLeft: '10px' }}
                        onClick={() => handleDeleteEstimate(i)}
                        title="Delete Estimate"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Estimate Button */}
        <div className="add-course-row" style={{ padding: '25px', paddingBottom: '0' }}>
          <button
            className="button button-primary add-course-button"
            onClick={handleAddEstimate}
          >
            + Add Estimate
          </button>
        </div>

        {/* Grade Cards */}
        <div className="goals-grid" style={{ padding: '25px', paddingBottom: '25px' }}>
          <div className="goals-estimates-card">
            <span>Actual Grade:</span>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              {courseCompletedEvents.length === 0
                ? '0'
                : selectedCourse.currentGrade?.avg != null
                  ? Number(selectedCourse.currentGrade.avg).toFixed(0)
                  : '0'} %
            </span>
          </div>
          <div className="goals-estimates-card">
            <span>Projected Grade:</span>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              {projectedGrade != null ? projectedGrade.toFixed(0) : '0'} %
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
);

}