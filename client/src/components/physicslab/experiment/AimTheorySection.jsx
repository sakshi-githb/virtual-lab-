import React from 'react';

export default function AimTheorySection({ aim, theory }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Aim</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-800 text-lg">{aim}</p>
        </div>
      </section>
      
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Theory</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{theory}</p>
        </div>
      </section>
    </div>
  );
}
