import React from 'react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';

export default function StudentDashboard() {
  const { currentUser } = usePhysicsLab();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-8">Student Dashboard</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {currentUser?.name || 'Student'}!</h2>
        <p className="text-gray-600">Track your progress and continue your experiments.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-4xl font-bold text-[#1E3A5F] mb-2">0</div>
          <div className="text-gray-600 font-medium">Completed</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-4xl font-bold text-[#F59E0B] mb-2">0</div>
          <div className="text-gray-600 font-medium">In Progress</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">0%</div>
          <div className="text-gray-600 font-medium">Average Score</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Activity</h3>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </div>
  );
}
