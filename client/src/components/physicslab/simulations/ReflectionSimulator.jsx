import React, { useState } from 'react';
import { PlusCircle, RotateCcw, Eye, Sun } from 'lucide-react';

const LASER_COLORS = [
  { name: 'Red (650nm)', hex: '#ef4444' },
  { name: 'Green (532nm)', hex: '#22c55e' },
  { name: 'Blue (450nm)', hex: '#3b82f6' }
];

export default function ReflectionSimulator({ onAddObservation }) {
  const [angleIncidence, setAngleIncidence] = useState(40); // degrees from normal
  const [laserColor, setLaserColor] = useState('#ef4444');
  const [showProtractor, setShowProtractor] = useState(true);
  const [reflectionType, setReflectionType] = useState('regular'); // 'regular' or 'diffuse'

  // Law of reflection: angle r = angle i for plane mirror regular reflection
  const angleReflection = reflectionType === 'regular' ? angleIncidence : Math.min(85, angleIncidence + 15);

  // SVG Geometry setup:
  // Center of mirror at (300, 220).
  // Normal line vertically upwards from (300, 220) to (300, 40).
  // Incident ray comes from top-left.
  const mirrorCenterX = 300;
  const mirrorCenterY = 220;
  const rayLength = 180;

  // Incident ray angle relative to vertical normal (negative X for left side)
  const incRad = (angleIncidence * Math.PI) / 180;
  const incX = mirrorCenterX - rayLength * Math.sin(incRad);
  const incY = mirrorCenterY - rayLength * Math.cos(incRad);

  // Reflected ray angle relative to vertical normal (positive X for right side)
  const refRad = (angleReflection * Math.PI) / 180;
  const refX = mirrorCenterX + rayLength * Math.sin(refRad);
  const refY = mirrorCenterY - rayLength * Math.cos(refRad);

  const handleRecord = () => {
    if (onAddObservation) {
      onAddObservation({
        trial: Date.now(),
        surface: reflectionType === 'regular' ? 'Plane Mirror (Smooth)' : 'Rough Surface (Diffuse)',
        angleIncidence: `${angleIncidence}°`,
        angleReflection: `${angleReflection}°`,
        lawVerified: angleIncidence === angleReflection ? 'VERIFIED (∠i = ∠r)' : 'DIFFUSE REFLECTION',
        laserColor: LASER_COLORS.find(c => c.hex === laserColor)?.name || 'Laser'
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-cyan-50 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white p-5 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black bg-cyan-300 p-2 border-2 border-black rounded uppercase text-center flex items-center justify-center gap-2">
          <Sun size={20} /> Reflection of Light
        </h3>

        {/* Angle Slider */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Angle of Incidence (∠i):</span>
            <span className="text-red-600">{angleIncidence}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={angleIncidence}
            onChange={(e) => setAngleIncidence(parseInt(e.target.value))}
            className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Laser Color Selection */}
        <div>
          <label className="font-bold text-sm block mb-1">Laser Light Wavelength:</label>
          <div className="flex gap-2">
            {LASER_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setLaserColor(c.hex)}
                className={`flex-1 py-2 font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white ${
                  laserColor === c.hex ? 'ring-4 ring-black' : 'opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Type Toggle */}
        <div>
          <label className="font-bold text-sm block mb-1">Reflecting Surface:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReflectionType('regular')}
              className={`p-2 font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                reflectionType === 'regular' ? 'bg-cyan-300 text-black' : 'bg-gray-100 text-gray-700'
              }`}
            >
              PLANE MIRROR (Regular)
            </button>
            <button
              onClick={() => setReflectionType('diffuse')}
              className={`p-2 font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                reflectionType === 'diffuse' ? 'bg-amber-300 text-black' : 'bg-gray-100 text-gray-700'
              }`}
            >
              ROUGH SURFACE (Diffuse)
            </button>
          </div>
        </div>

        {/* Protractor Overlay Toggle */}
        <button
          onClick={() => setShowProtractor(!showProtractor)}
          className="py-2 px-4 bg-purple-100 font-bold text-xs border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-200 flex items-center justify-center gap-2"
        >
          <Eye size={16} /> {showProtractor ? 'HIDE PROTRACTOR' : 'SHOW PROTRACTOR'}
        </button>

        {/* Record Observation Button */}
        <button
          onClick={handleRecord}
          className="w-full py-3 mt-2 font-black bg-yellow-300 text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> RECORD OBSERVATION
        </button>
      </div>

      {/* Optical Bench Canvas Visualizer */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="relative w-full h-[380px] bg-slate-950 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 300">
            {/* Dark Grid Background */}
            <defs>
              <pattern id="reflectionGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#reflectionGrid)" />

            {/* Protractor Overlay */}
            {showProtractor && (
              <g transform="translate(300, 220)">
                <path
                  d="M -140 0 A 140 140 0 0 1 140 0 Z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                {/* Degree ticks around protractor */}
                {Array.from({ length: 19 }).map((_, idx) => {
                  const deg = (idx - 9) * 10;
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 130 * Math.sin(rad);
                  const y1 = -130 * Math.cos(rad);
                  const x2 = 140 * Math.sin(rad);
                  const y2 = -140 * Math.cos(rad);
                  return (
                    <g key={deg}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
                      <text
                        x={115 * Math.sin(rad)}
                        y={-115 * Math.cos(rad)}
                        fill="#38bdf8"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        opacity="0.7"
                      >
                        {Math.abs(deg)}°
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Horizontal Mirror Base */}
            <rect x="80" y="220" width="440" height="18" fill="#94a3b8" stroke="#000" strokeWidth="3" rx="2" />

            {/* Mirror Coating Hatching Lines underneath */}
            {Array.from({ length: 22 }).map((_, i) => (
              <line
                key={i}
                x1={90 + i * 20}
                y1="238"
                x2={80 + i * 20}
                y2="248"
                stroke="#64748b"
                strokeWidth="2"
              />
            ))}
            <text x="300" y="268" fill="#cbd5e1" fontWeight="bold" fontSize="13" textAnchor="middle">
              {reflectionType === 'regular' ? 'PLANE MIRROR (SMOOTH SURFACE)' : 'ROUGH REFLECTING SURFACE'}
            </text>

            {/* Normal Line (Perpendicular) */}
            <line x1="300" y1="220" x2="300" y2="30" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" />
            <text x="305" y="45" fill="#f59e0b" fontWeight="900" fontSize="14">
              NORMAL (N)
            </text>

            {/* Incident Ray Laser */}
            <line
              x1={incX}
              y1={incY}
              x2={mirrorCenterX}
              y2={mirrorCenterY}
              stroke={laserColor}
              strokeWidth="4"
              style={{ filter: `drop-shadow(0px 0px 6px ${laserColor})` }}
            />
            {/* Laser Emitter Icon */}
            <circle cx={incX} cy={incY} r="8" fill={laserColor} stroke="#fff" strokeWidth="2" />
            <text
              x={incX - 15}
              y={incY - 12}
              fill={laserColor}
              fontWeight="900"
              fontSize="12"
              textAnchor="middle"
            >
              LASER
            </text>

            {/* Incident Angle Arc */}
            <path
              d={`M 300 170 A 50 50 0 0 0 ${300 - 50 * Math.sin(incRad)} ${220 - 50 * Math.cos(incRad)}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
            <text x={280 - 30 * Math.sin(incRad / 2)} y={180} fill="#ef4444" fontWeight="900" fontSize="14">
              ∠i={angleIncidence}°
            </text>

            {/* Reflected Ray Laser */}
            <line
              x1={mirrorCenterX}
              y1={mirrorCenterY}
              x2={refX}
              y2={refY}
              stroke={laserColor}
              strokeWidth="4"
              style={{ filter: `drop-shadow(0px 0px 6px ${laserColor})` }}
            />

            {/* Reflected Angle Arc */}
            <path
              d={`M 300 170 A 50 50 0 0 1 ${300 + 50 * Math.sin(refRad)} ${220 - 50 * Math.cos(refRad)}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />
            <text x={320 + 30 * Math.sin(refRad / 2)} y={180} fill="#60a5fa" fontWeight="900" fontSize="14">
              ∠r={angleReflection}°
            </text>
          </svg>
        </div>

        {/* Verification Summary Card */}
        <div className="bg-white p-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="font-black text-sm text-gray-700">FIRST LAW OF REFLECTION:</div>
            <div className="text-xs text-gray-600">
              The angle of incidence (∠i) is equal to the angle of reflection (∠r).
            </div>
            <div className="text-sm font-bold text-cyan-700">
              ∠i = {angleIncidence}° | ∠r = {angleReflection}° | {angleIncidence === angleReflection ? '✓ EQUAL' : '✗ NOT EQUAL'}
            </div>
          </div>
          <div className="bg-cyan-100 border-2 border-black p-3 rounded text-center min-w-[160px]">
            <div className="text-xs font-bold uppercase text-gray-700">Law Verification</div>
            <div className="text-xl font-black text-cyan-900">
              {angleIncidence === angleReflection ? '∠i = ∠r VERIFIED' : 'DIFFUSE REFLECTION'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
