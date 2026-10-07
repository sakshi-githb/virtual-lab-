import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function WorkEnergySimulator({ onAddObservation }) {
  const [mass, setMass] = useState(5); // kg
  const [force, setForce] = useState(20); // N
  const [distance, setDistance] = useState(10); // m
  const [height, setHeight] = useState(4); // m
  const [velocity, setVelocity] = useState(6); // m/s

  const g = 9.8;
  const workDone = force * distance; // W = F * d
  const potentialEnergy = mass * g * height; // PE = mgh
  const kineticEnergy = 0.5 * mass * velocity * velocity; // KE = 1/2 m v^2

  const handleRecord = () => {
    onAddObservation({
      mass: `${mass} kg`,
      force: `${force} N`,
      distance: `${distance} m`,
      work: `${workDone.toFixed(1)} J`,
      pe: `${potentialEnergy.toFixed(1)} J`,
      ke: `${kineticEnergy.toFixed(1)} J`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* SVG Visualization */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2.2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              <pattern id="grid-we" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-we)" />

              {/* Ground & Ramp Height */}
              <rect x="50" y="280" width="700" height="20" fill="#1A1A1A" />
              
              {/* Elevated Platform for PE */}
              <rect x="500" y={280 - height * 25} width="200" height={height * 25} fill="#E5E7EB" stroke="#1A1A1A" strokeWidth="3" />
              <line x1="490" y1="280" x2="490" y2={280 - height * 25} stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" />
              <text x="475" y={280 - (height * 25) / 2} textAnchor="end" fontSize="12" fontWeight="900" fill="#DC2626">h = {height}m</text>

              {/* Block on Ground */}
              <g transform={`translate(${100 + distance * 30}, 240)`}>
                <rect x="-30" y="-20" width="60" height="40" fill="#FACC15" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="14">{mass}kg</text>
                <line x1="30" y1="0" x2={30 + force * 2} y2="0" stroke="#2563EB" strokeWidth="3" />
                <text x={35 + force * 2} y="-5" fontSize="11" fontWeight="800" fill="#2563EB">F = {force}N</text>
              </g>

              {/* Block on Elevated Height */}
              <g transform={`translate(600, ${240 - height * 25})`}>
                <rect x="-25" y="-20" width="50" height="40" fill="#3B82F6" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="12" fill="#FFFFFF">PE</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Sliders */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Mass (m)</span>
                <span className="text-brutalBlue">{mass} kg</span>
              </div>
              <input type="range" min="1" max="20" step="1" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Displacement (d)</span>
                <span className="text-brutalRed">{distance} m</span>
              </div>
              <input type="range" min="1" max="12" step="1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Height (h)</span>
                <span>{height} m</span>
              </div>
              <input type="range" min="1" max="8" step="0.5" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Energy & Work Calculations</h3>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Work Done W = Fd</span>
            <span className="font-black text-sm text-charcoal">{workDone.toFixed(1)} J</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Potential Energy mgh</span>
            <span className="font-black text-sm text-brutalBlue">{potentialEnergy.toFixed(1)} J</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Kinetic Energy ½mv²</span>
            <span className="font-black text-sm text-brutalRed">{kineticEnergy.toFixed(1)} J</span>
          </div>
        </div>

        <button
          onClick={handleRecord}
          className="btn-brutal-yellow py-3.5 font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Record Reading to Table
        </button>
      </div>
    </div>
  );
}
