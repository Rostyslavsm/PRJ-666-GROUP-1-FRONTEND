import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { fetchGoals } from '@/features/goals/services/goalService'; // Import the fetchGoals function
import LoadingAnimation from '../../animations/LoadingAnimation';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Card = ({ className, children, ...props }) => {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
};

const CardContent = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export default function ProfileStats() {
  const { isLoading, upcomingEvent, completionPercentage = 0, formatEventDate } = useProfile();

  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283);
  const [goalsData, setGoalsData] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [delayDone, setDelayDone] = useState(false);

  !delayDone && setTimeout(() => setDelayDone(true), 4000);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setGoalsLoading(true);
        const response = await fetchGoals(true);
        const transformedData = response.map((goal) => {
          // Safely get current grade average with null checks

          const actual = goal.course?.currentGrade?.avg || 0;
          const expected = goal.targetGrade || 0;
          console.log('goal message ', actual || 0);
          return {
            course: goal.course?.code || 'Unknown',
            actual: parseFloat(actual.toFixed(1)),
            expected: parseFloat(expected.toFixed(1)),
          };
        });

        setGoalsData(transformedData);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoalsData([]);
      } finally {
        setGoalsLoading(false);
      }
    };

    loadGoals();
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isLoading && completionPercentage > 0) {
      // Reset to 0 when data loads
      setAnimatedPercentage(0);
      setAnimatedOffset(283);

      const duration = 3000; // 3 seconds
      const startTime = Date.now();
      const initialOffset = 283; // Full circle offset
      const targetOffset = 283 - (283 * completionPercentage) / 100;

      const animateProgress = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < duration) {
          // Calculate current percentage based on elapsed time
          const currentPercentage = Math.min(
            Math.floor((elapsed / duration) * completionPercentage),
            completionPercentage
          );

          // Calculate current circle offset
          const currentOffset =
            initialOffset - ((initialOffset - targetOffset) * elapsed) / duration;

          setAnimatedPercentage(currentPercentage);
          setAnimatedOffset(currentOffset);

          // Continue animation
          requestAnimationFrame(animateProgress);
        } else {
          // Ensure we end exactly at the target values
          setAnimatedPercentage(completionPercentage);
          setAnimatedOffset(targetOffset);
        }
      };

      // Start animation
      requestAnimationFrame(animateProgress);
    }
  }, [isLoading, completionPercentage]);

  return (
    <div className="profile-stats">
      {/* Study Sessions - Slide in from left */}
      <Card
        className="profile-card"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Study Sessions</div>
          {isLoading ? (
            <div className="profile-session-content flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : upcomingEvent ? (
            <div className="profile-session-content">
              <div className="profile-session-time">{formatEventDate(upcomingEvent.start)}</div>
              <div className="profile-session-title">{upcomingEvent.title}</div>
            </div>
          ) : (
            <div className="profile-session-content">
              <div className="profile-session-title">No upcoming events</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks Completed - Fade in */}
      <Card
        className="profile-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
      >
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Tasks Completed</div>
          {isLoading ? (
            <div className="profile-tasks-content flex justify-center items-center py-4">
              <LoadingAnimation size="small" />
            </div>
          ) : (
            <div className="profile-tasks-content">
              <div className="profile-circle-chart">
                <svg className="profile-chart-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2F3E46" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#52796F"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={animatedOffset}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="profile-chart-percentage">{animatedPercentage}%</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* goal progress */}
      <Card
        className="profile-card"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
      >
        <CardContent className="profile-card-content">
          <div className="profile-card-header">Goal Progress</div>

          {goalsLoading && isLoading ? (
            <div className="flex justify-center items-center py-4" style={{ height: 220 }}>
              <LoadingAnimation size="small" />
            </div>
          ) : goalsData && goalsData.length > 0 ? (
            <div className="profile-goals-chart-container">
              {!delayDone ? (
                <div className="flex justify-center items-center py-4" style={{ height: 220 }}>
                  <LoadingAnimation size="small" />
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={goalsData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      barSize={20}
                      barCategoryGap={20}
                      barGap={0}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="course"
                        textAnchor="end"
                        angle={-45}
                        fontWeight="bold"
                        fontSize="7px"
                      />
                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tick={{
                          fontSize: 12,
                          fill: '#333',
                          fontWeight: 'bold',
                        }}
                        width={40}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          return [`${value}%`, name];
                        }}
                        labelFormatter={(label) => `Course: ${label}`}
                        contentStyle={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '12px' }} />
                      <Bar
                        dataKey="actual"
                        fill="#2E86DE"
                        name="Current Grade"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expected"
                        fill="#E74C3C"
                        name="Target Grade"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          ) : (
            <div className="profile-goals-empty-container">
              <div className="profile-goals-empty-icon-wrapper">
                <div className="profile-goals-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="profile-goals-empty-icon-plus">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="profile-goals-empty-title">No Goal Data</h3>
              <p className="profile-goals-empty-description">
                Set academic goals to visualize your progress
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
