import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function SeriesParallelSimulator({ onAddObservation }) {
  const [circuitMode, setCircuitMode] = useState('series'); // 'series' | 'parallel'
  const [r1, setR1] = useState(10); // R1 in Ohms
  const [r2, setR2] = useState(20); // R2 in Ohms
  const [voltage, setVoltage] = useState(12); // Source V

  // Calculations
  const rEq = circuitMode === 'series' 
    ? r1 + r2 
    : (r1 * r2) / (r1 + r2);

  const totalCurrent = rEq > 0 ? voltage / rEq : 0;
  
  // Individual Branch Measurements
  const v1 = circuitMode === 'series' ? totalCurrent * r1 : voltage;
  const v2 = circuitMode === 'series' ? totalCurrent * r2 : voltage;
  const i1 = circuitMode === 'series' ? totalCurrent : voltage / r1;
  const i2 = circuitMode === 'series' ? totalCurrent : voltage / r2;

  const handleRecord = () => {
    onAddObservation({
      mode: circuitMode.toUpperCase(),
      r1: `${r1} Ω`,
      r2: `${r2} Ω`,
      voltage: `${voltage} V`,
      rEq: `${rEq.toFixed(2)} Ω`,
      current: `${totalCurrent.toFixed(2)} A`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* Mode Selector Header */}
        <div className="card-brutal bg-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs font-black uppercase text-charcoal">
            Circuit Configuration Mode:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCircuitMode('series')}
              className={`btn-brutal text-xs py-1.5 px-4 uppercase font-black ${
                circuitMode === 'series' ? 'bg-brutalYellow text-charcoal' : 'bg-cream text-charcoal'
              }`}
            >
              Series Circuit (Rs = R1 + R2)
            </button>
            <button
              onClick={() => setCircuitMode('parallel')}
              className={`btn-brutal text-xs py-1.5 px-4 uppercase font-black ${
                circuitMode === 'parallel' ? 'bg-brutalBlue text-white' : 'bg-cream text-charcoal'
              }`}
            >
              Parallel Circuit (1/Rp = 1/R1 + 1/R2)
            </button>
          </div>
        </div>

        {/* SVG Diagram Canvas */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <pattern id="grid-sp" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-sp)" />

              {/* Power Supply (Bottom) */}
              <g transform="translate(400, 320)">
                <rect x="-40" y="-18" width="80" height="36" fill="#FACC15" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="14">DC {voltage}V</text>
              </g>

              {circuitMode === 'series' ? (
                /* Series Loop */
                <g>
                  {/* Wire loop */}
                  <path d="M 150 320 L 100 320 L 100 120 L 700 120 L 700 320 L 650 320" fill="none" stroke="#DC2626" strokeWidth="4" />
                  
                  {/* Resistor R1 */}
                  <g transform="translate(300, 120)">
                    <rect x="-40" y="-20" width="80" height="40" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                    <text x="0" y="-25" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">R1 = {r1}Ω</text>
                    <text x="0" y="5" textAnchor="middle" fontWeight="800" fontSize="12" fill="#2563EB">V1 = {v1.toFixed(2)}V</text>
                  </g>

                  {/* Resistor R2 */}
                  <g transform="translate(500, 120)">
                    <rect x="-40" y="-20" width="80" height="40" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                    <text x="0" y="-25" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">R2 = {r2}Ω</text>
                    <text x="0" y="5" textAnchor="middle" fontWeight="800" fontSize="12" fill="#2563EB">V2 = {v2.toFixed(2)}V</text>
                  </g>
                </g>
              ) : (
                /* Parallel Branches */
                <g>
                  <path d="M 360 320 L 150 320 L 150 100 L 650 100 L 650 320 L 440 320" fill="none" stroke="#DC2626" strokeWidth="4" />
                  <path d="M 250 100 L 250 220 L 550 220 L 550 100" fill="none" stroke="#DC2626" strokeWidth="4" />

                  {/* R1 Top Branch */}
                  <g transform="translate(400, 100)">
                    <rect x="-40" y="-20" width="80" height="40" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                    <text x="0" y="-25" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">R1 = {r1}Ω</text>
                    <text x="0" y="5" textAnchor="middle" fontWeight="800" fontSize="12" fill="#DC2626">I1 = {i1.toFixed(2)}A</text>
                  </g>

                  {/* R2 Bottom Branch */}
                  <g transform="translate(400, 220)">
                    <rect x="-40" y="-20" width="80" height="40" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                    <text x="0" y="-25" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">R2 = {r2}Ω</text>
                    <text x="0" y="5" textAnchor="middle" fontWeight="800" fontSize="12" fill="#DC2626">I2 = {i2.toFixed(2)}A</text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Resistor R1 Resistance</span>
              <span className="text-brutalBlue">{r1} Ω</span>
            </div>
            <input type="range" min="5" max="50" step="5" value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Resistor R2 Resistance</span>
              <span className="text-brutalBlue">{r2} Ω</span>
            </div>
            <input type="range" min="5" max="50" step="5" value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>DC Voltage Source (V)</span>
              <span className="text-brutalRed">{voltage} V</span>
            </div>
            <input type="range" min="2" max="24" step="2" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Telemetry HUD */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Equivalent Measurements</h3>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Equivalent Req</span>
            <span className="font-black text-sm text-charcoal">{rEq.toFixed(2)} Ω</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span className="font-bold">Total Current I</span>
            <span className="font-black text-sm text-brutalRed">{totalCurrent.toFixed(2)} A</span>
          </div>

          <div className="space-y-2 pt-2 border-t-2 border-charcoal">
            <div className="flex justify-between">
              <span>Branch 1 (R1):</span>
              <span className="font-bold">{v1.toFixed(1)}V / {i1.toFixed(2)}A</span>
            </div>
            <div className="flex justify-between">
              <span>Branch 2 (R2):</span>
              <span className="font-bold">{v2.toFixed(1)}V / {i2.toFixed(2)}A</span>
            </div>
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
