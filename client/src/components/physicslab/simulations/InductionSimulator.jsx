import React, { useState } from 'react';
import { Plus, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export default function InductionSimulator({ onAddObservation }) {
  const [magnetPos, setMagnetPos] = useState(-150); // x relative to coil
  const [magnetSpeed, setMagnetSpeed] = useState(2.0); // m/s
  const [isNorthFirst, setIsNorthFirst] = useState(true); // Pole orientation
  const [motionDirection, setMotionDirection] = useState('none'); // 'towards' | 'away' | 'none'

  // Calculate induced current & needle deflection angle
  // EMF = -dPhi/dt => proportional to speed * direction * pole
  let currentDeflectionDeg = 0;
  if (motionDirection === 'towards') {
    currentDeflectionDeg = (isNorthFirst ? 1 : -1) * magnetSpeed * 15;
  } else if (motionDirection === 'away') {
    currentDeflectionDeg = (isNorthFirst ? -1 : 1) * magnetSpeed * 15;
  }

  // Cap deflection at max 60 degrees
  currentDeflectionDeg = Math.max(-60, Math.min(60, currentDeflectionDeg));

  const handleMoveTowards = () => {
    setMotionDirection('towards');
    setMagnetPos((prev) => Math.min(0, prev + 30));
  };

  const handleMoveAway = () => {
    setMotionDirection('away');
    setMagnetPos((prev) => Math.max(-200, prev - 30));
  };

  const handleStop = () => {
    setMotionDirection('none');
  };

  const handleRecord = () => {
    onAddObservation({
      magnet_motion: motionDirection.toUpperCase(),
      speed: `${magnetSpeed} m/s`,
      poles: isNorthFirst ? 'N-S' : 'S-N',
      deflection: `${currentDeflectionDeg.toFixed(1)}°`,
      induced: currentDeflectionDeg !== 0 ? 'YES' : 'NO (0 µA)'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* SVG Diagram Canvas */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <pattern id="grid-ind" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-ind)" />

              {/* Copper Wire Coil (Center) */}
              <g transform="translate(500, 180)">
                {[...Array(8)].map((_, i) => (
                  <ellipse 
                    key={i} 
                    cx={(i - 4) * 12} cy="0" rx="15" ry="60" 
                    fill="none" stroke="#D97706" strokeWidth="4" 
                  />
                ))}
                <text x="0" y="-75" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">
                  Induction Coil (N Turns)
                </text>
              </g>

              {/* Movable Bar Magnet */}
              <g transform={`translate(${400 + magnetPos}, 180)`}>
                {/* North Pole */}
                <rect 
                  x={isNorthFirst ? "0" : "-80"} y="-25" width="80" height="50" 
                  fill="#DC2626" stroke="#1A1A1A" strokeWidth="3" 
                />
                <text 
                  x={isNorthFirst ? "40" : "-40"} y="8" 
                  textAnchor="middle" fontWeight="900" fontSize="20" fill="#FFFFFF"
                >
                  N
                </text>

                {/* South Pole */}
                <rect 
                  x={isNorthFirst ? "-80" : "0"} y="-25" width="80" height="50" 
                  fill="#2563EB" stroke="#1A1A1A" strokeWidth="3" 
                />
                <text 
                  x={isNorthFirst ? "-40" : "40"} y="8" 
                  textAnchor="middle" fontWeight="900" fontSize="20" fill="#FFFFFF"
                >
                  S
                </text>
              </g>

              {/* Wires to Galvanometer */}
              <path d="M 450 230 L 450 320 L 500 320" fill="none" stroke="#1A1A1A" strokeWidth="3" />
              <path d="M 550 230 L 550 320 L 500 320" fill="none" stroke="#1A1A1A" strokeWidth="3" />

              {/* Center-Zero Galvanometer */}
              <g transform="translate(500, 320)">
                <circle cx="0" cy="0" r="45" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="-20" textAnchor="middle" fontWeight="900" fontSize="12" fill="#1A1A1A">G</text>
                <text x="-25" y="10" fontSize="9" fontWeight="800">-30</text>
                <text x="0" y="-5" fontSize="9" fontWeight="800">0</text>
                <text x="25" y="10" fontSize="9" fontWeight="800">+30</text>

                {/* Galvanometer Needle */}
                <line 
                  x1="0" y1="20" x2="0" y2="-30" 
                  stroke="#DC2626" strokeWidth="3" 
                  transform={`rotate(${currentDeflectionDeg}, 0, 20)`} 
                />
                <circle cx="0" cy="20" r="5" fill="#1A1A1A" />
              </g>
            </svg>
          </div>
        </div>

        {/* Motion Action Buttons */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onMouseDown={handleMoveTowards}
              onMouseUp={handleStop}
              className="btn-brutal-blue flex-1 py-3 font-black text-xs uppercase shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" /> Move Magnet Towards Coil
            </button>

            <button
              onMouseDown={handleMoveAway}
              onMouseUp={handleStop}
              className="btn-brutal flex-1 py-3 bg-cream text-charcoal font-black text-xs uppercase shadow-brutal flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Pull Magnet Away
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Magnet Speed</span>
                <span className="text-brutalRed">{magnetSpeed} m/s</span>
              </div>
              <input type="range" min="1" max="4" step="0.5" value={magnetSpeed} onChange={(e) => setMagnetSpeed(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase mb-1">
                Reverse Magnet Poles
              </label>
              <button
                onClick={() => setIsNorthFirst(!isNorthFirst)}
                className="btn-brutal w-full py-1.5 bg-brutalYellow text-xs font-black uppercase flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Poles: {isNorthFirst ? 'North Facing Coil' : 'South Facing Coil'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Induction Readings</h3>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Magnet Motion</span>
            <span className="font-black text-sm text-brutalBlue">{motionDirection.toUpperCase()}</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Galvanometer Deflection</span>
            <span className="font-black text-sm text-brutalRed">{currentDeflectionDeg.toFixed(1)}°</span>
          </div>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span>Induced Current</span>
            <span className="font-black text-sm text-charcoal">
              {currentDeflectionDeg !== 0 ? 'DETECTED (EMF > 0)' : 'ZERO (NO MOTION)'}
            </span>
          </div>

          <div className="p-3 bg-blue-50 border-2 border-blue-200 font-sans text-xs">
            <strong>Faraday & Lenz Law Note:</strong><br />
            Stationary magnet creates NO current. Moving magnet induces current; direction reverses when motion or pole is inverted.
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
