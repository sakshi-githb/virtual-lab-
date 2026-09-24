import React from 'react';
import { usePhysicsLab } from '../../context/PhysicsLabContext';

export default function TeacherDashboard() {
  const { currentUser } = usePhysicsLab();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-8">Teacher Dashboard</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome, {currentUser?.name || 'Teacher'}!</h2>
        <p className="text-gray-600">Manage your classes and view student progress.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Class Management</h3>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </div>
  );
}
