import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function LensSimulator({ onAddObservation }) {
  // State for parameters
  const [focalLength, setFocalLength] = useState(20); // f in cm
  const [objDistance, setObjDistance] = useState(30); // |u| in cm (absolute value for UI)
  const objHeight = 20; // h in cm (fixed for simplicity)

  // Calculated values
  // using sign convention: u is negative, f is positive for convex lens
  const u = -Math.abs(objDistance);
  const f = focalLength;
  
  // 1/v - 1/u = 1/f => 1/v = 1/f + 1/u
  let v = 0;
  if (u + f !== 0) {
    v = (u * f) / (u + f);
  } else {
    v = Infinity;
  }

  const m = v !== Infinity ? v / u : Infinity;
  const imgHeight = v !== Infinity ? m * objHeight : Infinity;

  // SVG drawing parameters
  const svgWidth = 800;
  const svgHeight = 400;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;
  
  // Scale factor: 1 cm = 4 pixels (so 80cm fits in 400px left side)
  const scale = 4;

  // SVG Coordinates
  const getX = (val_cm) => originX + val_cm * scale;
  const getY = (val_cm) => originY - val_cm * scale; // negative because SVG y goes down

  const objX = getX(u);
  const objTopY = getY(objHeight);
  const imgX = v !== Infinity ? getX(v) : Infinity;
  const imgTopY = v !== Infinity ? getY(imgHeight) : Infinity;

  const f1X = getX(-f);
  const f2X = getX(f);
  const f2_1X = getX(-2 * f);
  const f2_2X = getX(2 * f);

  // Rays
  // Ray 1: Parallel to axis, passes through F2
  const ray1Points = `
    ${objX},${objTopY} 
    ${originX},${objTopY} 
    ${originX + 100 * scale}, ${getY(objHeight - (objHeight/f)*100)}
  `;

  // Ray 2: Through optical center
  const ray2Points = `
    ${objX},${objTopY} 
    ${originX},${originY}
    ${originX + 100 * scale}, ${getY(objHeight - (objHeight/Math.abs(u))*100)}
  `;

  const isVirtual = v < 0;
  const isReal = v > 0 && v !== Infinity;

  // Nature strings
  const natureText = v === Infinity 
    ? "At Infinity" 
    : `${isReal ? 'Real' : 'Virtual'} and ${m > 0 ? 'Erect' : 'Inverted'}, ${Math.abs(m) > 1 ? 'Magnified' : Math.abs(m) < 1 ? 'Diminished' : 'Same size'}`;

  const handleAddClick = () => {
    onAddObservation({
      u: objDistance,
      v: v === Infinity ? 'Infinity' : v.toFixed(2),
      f: focalLength,
      m: m === Infinity ? 'Infinity' : m.toFixed(2),
      nature: natureText
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* Canvas area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
          <div className="relative w-full aspect-[2/1] bg-gray-50 rounded border border-gray-200">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#1E3A5F" />
                </marker>
                <marker id="arrowhead-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#EF4444" />
                </marker>
                <marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#3B82F6" />
                </marker>
              </defs>

              {/* Grid lines */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Principal Axis */}
              <line x1="0" y1={originY} x2={svgWidth} y2={originY} stroke="#9CA3AF" strokeWidth="2" />
              
              {/* Lens */}
              <ellipse cx={originX} cy={originY} rx="15" ry="100" fill="rgba(191, 219, 254, 0.5)" stroke="#3B82F6" strokeWidth="2" />
              <line x1={originX} y1={originY - 120} x2={originX} y2={originY + 120} stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" />

              {/* Focus Points */}
              <circle cx={f1X} cy={originY} r="3" fill="#1E3A5F" />
              <text x={f1X} y={originY + 20} textAnchor="middle" fontSize="14" fill="#1E3A5F">F₁</text>
              
              <circle cx={f2X} cy={originY} r="3" fill="#1E3A5F" />
              <text x={f2X} y={originY + 20} textAnchor="middle" fontSize="14" fill="#1E3A5F">F₂</text>

              <circle cx={f2_1X} cy={originY} r="3" fill="#1E3A5F" />
              <text x={f2_1X} y={originY + 20} textAnchor="middle" fontSize="14" fill="#1E3A5F">2F₁</text>

              <circle cx={f2_2X} cy={originY} r="3" fill="#1E3A5F" />
              <text x={f2_2X} y={originY + 20} textAnchor="middle" fontSize="14" fill="#1E3A5F">2F₂</text>

              <circle cx={originX} cy={originY} r="3" fill="#1E3A5F" />
              <text x={originX - 10} y={originY + 20} textAnchor="end" fontSize="14" fill="#1E3A5F">O</text>

              {/* Object */}
              <line x1={objX} y1={originY} x2={objX} y2={objTopY} stroke="#1E3A5F" strokeWidth="4" markerEnd="url(#arrowhead)" />
              <text x={objX} y={objTopY - 10} textAnchor="middle" fontSize="14" fill="#1E3A5F font-bold">A</text>
              <text x={objX} y={originY + 20} textAnchor="middle" fontSize="14" fill="#1E3A5F font-bold">B</text>

              {/* Rays */}
              {/* Ray 1 */}
              <line x1={objX} y1={objTopY} x2={originX} y2={objTopY} stroke="#EF4444" strokeWidth="2" markerEnd="url(#arrowhead-red)" />
              <line x1={originX} y1={objTopY} x2={f2X + (f2X-originX)*2} y2={originY + (originY-objTopY)*2} stroke="#EF4444" strokeWidth="2" />
              
              {/* Ray 2 */}
              <line x1={objX} y1={objTopY} x2={originX + (originX-objX)*2} y2={originY + (originY-objTopY)*2} stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />

              {/* Virtual Ray extensions if virtual image */}
              {isVirtual && v !== Infinity && (
                <>
                  <line x1={originX} y1={objTopY} x2={imgX} y2={imgTopY} stroke="#EF4444" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1={originX} y1={originY} x2={imgX} y2={imgTopY} stroke="#3B82F6" strokeWidth="2" strokeDasharray="5 5" />
                </>
              )}

              {/* Image */}
              {v !== Infinity && (
                <>
                  <line 
                    x1={imgX} y1={originY} x2={imgX} y2={imgTopY} 
                    stroke={isVirtual ? "#9CA3AF" : "#1E3A5F"} 
                    strokeWidth="4" 
                    strokeDasharray={isVirtual ? "5 5" : "none"}
                    markerEnd={isVirtual ? "none" : "url(#arrowhead)"} 
                  />
                  {isVirtual && (
                    <polygon 
                      points={`${imgX},${imgTopY} ${imgX-4},${imgTopY+6} ${imgX+4},${imgTopY+6}`} 
                      fill="#9CA3AF" 
                      transform={m < 0 ? `rotate(180 ${imgX} ${imgTopY})` : ""}
                    />
                  )}
                  <text x={imgX} y={m < 0 ? imgTopY + 20 : imgTopY - 10} textAnchor="middle" fontSize="14" fill="#1E3A5F">A'</text>
                  <text x={imgX} y={originY + (m < 0 ? -10 : 20)} textAnchor="middle" fontSize="14" fill="#1E3A5F">B'</text>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-gray-700">Object Distance |u|</label>
              <span className="text-[#1E3A5F] font-bold bg-blue-50 px-2 rounded">{objDistance} cm</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="80" 
              step="1"
              value={objDistance}
              onChange={(e) => setObjDistance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 cm</span>
              <span>80 cm</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-gray-700">Focal Length f</label>
              <span className="text-[#1E3A5F] font-bold bg-blue-50 px-2 rounded">{focalLength} cm</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="40" 
              step="1"
              value={focalLength}
              onChange={(e) => setFocalLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10 cm</span>
              <span>40 cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex-1">
          <h3 className="text-lg font-bold text-[#1E3A5F] mb-6 border-b pb-2">Measurements</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
              <span className="text-gray-600 font-medium">Object Dist. (u)</span>
              <span className="font-bold text-gray-900">{-objDistance} cm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
              <span className="text-gray-600 font-medium">Focal Length (f)</span>
              <span className="font-bold text-gray-900">{focalLength} cm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
              <span className="text-blue-800 font-medium">Image Dist. (v)</span>
              <span className="font-bold text-blue-900">
                {v === Infinity ? 'Infinity' : `${v > 0 ? '+' : ''}${v.toFixed(2)} cm`}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
              <span className="text-gray-600 font-medium">Magnification (m)</span>
              <span className="font-bold text-gray-900">
                {m === Infinity ? 'Infinity' : m.toFixed(2)}
              </span>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Image Nature:</p>
              <p className="font-bold text-[#1E3A5F] bg-blue-50 p-3 rounded text-center border border-blue-100">
                {natureText}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleAddClick}
          className="w-full py-4 bg-[#F59E0B] hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-sm flex items-center justify-center transition-colors"
        >
          <Plus className="mr-2" /> Add to Observation Table
        </button>
      </div>
    </div>
  );
}
