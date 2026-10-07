import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Plus } from 'lucide-react';

export default function NewtonMotionSimulator({ onAddObservation }) {
  const [mass, setMass] = useState(2.0); // m in kg
  const [appliedForce, setAppliedForce] = useState(10.0); // F in N
  const [frictionCoeff, setFrictionCoeff] = useState(0.1); // mu

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // t in s
  const [position, setPosition] = useState(0); // x in m

  const g = 9.8;
  const frictionForce = Math.min(appliedForce, frictionCoeff * mass * g);
  const netForce = Math.max(0, appliedForce - frictionForce);
  const acceleration = netForce / mass; // a in m/s2
  const currentVelocity = acceleration * time; // v = at

  const animRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = performance.now() - time * 1000;
      const step = (now) => {
        const elapsed = (now - startTime) / 1000;
        const newPos = 0.5 * acceleration * elapsed * elapsed;
        if (newPos >= 50 || elapsed >= 10) {
          setIsRunning(false);
          setTime(elapsed);
          setPosition(Math.min(newPos, 50));
        } else {
          setTime(elapsed);
          setPosition(newPos);
          animRef.current = requestAnimationFrame(step);
        }
      };
      animRef.current = requestAnimationFrame(step);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isRunning, acceleration]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setPosition(0);
  };

  const handleRecord = () => {
    onAddObservation({
      mass: `${mass.toFixed(1)} kg`,
      force: `${appliedForce.toFixed(1)} N`,
      netForce: `${netForce.toFixed(2)} N`,
      acceleration: `${acceleration.toFixed(2)} m/s²`,
      velocity: `${currentVelocity.toFixed(2)} m/s`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* Track Canvas */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2.2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              <pattern id="grid-nm" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-nm)" />

              {/* Track Baseline */}
              <rect x="50" y="260" width="700" height="20" fill="#1A1A1A" />
              {/* Distance Ticks */}
              {[0, 10, 20, 30, 40, 50].map((mVal, i) => (
                <g key={i} transform={`translate(${80 + i * 120}, 280)`}>
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="0" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1A1A1A">{mVal}m</text>
                </g>
              ))}

              {/* Dynamics Cart */}
              <g transform={`translate(${80 + (position / 50) * 600}, 210)`}>
                {/* Cart Body */}
                <rect x="-35" y="-25" width="70" height="50" fill="#FACC15" stroke="#1A1A1A" strokeWidth="3" />
                <circle cx="-20" cy="28" r="12" fill="#1A1A1A" />
                <circle cx="20" cy="28" r="12" fill="#1A1A1A" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">{mass}kg</text>

                {/* Force Arrow Vector (Right) */}
                <line x1="35" y1="0" x2={35 + appliedForce * 3} y2="0" stroke="#2563EB" strokeWidth="4" />
                <polygon points={`${35 + appliedForce * 3 + 8},0 ${35 + appliedForce * 3},-5 ${35 + appliedForce * 3},5`} fill="#2563EB" />
                <text x={40 + appliedForce * 3} y="-8" fontSize="12" fontWeight="900" fill="#2563EB">F = {appliedForce}N</text>

                {/* Friction Arrow Vector (Left) */}
                {frictionForce > 0 && (
                  <g>
                    <line x1="-35" y1="0" x2={-35 - frictionForce * 3} y2="0" stroke="#DC2626" strokeWidth="3" />
                    <text x={-40 - frictionForce * 3} y="-8" textAnchor="end" fontSize="10" fontWeight="800" fill="#DC2626">f = {frictionForce.toFixed(1)}N</text>
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Cart Mass (m)</span>
                <span className="text-brutalBlue">{mass} kg</span>
              </div>
              <input type="range" min="0.5" max="10" step="0.5" value={mass} onChange={(e) => setMass(Number(e.target.value))} disabled={isRunning} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Applied Force (F)</span>
                <span className="text-brutalRed">{appliedForce} N</span>
              </div>
              <input type="range" min="0" max="30" step="1" value={appliedForce} onChange={(e) => setAppliedForce(Number(e.target.value))} disabled={isRunning} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Friction Coeff (μ)</span>
                <span>{frictionCoeff}</span>
              </div>
              <input type="range" min="0" max="0.5" step="0.05" value={frictionCoeff} onChange={(e) => setFrictionCoeff(Number(e.target.value))} disabled={isRunning} className="w-full accent-charcoal cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 btn-brutal py-2.5 font-black text-xs uppercase shadow-brutal flex items-center justify-center gap-2 ${
                isRunning ? 'bg-brutalRed text-white' : 'bg-brutalGreen text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Pause Simulation' : 'Start Motion'}</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-brutal bg-cream text-charcoal font-black text-xs uppercase py-2.5 px-4 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry HUD */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Kinematics Telemetry</h3>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Acceleration (a = F/m)</span>
            <span className="font-black text-sm text-charcoal">{acceleration.toFixed(2)} m/s²</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Elapsed Time (t)</span>
            <span className="font-black text-sm text-brutalBlue">{time.toFixed(2)} s</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Displacement (x)</span>
            <span className="font-black text-sm text-brutalRed">{position.toFixed(2)} m</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Speed (v = at)</span>
            <span className="font-black text-sm text-emerald-800">{currentVelocity.toFixed(2)} m/s</span>
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
