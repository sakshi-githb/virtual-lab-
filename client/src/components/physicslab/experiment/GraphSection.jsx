import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraphSection({ observations }) {
  // Transform observations to chart data
  // Using u and v values specifically for Lens experiment for now
  const chartData = observations.map((obs, idx) => ({
    name: `Obs ${idx + 1}`,
    u: Math.abs(obs.u || 0), // Use absolute u for plotting
    v: obs.v || 0
  }));

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[500px]">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F]">Graph: Object Distance vs Image Distance</h2>
        </div>
        <div className="p-6 flex-1 w-full">
          {observations.length < 2 ? (
            <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              Record at least 2 observations to view the graph.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="u" label={{ value: 'Object Distance |u| (cm)', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: 'Image Distance v (cm)', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="v" stroke="#1E3A5F" strokeWidth={3} activeDot={{ r: 8 }} name="v vs |u|" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
