// goals/components/Goals.jsx

import { useState } from 'react';
import TabsBar from '@/componentShared/TabsBar';
import AIChatWindow from '@/componentShared/AIChatWindow';
import GoalsPage from '@/features/goals/components/GoalsPage';

// Define tab constants
const TABS = {
  GRADES: 'grades',
  PROGRESS: 'progress',
  ESTIMATES: 'estimates',
  REPORTS: 'reports',
};

export default function Goals() {
  const [activeTab, setActiveTab] = useState(TABS.GRADES);

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

  return (
    <div className="max-w-4xl mx-auto">
      <TabsBar
        tabs={[
          { id: TABS.GRADES, label: 'Grades' },
          { id: TABS.PROGRESS, label: 'Progress' },
          { id: TABS.ESTIMATES, label: 'Estimates' },
          { id: TABS.REPORTS, label: 'Reports' },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
      />

      {activeTab === TABS.GRADES && (
        <div className="space-y-4">
          <GoalsPage />
        </div>
      )}

      {/* Progress Tab Content */}
      {activeTab === TABS.PROGRESS && (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">{goal.title}</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Deadline: {goal.deadline}</p>
                  <p className="text-gray-600">Status: {goal.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-semibold">{goal.progress}%</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estimates Tab Content */}
      {activeTab === TABS.ESTIMATES && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Grade Estimates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Current Grade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estimated Final
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Required for A
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estimates.map((estimate, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {estimate.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estimate.currentGrade}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estimate.estimatedFinal}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {estimate.requiredForA}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab Content */}
      {activeTab === TABS.REPORTS && (
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
                <p className="text-sm text-gray-500">
                  Complete record of your academic performance
                </p>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChatWindow />
    </div>
  );
}
