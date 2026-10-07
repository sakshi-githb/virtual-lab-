import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ConcaveLensSimulator({ onAddObservation }) {
  const [focalLength, setFocalLength] = useState(20); // f in cm
  const [objDistance, setObjDistance] = useState(30); // |u| in cm
  const objHeight = 20;

  // Sign convention for Concave Lens:
  // u = -objDistance, f = -focalLength
  const u = -Math.abs(objDistance);
  const f = -Math.abs(focalLength);

  // 1/v = 1/f + 1/u => v = (u * f) / (u + f)
  const v = (u * f) / (u + f);
  const m = v / u;
  const imgHeight = m * objHeight;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 400;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;
  const scale = 4;

  const getX = (val_cm) => originX + val_cm * scale;
  const getY = (val_cm) => originY - val_cm * scale;

  const objX = getX(u);
  const objTopY = getY(objHeight);
  const imgX = getX(v);
  const imgTopY = getY(imgHeight);

  const f1X = getX(f);
  const f2X = getX(-f);

  const handleAddClick = () => {
    onAddObservation({
      u: objDistance,
      v: v.toFixed(2),
      f: -focalLength,
      m: m.toFixed(2),
      nature: 'Virtual, Erect & Diminished'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              <pattern id="grid-concave" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-concave)" />

              {/* Principal Axis */}
              <line x1="0" y1={originY} x2={svgWidth} y2={originY} stroke="#1A1A1A" strokeWidth="2" />

              {/* Concave Lens Icon */}
              <path 
                d={`M ${originX-12} ${originY-100} Q ${originX} ${originY-50} ${originX-12} ${originY+100} L ${originX+12} ${originY+100} Q ${originX} ${originY+50} ${originX+12} ${originY-100} Z`} 
                fill="rgba(191, 219, 254, 0.6)" 
                stroke="#3B82F6" 
                strokeWidth="2.5" 
              />
              <line x1={originX} y1={originY - 120} x2={originX} y2={originY + 120} stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Focal Points */}
              <circle cx={f1X} cy={originY} r="4" fill="#1A1A1A" />
              <text x={f1X} y={originY + 20} textAnchor="middle" fontSize="12" fontWeight="800">F₁</text>
              <circle cx={f2X} cy={originY} r="4" fill="#1A1A1A" />
              <text x={f2X} y={originY + 20} textAnchor="middle" fontSize="12" fontWeight="800">F₂</text>
              <circle cx={originX} cy={originY} r="4" fill="#1A1A1A" />
              <text x={originX - 10} y={originY + 20} textAnchor="end" fontSize="12" fontWeight="800">O</text>

              {/* Object Arrow */}
              <line x1={objX} y1={originY} x2={objX} y2={objTopY} stroke="#DC2626" strokeWidth="4" />
              <polygon points={`${objX},${objTopY-6} ${objX-5},${objTopY+4} ${objX+5},${objTopY+4}`} fill="#DC2626" />
              <text x={objX} y={objTopY - 12} textAnchor="middle" fontSize="12" fontWeight="900" fill="#DC2626">Object A</text>

              {/* Parallel Incident Ray -> Diverging Ray */}
              <line x1={objX} y1={objTopY} x2={originX} y2={objTopY} stroke="#DC2626" strokeWidth="2" />
              <line x1={originX} y1={objTopY} x2={originX + 200} y2={objTopY - 80} stroke="#DC2626" strokeWidth="2" />
              {/* Virtual Ray extension back to F1 */}
              <line x1={originX} y1={objTopY} x2={f1X} y2={originY} stroke="#DC2626" strokeWidth="2" strokeDasharray="4 4" />

              {/* Ray through Optical Centre */}
              <line x1={objX} y1={objTopY} x2={originX + 200} y2={originY + 150} stroke="#2563EB" strokeWidth="2" />

              {/* Virtual Image Arrow */}
              <line x1={imgX} y1={originY} x2={imgX} y2={imgTopY} stroke="#10B981" strokeWidth="3" strokeDasharray="4 4" />
              <polygon points={`${imgX},${imgTopY-4} ${imgX-4},${imgTopY+4} ${imgX+4},${imgTopY+4}`} fill="#10B981" />
              <text x={imgX} y={imgTopY - 10} textAnchor="middle" fontSize="12" fontWeight="900" fill="#10B981">Image A'</text>
            </svg>
          </div>
        </div>

        {/* Sliders */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Object Distance (|u|)</span>
              <span className="text-brutalRed">{objDistance} cm</span>
            </div>
            <input 
              type="range" min="10" max="80" step="1" value={objDistance}
              onChange={(e) => setObjDistance(Number(e.target.value))}
              className="w-full accent-charcoal cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Focal Length (|f|)</span>
              <span className="text-brutalBlue">{focalLength} cm</span>
            </div>
            <input 
              type="range" min="10" max="40" step="1" value={focalLength}
              onChange={(e) => setFocalLength(Number(e.target.value))}
              className="w-full accent-charcoal cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Info HUD */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Measurements</h3>
          
          <div className="p-2.5 bg-cream border-2 border-charcoal flex justify-between">
            <span>Object Dist (u)</span>
            <span className="font-bold">{u} cm</span>
          </div>

          <div className="p-2.5 bg-cream border-2 border-charcoal flex justify-between">
            <span>Focal Length (f)</span>
            <span className="font-bold">{f} cm</span>
          </div>

          <div className="p-2.5 bg-brutalGreen/20 border-2 border-charcoal flex justify-between">
            <span>Image Dist (v)</span>
            <span className="font-bold text-emerald-800">{v.toFixed(2)} cm</span>
          </div>

          <div className="p-2.5 bg-cream border-2 border-charcoal flex justify-between">
            <span>Magnification (m)</span>
            <span className="font-bold">{m.toFixed(2)}</span>
          </div>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal font-sans text-center">
            <span className="font-black text-xs uppercase text-charcoal">Image Characteristics:</span>
            <p className="font-extrabold text-sm text-charcoal mt-1">Virtual, Erect & Diminished</p>
          </div>
        </div>

        <button 
          onClick={handleAddClick}
          className="btn-brutal-yellow py-3.5 font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add to Observation Table
        </button>
      </div>
    </div>
  );
}
