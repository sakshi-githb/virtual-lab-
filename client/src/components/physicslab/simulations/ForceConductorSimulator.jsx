import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, PlusCircle, Compass } from 'lucide-react';

export default function ForceConductorSimulator({ onAddObservation }) {
  const [current, setCurrent] = useState(3.0); // Amperes
  const [fieldStrength, setFieldStrength] = useState(0.5); // Tesla
  const [conductorLength, setConductorLength] = useState(0.2); // Meters
  const [angle, setAngle] = useState(90); // Degrees
  const [fieldDirection, setFieldDirection] = useState('down'); // 'down' (N top, S bottom) or 'up'
  const [currentDirection, setCurrentDirection] = useState('right'); // 'right' or 'left'
  const [isPowerOn, setIsPowerOn] = useState(false);

  // Calculate magnetic force F = B * I * L * sin(theta)
  const angleRad = (angle * Math.PI) / 180;
  const force = fieldStrength * current * conductorLength * Math.sin(angleRad); // Newtons

  // Fleming's Left Hand Rule direction calculation:
  // Forefinger = B, Middle Finger = I, Thumb = F
  // If B is DOWN and I is RIGHT => F is INTO THE PAGE / UPWARD DEFLECTION on 2D view
  // If B is UP and I is RIGHT => F is OUT OF THE PAGE / DOWNWARD DEFLECTION
  let forceDirection = 'ZERO';
  let forceValueSigned = 0;

  if (isPowerOn && Math.abs(force) > 0.0001) {
    if (fieldDirection === 'down') {
      forceValueSigned = currentDirection === 'right' ? force : -force;
    } else {
      forceValueSigned = currentDirection === 'right' ? -force : force;
    }
    forceDirection = forceValueSigned > 0 ? 'UPWARD (Outward Force)' : 'DOWNWARD (Inward Force)';
  }

  // Deflection pixel displacement for visual
  const displacement = isPowerOn ? Math.max(-60, Math.min(60, forceValueSigned * 40)) : 0;

  const handleRecord = () => {
    if (onAddObservation) {
      onAddObservation({
        trial: Date.now(),
        current: current.toFixed(2),
        fieldStrength: fieldStrength.toFixed(2),
        conductorLength: conductorLength.toFixed(2),
        angle: `${angle}°`,
        force: force.toFixed(4),
        direction: forceDirection
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-yellow-50 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono">
      {/* Simulation Controls Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white p-5 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black bg-yellow-300 p-2 border-2 border-black rounded uppercase text-center">
          ⚡ Force on Conductor
        </h3>

        {/* Current Control */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Electric Current (I):</span>
            <span className="text-blue-700">{current.toFixed(1)} A</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value))}
            className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Magnetic Field Strength Control */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Magnetic Field (B):</span>
            <span className="text-red-600">{fieldStrength.toFixed(2)} T</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={fieldStrength}
            onChange={(e) => setFieldStrength(parseFloat(e.target.value))}
            className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Conductor Length */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Conductor Length (L):</span>
            <span className="text-emerald-700">{conductorLength.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.50"
            step="0.05"
            value={conductorLength}
            onChange={(e) => setConductorLength(parseFloat(e.target.value))}
            className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Angle Control */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Angle θ (B vs I):</span>
            <span className="text-purple-700">{angle}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCurrentDirection(currentDirection === 'right' ? 'left' : 'right')}
            className="p-2 text-xs font-black bg-blue-100 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-200"
          >
            I Dir: {currentDirection.toUpperCase()} ➔
          </button>
          <button
            onClick={() => setFieldDirection(fieldDirection === 'down' ? 'up' : 'down')}
            className="p-2 text-xs font-black bg-red-100 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-200"
          >
            B Field: {fieldDirection === 'down' ? 'N ➔ S (Down)' : 'N ➔ S (Up)'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => setIsPowerOn(!isPowerOn)}
            className={`w-full py-3 font-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 ${
              isPowerOn ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-400 text-black hover:bg-emerald-500'
            }`}
          >
            {isPowerOn ? <Pause size={18} /> : <Play size={18} />}
            {isPowerOn ? 'SWITCH OFF CIRCUIT' : 'SWITCH ON CIRCUIT'}
          </button>

          <button
            onClick={handleRecord}
            disabled={!isPowerOn}
            className="w-full py-3 font-black bg-yellow-300 text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> RECORD OBSERVATION
          </button>
        </div>
      </div>

      {/* Interactive Visualizer Canvas / SVG */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="relative w-full h-[380px] bg-slate-900 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 360">
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Horseshoe Magnet Top Pole */}
            <rect
              x="180"
              y={fieldDirection === 'down' ? '40' : '260'}
              width="240"
              height="40"
              fill={fieldDirection === 'down' ? '#ef4444' : '#3b82f6'}
              stroke="#000"
              strokeWidth="3"
              rx="4"
            />
            <text
              x="300"
              y={fieldDirection === 'down' ? '68' : '288'}
              fill="#fff"
              fontWeight="900"
              fontSize="22"
              textAnchor="middle"
            >
              {fieldDirection === 'down' ? 'NORTH POLE (N)' : 'SOUTH POLE (S)'}
            </text>

            {/* Horseshoe Magnet Bottom Pole */}
            <rect
              x="180"
              y={fieldDirection === 'down' ? '260' : '40'}
              width="240"
              height="40"
              fill={fieldDirection === 'down' ? '#3b82f6' : '#ef4444'}
              stroke="#000"
              strokeWidth="3"
              rx="4"
            />
            <text
              x="300"
              y={fieldDirection === 'down' ? '288' : '68'}
              fill="#fff"
              fontWeight="900"
              fontSize="22"
              textAnchor="middle"
            >
              {fieldDirection === 'down' ? 'SOUTH POLE (S)' : 'NORTH POLE (N)'}
            </text>

            {/* Magnetic Field Lines (Dashed Arrows) */}
            {[220, 260, 300, 340, 380].map((xPos) => (
              <line
                key={xPos}
                x1={xPos}
                y1={fieldDirection === 'down' ? 85 : 255}
                x2={xPos}
                y2={fieldDirection === 'down' ? 255 : 85}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            ))}

            {/* Flexible Hanger Wires */}
            <line x1="220" y1="20" x2="220" y2={170 + displacement} stroke="#fbbf24" strokeWidth="4" />
            <line x1="380" y1="20" x2="380" y2={170 + displacement} stroke="#fbbf24" strokeWidth="4" />

            {/* Copper Conductor Rod */}
            <g transform={`translate(0, ${displacement})`} transition="transform 0.3s ease-out">
              <rect
                x="200"
                y="160"
                width="200"
                height="20"
                fill="#d97706"
                stroke="#000"
                strokeWidth="3"
                rx="6"
              />

              {/* Current Arrow inside Rod */}
              {isPowerOn && (
                <g>
                  <line
                    x1={currentDirection === 'right' ? '220' : '380'}
                    y1="170"
                    x2={currentDirection === 'right' ? '370' : '230'}
                    y2="170"
                    stroke="#60a5fa"
                    strokeWidth="6"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x="300"
                    y="152"
                    fill="#60a5fa"
                    fontWeight="900"
                    fontSize="14"
                    textAnchor="middle"
                  >
                    Current (I = {current} A) {currentDirection === 'right' ? '➔' : '⬅'}
                  </text>
                </g>
              )}

              {/* Magnetic Force Resulting Deflection Arrow */}
              {isPowerOn && Math.abs(displacement) > 2 && (
                <g>
                  <line
                    x1="300"
                    y1="170"
                    x2="300"
                    y2={displacement < 0 ? '110' : '230'}
                    stroke="#10b981"
                    strokeWidth="8"
                  />
                  <polygon
                    points={
                      displacement < 0
                        ? "300,95 290,115 310,115"
                        : "300,245 290,225 310,225"
                    }
                    fill="#10b981"
                  />
                  <text
                    x="300"
                    y={displacement < 0 ? '85' : '265'}
                    fill="#10b981"
                    fontWeight="900"
                    fontSize="16"
                    textAnchor="middle"
                  >
                    FORCE (F = {force.toFixed(3)} N)
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* Live Formula & Calculation Box */}
        <div className="bg-white p-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="font-black text-sm text-gray-700">FLEMING'S LEFT HAND RULE:</div>
            <div className="text-xs text-gray-600">
              Thumb = <strong>Force (F)</strong> | Forefinger = <strong>Magnetic Field (B)</strong> | Middle finger = <strong>Current (I)</strong>
            </div>
            <div className="text-sm font-bold text-amber-700">
              Formula: F = B × I × L × sin(θ) = {fieldStrength} × {current} × {conductorLength} × sin({angle}°)
            </div>
          </div>
          <div className="bg-emerald-100 border-2 border-black p-3 rounded text-center min-w-[160px]">
            <div className="text-xs font-bold uppercase text-gray-700">Calculated Force</div>
            <div className="text-2xl font-black text-emerald-800">{force.toFixed(4)} N</div>
            <div className="text-[10px] font-bold text-gray-600">{forceDirection}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
