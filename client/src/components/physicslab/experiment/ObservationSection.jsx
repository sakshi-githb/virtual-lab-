import React from 'react';

export default function ObservationSection({ columns, observations }) {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Observation Table</h2>
        </div>
        <div className="p-6 overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No observations recorded yet. Go to the Lab tab to perform the experiment and add readings.
                  </td>
                </tr>
              ) : (
                observations.map((obs, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                    {/* Assuming observations is an array of objects where keys match columns conceptually, 
                        for simplicity we'll render specific keys if we know them, 
                        or assume an array of values corresponding to columns [1..end] */}
                    {Object.values(obs).map((val, vIdx) => (
                      <td key={vIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{val}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
