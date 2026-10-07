import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraphSection({ observations = [], simulationType = '' }) {
  // Extract key-value pairs flexibly from observations
  const chartData = observations.map((obs, idx) => {
    let xVal = idx + 1;
    let yVal = 0;
    let xLabel = 'Trial';
    let yLabel = 'Value';

    // Parse values based on fields present in observation object
    if (obs.voltage !== undefined && obs.current !== undefined) {
      xVal = parseFloat(obs.current) || 0;
      yVal = parseFloat(obs.voltage) || 0;
      xLabel = 'Current I (A)';
      yLabel = 'Voltage V (V)';
    } else if (obs.u !== undefined && obs.v !== undefined) {
      xVal = Math.abs(parseFloat(obs.u) || 0);
      yVal = parseFloat(obs.v) || 0;
      xLabel = 'Object Distance |u| (cm)';
      yLabel = 'Image Distance v (cm)';
    } else if (obs.force !== undefined && obs.acceleration !== undefined) {
      xVal = parseFloat(obs.acceleration) || 0;
      yVal = parseFloat(obs.force) || 0;
      xLabel = 'Acceleration a (m/s²)';
      yLabel = 'Force F (N)';
    } else if (obs.angleIncidence !== undefined && obs.angleRefraction !== undefined) {
      xVal = parseFloat(obs.angleIncidence) || 0;
      yVal = parseFloat(obs.angleRefraction) || 0;
      xLabel = 'Angle i (deg)';
      yLabel = 'Angle r (deg)';
    } else if (obs.angleIncidence !== undefined && obs.angleReflection !== undefined) {
      xVal = parseFloat(obs.angleIncidence) || 0;
      yVal = parseFloat(obs.angleReflection) || 0;
      xLabel = 'Angle i (deg)';
      yLabel = 'Angle r (deg)';
    } else if (obs.frequency !== undefined && obs.wavelength !== undefined) {
      xVal = parseFloat(obs.frequency) || 0;
      yVal = parseFloat(obs.wavelength) || 0;
      xLabel = 'Frequency f (Hz)';
      yLabel = 'Wavelength λ (m)';
    } else {
      // General fallback
      const numericKeys = Object.keys(obs).filter(k => k !== 'trial' && !isNaN(parseFloat(obs[k])));
      if (numericKeys.length >= 2) {
        xVal = parseFloat(obs[numericKeys[0]]) || 0;
        yVal = parseFloat(obs[numericKeys[1]]) || 0;
        xLabel = numericKeys[0];
        yLabel = numericKeys[1];
      } else if (numericKeys.length === 1) {
        yVal = parseFloat(obs[numericKeys[0]]) || 0;
        xLabel = 'Trial';
        yLabel = numericKeys[0];
      }
    }

    return {
      trial: `Obs ${idx + 1}`,
      x: xVal,
      y: yVal,
      xLabel,
      yLabel
    };
  });

  const xTitle = chartData[0]?.xLabel || 'X Axis';
  const yTitle = chartData[0]?.yLabel || 'Y Axis';

  return (
    <div className="bg-white rounded-xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono min-h-[520px] flex flex-col">
      <div className="bg-yellow-300 px-4 py-3 border-2 border-black rounded-lg mb-6 flex justify-between items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-black uppercase text-black">
          📊 Observation Plot: {yTitle} vs {xTitle}
        </h2>
        <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">
          {observations.length} DATA POINTS
        </span>
      </div>

      <div className="flex-1 w-full min-h-[380px] bg-slate-50 p-4 border-2 border-black rounded-lg">
        {observations.length < 2 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-400 rounded-lg p-8 text-center">
            <span className="text-3xl mb-2">📈</span>
            <p className="font-bold text-gray-800">No Graph Available Yet</p>
            <p className="text-sm text-gray-600 mt-1">
              Please perform the experiment in the "Lab" tab and click "RECORD OBSERVATION" at least twice to generate the linear graph plot.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis
                dataKey="x"
                label={{ value: xTitle, position: 'insideBottom', offset: -15, fill: '#0f172a', fontWeight: 'bold' }}
              />
              <YAxis
                label={{ value: yTitle, angle: -90, position: 'insideLeft', offset: 10, fill: '#0f172a', fontWeight: 'bold' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fef08a',
                  border: '2px solid black',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 6, fill: '#ef4444', stroke: '#000', strokeWidth: 2 }}
                activeDot={{ r: 9, fill: '#10b981', stroke: '#000', strokeWidth: 2 }}
                name={`${yTitle} vs ${xTitle}`}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
