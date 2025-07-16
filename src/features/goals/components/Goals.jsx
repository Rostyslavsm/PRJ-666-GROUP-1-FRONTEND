// goals/components/Goals.jsx

import { useState } from 'react';
import TabsBar from '@/componentShared/TabsBar';
import AIChatWindow from '@/componentShared/AIChatWindow';
import GoalsPage from '@/features/goals/components/GoalsPage';
import Estimates from '@/features/goals/components/Estimates';
import GoalReportPage from './Reports';

// Define tab constants
const TABS = {
  MY_GOALS: 'myGoals',
  REPORTS: 'reports',
  ESTIMATES: 'estimates',
};

export default function Goals() {
  const [activeTab, setActiveTab] = useState(TABS.MY_GOALS);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const goals = [
    {
      id: 1,
      title: 'Maintain 3.8 GPA',
      category: 'Academic',
      deadline: '2024-12-31',
      progress: 85,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Complete Internship',
      category: 'Career',
      deadline: '2024-08-31',
      progress: 60,
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Learn React Native',
      category: 'Skills',
      deadline: '2024-06-30',
      progress: 30,
      status: 'In Progress',
    },
  ];

  const grades = [
    { course: 'Web Development', grade: 'A', percentage: 92 },
    { course: 'Database Design', grade: 'A-', percentage: 88 },
    { course: 'Mobile App Development', grade: 'B+', percentage: 85 },
    { course: 'UI/UX Design', grade: 'A', percentage: 94 },
  ];

  const estimates = [
    { course: 'Web Development', currentGrade: 92, estimatedFinal: 94, requiredForA: 90 },
    { course: 'Database Design', currentGrade: 88, estimatedFinal: 89, requiredForA: 92 },
    { course: 'Mobile App Development', currentGrade: 85, estimatedFinal: 87, requiredForA: 90 },
    { course: 'UI/UX Design', currentGrade: 94, estimatedFinal: 95, requiredForA: 'Achieved' },
  ];

  // Reports content from the original file
  const renderReportsContent = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Academic Reports</h2>
        <p className="text-gray-600 mb-4">Generate and view your academic reports.</p>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">Term Progress Report</h3>
              <p className="text-sm text-gray-500">Overview of your current term progress</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">GPA Calculation</h3>
              <p className="text-sm text-gray-500">Calculate your current and projected GPA</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">Academic History</h3>
              <p className="text-sm text-gray-500">Complete record of your academic performance</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEstimatesContent = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Grade Calculator</h2>
        <p className="text-gray-600 mb-4">Review your current Grade</p>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">Estimated Grade</h3>
              <p className="text-sm text-gray-500">Overview of your estimated grades</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">GRADE</h3>
              <p className="text-sm text-gray-500">Your Current Grade</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Grade
            </button>
          </div>

          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
            <div>
              <h3 className="font-medium">Estimate</h3>
              <p className="text-sm text-gray-500">Estimate</p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Generate
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <TabsBar
        tabs={[
          { id: TABS.MY_GOALS, label: 'My Goals' },
          { id: TABS.REPORTS, label: 'Reports' },
          { id: TABS.ESTIMATES, label: 'Estimates' },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
      />

      {activeTab === TABS.MY_GOALS && <GoalsPage />}
      {activeTab === TABS.REPORTS && <GoalReportPage />}
      {activeTab === TABS.ESTIMATES && <Estimates />}

      <AIChatWindow />
    </div>
  );
}
