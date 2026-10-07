import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export default function GraphSection({ observations = [], simulationType = '' }) {
  // Helper to extract clean numeric value from string or number (e.g. "40°" -> 40, "104.60 kJ" -> 104.6)
  const parseNum = (val) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'number') return isNaN(val) || !isFinite(val) ? 0 : val;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  // Transform raw observation objects into chart-friendly data points
  const chartData = observations.map((obs, idx) => {
    let xVal = idx + 1;
    let yVal = 0;
    let xLabel = 'Trial Number';
    let yLabel = 'Measured Value';
    let xDisplay = `Obs ${idx + 1}`;

    // 1. Ohm's Law & Series-Parallel (Voltage vs Current)
    if ((obs.voltage !== undefined || obs.V !== undefined) && (obs.current !== undefined || obs.I !== undefined)) {
      xVal = parseNum(obs.current ?? obs.I);
      yVal = parseNum(obs.voltage ?? obs.V);
      xLabel = 'Current I (A)';
      yLabel = 'Voltage V (V)';
      xDisplay = `${xVal} A`;
    }
    // 2. Convex & Concave Lens (Image Distance v vs Object Distance u)
    else if (obs.u !== undefined && obs.v !== undefined) {
      xVal = Math.abs(parseNum(obs.u));
      yVal = parseNum(obs.v);
      xLabel = 'Object Distance |u| (cm)';
      yLabel = 'Image Distance v (cm)';
      xDisplay = `${xVal} cm`;
    }
    // 3. Newton's 2nd Law (Force vs Acceleration)
    else if (obs.force !== undefined && obs.acceleration !== undefined) {
      xVal = parseNum(obs.acceleration);
      yVal = parseNum(obs.force);
      xLabel = 'Acceleration a (m/s²)';
      yLabel = 'Force F (N)';
      xDisplay = `${xVal} m/s²`;
    }
    // 4. Force on Conductor (Force vs Current)
    else if (obs.force !== undefined && obs.current !== undefined) {
      xVal = parseNum(obs.current);
      yVal = parseNum(obs.force);
      xLabel = 'Current I (A)';
      yLabel = 'Force F (N)';
      xDisplay = `${xVal} A`;
    }
    // 5. Reflection & Refraction (Angle r vs Angle i)
    else if (obs.angleIncidence !== undefined && (obs.angleRefraction !== undefined || obs.angleReflection !== undefined)) {
      xVal = parseNum(obs.angleIncidence);
      yVal = parseNum(obs.angleRefraction ?? obs.angleReflection);
      xLabel = 'Angle of Incidence i (°)';
      yLabel = 'Angle r (°)';
      xDisplay = `${xVal}°`;
    }
    // 6. Sound Waves (Wavelength vs Frequency)
    else if (obs.frequency !== undefined && obs.wavelength !== undefined) {
      xVal = parseNum(obs.frequency);
      yVal = parseNum(obs.wavelength);
      xLabel = 'Frequency f (Hz)';
      yLabel = 'Wavelength λ (m)';
      xDisplay = `${xVal} Hz`;
    }
    // 7. Work & Energy (KE vs PE or Height)
    else if (obs.height !== undefined && (obs.pe !== undefined || obs.ke !== undefined)) {
      xVal = parseNum(obs.height);
      yVal = parseNum(obs.pe ?? obs.ke);
      xLabel = 'Height h (m)';
      yLabel = 'Energy (J)';
      xDisplay = `${xVal} m`;
    }
    // 8. Heat Transfer (Heat Q vs Mass m or Delta T)
    else if (obs.heatRequired !== undefined || obs.mass !== undefined) {
      xVal = parseNum(obs.mass ?? obs.deltaTemp ?? idx + 1);
      yVal = parseNum(obs.heatRequired ?? obs.finalTemp);
      xLabel = obs.mass !== undefined ? 'Mass m (kg)' : 'Trial';
      yLabel = 'Heat Energy Q (kJ)';
      xDisplay = `${xVal}`;
    }
    // 9. Electromagnetic Induction (EMF vs Motion/Turns)
    else if (obs.emf !== undefined || obs.inducedEMF !== undefined) {
      xVal = parseNum(obs.turns ?? idx + 1);
      yVal = parseNum(obs.emf ?? obs.inducedEMF);
      xLabel = obs.turns !== undefined ? 'Coil Turns N' : 'Trial Number';
      yLabel = 'Induced EMF (mV)';
      xDisplay = `${xVal}`;
    }
    // Fallback: Pick any 2 numeric fields
    else {
      const keys = Object.keys(obs).filter(k => k !== 'trial' && k !== 'id');
      const numKeys = keys.filter(k => !isNaN(parseNum(obs[k])) && parseNum(obs[k]) !== 0);
      if (numKeys.length >= 2) {
        xVal = parseNum(obs[numKeys[0]]);
        yVal = parseNum(obs[numKeys[1]]);
        xLabel = numKeys[0].toUpperCase();
        yLabel = numKeys[1].toUpperCase();
      } else if (numKeys.length === 1) {
        xVal = idx + 1;
        yVal = parseNum(obs[numKeys[0]]);
        xLabel = 'Trial Number';
        yLabel = numKeys[0].toUpperCase();
      }
    }

    return {
      index: idx + 1,
      trialLabel: `Obs ${idx + 1}`,
      x: xVal,
      y: yVal,
      xDisplay,
      xLabel,
      yLabel
    };
  });

  const xTitle = chartData[0]?.xLabel || 'X Parameter';
  const yTitle = chartData[0]?.yLabel || 'Y Parameter';

  return (
    <div className="bg-white rounded-xl border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono flex flex-col w-full">
      {/* Header */}
      <div className="bg-yellow-300 px-4 py-3 border-2 border-black rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h2 className="text-xl font-black uppercase text-black">
            📊 Plot Graph: {yTitle} vs {xTitle}
          </h2>
          <p className="text-xs font-bold text-gray-800">
            Real-time scientific telemetry plot generated from recorded observation trials.
          </p>
        </div>
        <span className="text-xs font-black bg-black text-white px-3 py-1.5 rounded border border-black shadow">
          {observations.length} RECORDED TRIALS
        </span>
      </div>

      {/* Main Chart Container with Explicit Fixed Pixel Height to guarantee rendering */}
      <div className="w-full h-[400px] bg-slate-50 p-4 border-2 border-black rounded-lg relative overflow-hidden">
        {observations.length < 2 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
            <span className="text-4xl mb-2">📈</span>
            <p className="font-black text-lg text-gray-900">Minimum 2 Observations Required</p>
            <p className="text-xs font-bold text-gray-600 mt-2 max-w-md">
              You currently have <span className="text-red-600 font-extrabold">{observations.length}</span> observation recorded. Switch to the <strong>"Lab Experiment"</strong> tab, adjust the parameters/sliders, and click <strong>"RECORD OBSERVATION"</strong> again to plot your line graph!
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 35 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
              <XAxis
                dataKey="trialLabel"
                stroke="#000"
                tick={{ fill: '#0f172a', fontWeight: 'bold', fontSize: 12 }}
                label={{ value: `Observation Trials (${xTitle})`, position: 'insideBottom', offset: -20, fill: '#0f172a', fontWeight: '900', fontSize: 13 }}
              />
              <YAxis
                stroke="#000"
                tick={{ fill: '#0f172a', fontWeight: 'bold', fontSize: 12 }}
                label={{ value: yTitle, angle: -90, position: 'insideLeft', offset: 5, fill: '#0f172a', fontWeight: '900', fontSize: 13 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-yellow-200 border-2 border-black p-3 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold text-black space-y-1">
                        <div className="font-black border-b border-black pb-1">{data.trialLabel}</div>
                        <div>{xTitle}: <span className="text-blue-800">{data.x}</span></div>
                        <div>{yTitle}: <span className="text-red-700">{data.y}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 7, fill: '#ef4444', stroke: '#000', strokeWidth: 2 }}
                activeDot={{ r: 10, fill: '#10b981', stroke: '#000', strokeWidth: 2 }}
                name={`${yTitle} (Calculated / Measured)`}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Footer Data Cards */}
      {observations.length >= 2 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-100 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] font-black uppercase text-gray-700">Initial Reading (Trial 1)</div>
            <div className="text-sm font-black text-blue-900 mt-1">
              X: {chartData[0]?.x} | Y: {chartData[0]?.y}
            </div>
          </div>

          <div className="p-3 bg-emerald-100 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] font-black uppercase text-gray-700">Latest Reading (Trial {chartData.length})</div>
            <div className="text-sm font-black text-emerald-900 mt-1">
              X: {chartData[chartData.length - 1]?.x} | Y: {chartData[chartData.length - 1]?.y}
            </div>
          </div>

          <div className="p-3 bg-amber-100 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
            <div className="text-[10px] font-black uppercase text-gray-700">Graph Trend</div>
            <div className="text-sm font-black text-amber-900 mt-1">
              {chartData[chartData.length - 1]?.y >= chartData[0]?.y ? '📈 Directly Proportional' : '📉 Inversely Proportional'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
