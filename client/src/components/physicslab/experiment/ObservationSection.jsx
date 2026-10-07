import React from 'react';

export default function ObservationSection({ columns = [], observations = [] }) {
  return (
    <div className="animate-in fade-in duration-300 font-mono">
      <section className="bg-white rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="bg-yellow-300 px-6 py-4 border-b-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-black text-black uppercase">📋 Observation Table</h2>
            <p className="text-xs font-bold text-gray-800">
              Logged readings from interactive physics simulator trials.
            </p>
          </div>
          <span className="bg-black text-white px-3 py-1 text-xs font-black rounded border border-black shadow">
            {observations.length} RECORDINGS
          </span>
        </div>
        <div className="p-6 overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-black border-2 border-black rounded-lg overflow-hidden">
            <thead className="bg-amber-100 border-b-2 border-black">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} scope="col" className="px-4 py-3 text-left text-xs font-black text-black uppercase tracking-wider border-r-2 border-black last:border-r-0">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {observations.length === 0 ? (
                <tr>
                  <td colSpan={columns.length || 6} className="px-6 py-8 text-center text-gray-600 text-sm font-bold">
                    No observations recorded yet. Go to the <strong>"Lab Experiment"</strong> tab to perform the experiment and add readings.
                  </td>
                </tr>
              ) : (
                observations.map((obs, idx) => {
                  // Filter out internal non-display keys like 'trial' (timestamp)
                  const values = Object.entries(obs)
                    .filter(([key]) => key !== 'trial' && key !== 'id')
                    .map(([, val]) => val);

                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/60'}>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs font-black text-black border-r border-gray-300">
                        {idx + 1}
                      </td>
                      {values.map((val, vIdx) => (
                        <td key={vIdx} className="px-4 py-3.5 whitespace-nowrap text-xs font-bold text-gray-900 border-r border-gray-300 last:border-r-0">
                          {val}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
