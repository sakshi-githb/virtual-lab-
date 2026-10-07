import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function GlassSlabSimulator({ onAddObservation }) {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState(45); // i in deg
  const [glassIndex, setGlassIndex] = useState(1.52); // n for Crown Glass
  const slabThicknessCm = 15; // t in cm

  // Snell's Law: n1 * sin(i) = n2 * sin(r) => sin(r) = sin(i) / n
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinR = Math.sin(iRad) / glassIndex;
  const rRad = Math.asin(sinR);
  const refractionAngleDeg = (rRad * 180) / Math.PI;

  // Emergent Angle e = i
  const emergentAngleDeg = incidentAngleDeg;

  // Lateral Displacement d = t * sin(i - r) / cos(r)
  const lateralDispCm = (slabThicknessCm * Math.sin(iRad - rRad)) / Math.cos(rRad);

  // SVG parameters
  const svgWidth = 800;
  const svgHeight = 400;
  const originX = 400;
  const slabTopY = 120;
  const slabBottomY = 280;

  // Calculate SVG ray coordinates
  const entryX = originX;
  const entryY = slabTopY;

  // Ray inside slab
  const dxInside = (slabBottomY - slabTopY) * Math.tan(rRad);
  const exitX = entryX + dxInside;
  const exitY = slabBottomY;

  // Ray entering slab
  const dxIncident = (slabTopY - 40) * Math.tan(iRad);
  const startX = entryX - dxIncident;
  const startY = 40;

  // Ray emerging slab
  const dxEmergent = (360 - slabBottomY) * Math.tan(iRad);
  const endX = exitX + dxEmergent;
  const endY = 360;

  const handleRecord = () => {
    onAddObservation({
      angle_i: `${incidentAngleDeg}°`,
      angle_r: `${refractionAngleDeg.toFixed(2)}°`,
      angle_e: `${emergentAngleDeg}°`,
      index_n: glassIndex.toFixed(2),
      displacement: `${lateralDispCm.toFixed(2)} cm`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* SVG Optical Slab Diagram */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              <pattern id="grid-gs" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-gs)" />

              {/* Glass Slab */}
              <rect 
                x="150" y={slabTopY} width="500" height={slabBottomY - slabTopY} 
                fill="rgba(191, 219, 254, 0.5)" stroke="#1A1A1A" strokeWidth="3" 
              />
              <text x="170" y={slabTopY + 30} fontWeight="900" fontSize="14" fill="#1A1A1A">
                Glass Medium (n = {glassIndex})
              </text>

              {/* Top Normal N1 */}
              <line x1={entryX} y1={entryY - 60} x2={entryX} y2={entryY + 60} stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
              <text x={entryX + 8} y={entryY - 45} fontSize="12" fontWeight="800">N₁</text>

              {/* Bottom Normal N2 */}
              <line x1={exitX} y1={exitY - 60} x2={exitX} y2={exitY + 60} stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 4" />
              <text x={exitX + 8} y={exitY + 50} fontSize="12" fontWeight="800">N₂</text>

              {/* Incident Ray (Red) */}
              <line x1={startX} y1={startY} x2={entryX} y2={entryY} stroke="#DC2626" strokeWidth="3" />
              <text x={startX - 10} y={startY} fontSize="12" fontWeight="900" fill="#DC2626">Incident Ray (i = {incidentAngleDeg}°)</text>

              {/* Refracted Ray (Blue) */}
              <line x1={entryX} y1={entryY} x2={exitX} y2={exitY} stroke="#2563EB" strokeWidth="3" />
              <text x={(entryX + exitX) / 2 + 10} y={(entryY + exitY) / 2} fontSize="12" fontWeight="900" fill="#2563EB">
                r = {refractionAngleDeg.toFixed(1)}°
              </text>

              {/* Emergent Ray (Red) */}
              <line x1={exitX} y1={exitY} x2={endX} y2={endY} stroke="#DC2626" strokeWidth="3" />
              <text x={endX + 10} y={endY} fontSize="12" fontWeight="900" fill="#DC2626">Emergent Ray (e = {emergentAngleDeg}°)</text>

              {/* Original Undeviated Ray Path (Dashed) */}
              <line 
                x1={entryX} y1={entryY} 
                x2={entryX + (360 - slabTopY) * Math.tan(iRad)} y2={360} 
                stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4" 
              />
            </svg>
          </div>
        </div>

        {/* Sliders */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Angle of Incidence (i)</span>
                <span className="text-brutalRed">{incidentAngleDeg}°</span>
              </div>
              <input 
                type="range" min="15" max="75" step="5" value={incidentAngleDeg} 
                onChange={(e) => setIncidentAngleDeg(Number(e.target.value))} 
                className="w-full accent-charcoal cursor-pointer" 
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Glass Medium (n)</span>
                <span className="text-brutalBlue">{glassIndex}</span>
              </div>
              <select 
                value={glassIndex} 
                onChange={(e) => setGlassIndex(Number(e.target.value))}
                className="w-full p-2 border-2 border-charcoal font-mono text-xs font-bold bg-cream"
              >
                <option value={1.52}>Crown Glass (n = 1.52)</option>
                <option value={1.66}>Dense Flint Glass (n = 1.66)</option>
                <option value={1.33}>Water Cell (n = 1.33)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Refraction Measurements</h3>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Incident Angle i</span>
            <span className="font-black text-sm text-brutalRed">{incidentAngleDeg}°</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Refracted Angle r</span>
            <span className="font-black text-sm text-brutalBlue">{refractionAngleDeg.toFixed(2)}°</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Emergent Angle e</span>
            <span className="font-black text-sm text-emerald-800">{emergentAngleDeg}°</span>
          </div>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span>Lateral Shift (d)</span>
            <span className="font-black text-sm text-charcoal">{lateralDispCm.toFixed(2)} cm</span>
          </div>

          <div className="p-3 bg-blue-50 border-2 border-blue-300 font-sans text-xs">
            <strong>Snell's Verification:</strong><br />
            sin(i) / sin(r) = {Math.sin(iRad).toFixed(3)} / {sinR.toFixed(3)} = <strong>{glassIndex.toFixed(2)}</strong>
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
