import React, { useState } from 'react';
import { Plus, Zap, AlertTriangle } from 'lucide-react';

export default function SimpleCircuitSimulator({ onAddObservation }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [voltage, setVoltage] = useState(6); // V
  const [bulbResistance, setBulbResistance] = useState(12); // Ohms
  const [isShortCircuit, setIsShortCircuit] = useState(false);

  const current = isSwitchOn && !isShortCircuit ? voltage / bulbResistance : 0;
  const power = current * voltage;
  const brightnessPercent = Math.min(100, Math.round((power / 10) * 100));

  const handleRecord = () => {
    onAddObservation({
      state: isSwitchOn ? (isShortCircuit ? 'SHORT CIRCUIT' : 'CLOSED') : 'OPEN',
      voltage: `${voltage} V`,
      current: `${current.toFixed(2)} A`,
      power: `${power.toFixed(2)} W`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* Circuit Diagram */}
        <div className="card-brutal bg-white p-4">
          <div className="relative w-full aspect-[2.2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 360" className="w-full h-full">
              <pattern id="grid-sc" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-sc)" />

              {/* Wire Loop */}
              <path 
                d="M 150 280 L 100 280 L 100 100 L 700 100 L 700 280 L 650 280" 
                fill="none" 
                stroke={isShortCircuit ? "#DC2626" : isSwitchOn ? "#F59E0B" : "#1A1A1A"} 
                strokeWidth={isSwitchOn ? "4" : "3"} 
              />

              {/* Battery */}
              <g transform="translate(100, 190)">
                <rect x="-25" y="-30" width="50" height="60" fill="#FACC15" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="14">{voltage}V</text>
              </g>

              {/* Switch Key */}
              <g transform="translate(400, 280)">
                <rect x="-35" y="-15" width="70" height="30" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                <circle cx="-20" cy="0" r="4" fill="#1A1A1A" />
                <circle cx="20" cy="0" r="4" fill="#1A1A1A" />
                {isSwitchOn && <line x1="-20" y1="0" x2="20" y2="0" stroke="#DC2626" strokeWidth="4" />}
                <text x="0" y="28" textAnchor="middle" fontWeight="800" fontSize="12">
                  {isSwitchOn ? 'SWITCH CLOSED' : 'SWITCH OPEN'}
                </text>
              </g>

              {/* Light Bulb */}
              <g transform="translate(400, 100)">
                <circle 
                  cx="0" cy="0" r="30" 
                  fill={isSwitchOn && !isShortCircuit ? `rgba(250, 204, 21, ${0.3 + (brightnessPercent/100)*0.7})` : "#FFFFFF"} 
                  stroke="#1A1A1A" strokeWidth="3" 
                />
                <path d="M -10 10 L 0 -15 L 10 10" fill="none" stroke="#1A1A1A" strokeWidth="2" />
                {isSwitchOn && !isShortCircuit && (
                  <circle cx="0" cy="0" r="40" fill="rgba(250, 204, 21, 0.2)" />
                )}
                <text x="0" y="-40" textAnchor="middle" fontWeight="900" fontSize="14">Bulb ({bulbResistance}Ω)</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Controls */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsSwitchOn(!isSwitchOn)}
              className={`flex-1 py-3 font-black text-xs uppercase border-3 border-charcoal shadow-brutal cursor-pointer ${
                isSwitchOn ? 'bg-brutalGreen text-white' : 'bg-brutalRed text-white'
              }`}
            >
              {isSwitchOn ? 'CLOSE SWITCH (POWER ON)' : 'OPEN SWITCH (POWER OFF)'}
            </button>

            <button
              onClick={() => setIsShortCircuit(!isShortCircuit)}
              className={`py-3 px-4 font-mono font-bold text-xs uppercase border-3 border-charcoal shadow-brutal cursor-pointer ${
                isShortCircuit ? 'bg-brutalRed text-white' : 'bg-cream text-charcoal'
              }`}
            >
              {isShortCircuit ? 'SHORT CIRCUIT DETECTED!' : 'Test Short Circuit'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Battery Voltage</span>
                <span className="text-brutalBlue">{voltage} V</span>
              </div>
              <input type="range" min="3" max="24" step="3" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Bulb Filament Resistance</span>
                <span>{bulbResistance} Ω</span>
              </div>
              <input type="range" min="4" max="40" step="4" value={bulbResistance} onChange={(e) => setBulbResistance(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Circuit Telemetry</h3>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Current Flow (I)</span>
            <span className="font-black text-sm text-brutalRed">{current.toFixed(2)} A</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Power Dissipated (P)</span>
            <span className="font-black text-sm text-brutalBlue">{power.toFixed(2)} W</span>
          </div>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span>Lamp Luminosity</span>
            <span className="font-black text-sm text-charcoal">{brightnessPercent}%</span>
          </div>

          {isShortCircuit && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 font-sans text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>Short Circuit Error! Current bypasses load.</span>
            </div>
          )}
        </div>

        <button
          onClick={handleRecord}
          disabled={!isSwitchOn}
          className="btn-brutal-yellow py-3.5 font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Record Reading to Table
        </button>
      </div>
    </div>
  );
}
