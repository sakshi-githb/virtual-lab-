import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

export default function MagneticEffectSimulator({ onAddObservation }) {
  const [isCurrentOn, setIsCurrentOn] = useState(false);
  const [currentDirection, setCurrentDirection] = useState('upwards'); // 'upwards' | 'downwards'
  const [currentAmp, setCurrentAmp] = useState(3.0); // I in Amps

  // Compass deflection angle based on Right Hand Thumb Rule
  let compassAngleDeg = 0;
  if (isCurrentOn) {
    compassAngleDeg = (currentDirection === 'upwards' ? 1 : -1) * (currentAmp / 5) * 60;
  }

  const handleRecord = () => {
    onAddObservation({
      state: isCurrentOn ? 'CURRENT ON' : 'OFF',
      direction: currentDirection.toUpperCase(),
      current: `${currentAmp} A`,
      deflection: `${compassAngleDeg.toFixed(1)}°`,
      fieldRule: 'Right-Hand Thumb Rule Verified'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* SVG Diagram Canvas */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <pattern id="grid-me" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-me)" />

              {/* Cardboard Platform */}
              <polygon points="200,280 600,280 550,180 250,180" fill="#FDE68A" stroke="#1A1A1A" strokeWidth="3" />
              <text x="400" y="270" textAnchor="middle" fontWeight="800" fontSize="12">Cardboard Platform</text>

              {/* Straight Conductor Wire (Vertical) */}
              <line x1="400" y1="40" x2="400" y2="340" stroke="#B45309" strokeWidth="8" />

              {/* Concentric Magnetic Field Lines (when current ON) */}
              {isCurrentOn && (
                <g transform="translate(400, 230)">
                  <ellipse cx="0" cy="0" rx="90" ry="35" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 5" />
                  <ellipse cx="0" cy="0" rx="140" ry="55" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="5 5" />
                  <text x="100" y="-10" fontSize="12" fontWeight="900" fill="#DC2626">Magnetic Field Lines B</text>
                </g>
              )}

              {/* Current Direction Arrow */}
              {isCurrentOn && (
                <g transform={`translate(430, 100) ${currentDirection === 'downwards' ? 'rotate(180)' : ''}`}>
                  <line x1="0" y1="30" x2="0" y2="-30" stroke="#DC2626" strokeWidth="4" />
                  <polygon points="0,-35 -6,-25 6,-25" fill="#DC2626" />
                  <text x="12" y="0" fontWeight="900" fontSize="14" fill="#DC2626">I = {currentAmp}A</text>
                </g>
              )}

              {/* Magnetic Compass Needle on Cardboard */}
              <g transform="translate(320, 230)">
                <circle cx="0" cy="0" r="30" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="-34" textAnchor="middle" fontSize="10" fontWeight="900">N</text>
                <text x="0" y="42" textAnchor="middle" fontSize="10" fontWeight="900">S</text>
                
                {/* Needle */}
                <g transform={`rotate(${compassAngleDeg})`}>
                  <polygon points="0,-22 6,0 -6,0" fill="#DC2626" stroke="#1A1A1A" strokeWidth="1" />
                  <polygon points="0,22 6,0 -6,0" fill="#2563EB" stroke="#1A1A1A" strokeWidth="1" />
                  <circle cx="0" cy="0" r="3" fill="#1A1A1A" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsCurrentOn(!isCurrentOn)}
              className={`flex-1 py-3 font-black text-xs uppercase border-3 border-charcoal shadow-brutal cursor-pointer ${
                isCurrentOn ? 'bg-brutalGreen text-white' : 'bg-brutalRed text-white'
              }`}
            >
              {isCurrentOn ? 'CURRENT ON (OERSTED FIELD ACTIVE)' : 'CURRENT OFF'}
            </button>

            <button
              onClick={() => setCurrentDirection(currentDirection === 'upwards' ? 'downwards' : 'upwards')}
              className="btn-brutal bg-brutalYellow text-xs py-3 font-black uppercase flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reverse Current ({currentDirection.toUpperCase()})</span>
            </button>
          </div>

          <div className="pt-2">
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Current Strength (I)</span>
              <span className="text-brutalRed">{currentAmp} A</span>
            </div>
            <input type="range" min="1" max="10" step="1" value={currentAmp} onChange={(e) => setCurrentAmp(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Oersted Telemetry</h3>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Circuit State</span>
            <span className="font-black text-sm text-brutalBlue">{isCurrentOn ? 'CLOSED' : 'OPEN'}</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Current Direction</span>
            <span className="font-black text-sm text-brutalRed">{currentDirection.toUpperCase()}</span>
          </div>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span>Compass Deflection</span>
            <span className="font-black text-sm text-charcoal">{compassAngleDeg.toFixed(1)}°</span>
          </div>

          <div className="p-3 bg-blue-50 border-2 border-blue-200 font-sans text-xs">
            <strong>Right-Hand Thumb Rule:</strong><br />
            Point right thumb in direction of current I; curled fingers show direction of magnetic field lines B around conductor.
          </div>
        </div>

        <button
          onClick={handleRecord}
          disabled={!isCurrentOn}
          className="btn-brutal-yellow py-3.5 font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Record Reading to Table
        </button>
      </div>
    </div>
  );
}
