import React, { useState } from 'react';
import { Plus, Check, AlertTriangle, RefreshCw } from 'lucide-react';

export default function OhmsLawSimulator({ onAddObservation }) {
  // Circuit Wiring Checklist
  const [wireBattery, setWireBattery] = useState(false);
  const [wireKey, setWireKey] = useState(false);
  const [wireRheostat, setWireRheostat] = useState(false);
  const [wireResistor, setWireResistor] = useState(false);
  const [wireAmmeter, setWireAmmeter] = useState(false); // Series connection
  const [wireVoltmeter, setWireVoltmeter] = useState(false); // Parallel connection

  // Circuit Operating Controls
  const [isKeyClosed, setIsKeyClosed] = useState(false);
  const [resistorValue, setResistorValue] = useState(10); // R in Ohms
  const [rheostatSetting, setRheostatSetting] = useState(20); // Rheostat Rh in Ohms
  const [sourceVoltage, setSourceVoltage] = useState(12); // DC Supply in Volts

  // Derived Calculations
  const isCircuitComplete = wireBattery && wireKey && wireRheostat && wireResistor && wireAmmeter && wireVoltmeter;
  const isCircuitActive = isCircuitComplete && isKeyClosed;

  const totalResistance = resistorValue + rheostatSetting;
  const currentI = isCircuitActive && totalResistance > 0 ? sourceVoltage / totalResistance : 0; // I in Amperes
  const voltageV = isCircuitActive ? currentI * resistorValue : 0; // V across resistor in Volts

  const handleRecordObservation = () => {
    if (!isCircuitActive) return;
    onAddObservation({
      voltage: voltageV.toFixed(2),
      current: currentI.toFixed(2),
      resistance: resistorValue.toFixed(1),
      calcR: (voltageV / (currentI || 1)).toFixed(2)
    });
  };

  const handleAutoWireAll = () => {
    setWireBattery(true);
    setWireKey(true);
    setWireRheostat(true);
    setWireResistor(true);
    setWireAmmeter(true);
    setWireVoltmeter(true);
    setIsKeyClosed(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* Left Area: Circuit Diagram & Apparatus Workspace */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* SVG Circuit Canvas */}
        <div className="card-brutal bg-white p-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-charcoal">
            <span className="font-mono text-xs font-black uppercase text-charcoal">
              ⚡ Electrical Bench: Ohm's Law Circuit Diagram
            </span>
            <button
              onClick={handleAutoWireAll}
              className="btn-brutal text-[10px] py-1 px-2.5 bg-brutalYellow font-mono font-black uppercase flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Auto-Wire Circuit
            </button>
          </div>

          <div className="relative w-full aspect-[2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Grid Background */}
              <pattern id="grid-ohms" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-ohms)" />

              {/* Main Outer Circuit Loop */}
              {/* Battery (Bottom Left) */}
              <g transform="translate(100, 300)">
                <rect x="-30" y="-20" width="60" height="40" fill="#FACC15" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="5" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">DC {sourceVoltage}V</text>
                <text x="-40" y="5" fontWeight="900" fontSize="16" fill="#DC2626">+</text>
                <text x="40" y="5" fontWeight="900" fontSize="16" fill="#1A1A1A">-</text>
              </g>

              {/* Plug Key (Bottom Center) */}
              <g transform="translate(350, 300)">
                <rect x="-30" y="-15" width="60" height="30" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                <circle cx="-15" cy="0" r="4" fill="#1A1A1A" />
                <circle cx="15" cy="0" r="4" fill="#1A1A1A" />
                {isKeyClosed && <line x1="-15" y1="0" x2="15" y2="0" stroke="#2563EB" strokeWidth="4" />}
                <text x="0" y="28" textAnchor="middle" fontWeight="800" fontSize="12" fill="#1A1A1A">
                  KEY ({isKeyClosed ? 'CLOSED' : 'OPEN'})
                </text>
              </g>

              {/* Rheostat (Bottom Right) */}
              <g transform="translate(600, 300)">
                <rect x="-40" y="-15" width="80" height="30" fill="#E5E7EB" stroke="#1A1A1A" strokeWidth="3" />
                <path d="M -30 0 L -20 -10 L -10 10 L 0 -10 L 10 10 L 20 -10 L 30 0" fill="none" stroke="#1A1A1A" strokeWidth="2" />
                {/* Arrow Slider */}
                <line x1={-30 + (rheostatSetting/100)*60} y1="-25" x2={-30 + (rheostatSetting/100)*60} y2="-5" stroke="#DC2626" strokeWidth="3" markerEnd="url(#arrow)" />
                <text x="0" y="28" textAnchor="middle" fontWeight="800" fontSize="12" fill="#1A1A1A">Rheostat ({rheostatSetting}Ω)</text>
              </g>

              {/* Resistor R (Top Center) */}
              <g transform="translate(400, 100)">
                <rect x="-40" y="-20" width="80" height="40" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
                <path d="M -30 0 L -20 -10 L -10 10 L 0 -10 L 10 10 L 20 -10 L 30 0" fill="none" stroke="#2563EB" strokeWidth="3" />
                <text x="0" y="-28" textAnchor="middle" fontWeight="900" fontSize="14" fill="#1A1A1A">Resistor R ({resistorValue}Ω)</text>
              </g>

              {/* Ammeter (Top Right in Series) */}
              <g transform="translate(650, 100)">
                <circle cx="0" cy="0" r="24" fill="#3B82F6" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="6" textAnchor="middle" fontWeight="900" fontSize="16" fill="#FFFFFF">A</text>
                <text x="0" y="38" textAnchor="middle" fontWeight="800" fontSize="12" fill="#1A1A1A">
                  {isCircuitActive ? `${currentI.toFixed(2)} A` : '0.00 A'}
                </text>
              </g>

              {/* Voltmeter (Parallel to Resistor) */}
              <g transform="translate(400, 200)">
                <circle cx="0" cy="0" r="22" fill="#10B981" stroke="#1A1A1A" strokeWidth="3" />
                <text x="0" y="6" textAnchor="middle" fontWeight="900" fontSize="16" fill="#FFFFFF">V</text>
                <text x="0" y="36" textAnchor="middle" fontWeight="800" fontSize="12" fill="#1A1A1A">
                  {isCircuitActive ? `${voltageV.toFixed(2)} V` : '0.00 V'}
                </text>
                {/* Parallel leads to Resistor */}
                <line x1="-22" y1="0" x2="-60" y2="0" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="-60" y1="0" x2="-60" y2="-100" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="22" y1="0" x2="60" y2="0" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="60" y1="0" x2="60" y2="-100" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
              </g>

              {/* Wires */}
              <path 
                d="M 130 300 L 320 300 M 380 300 L 560 300 M 640 300 L 650 300 L 650 124 M 626 100 L 440 100 M 360 100 L 100 100 L 100 280" 
                fill="none" 
                stroke={isCircuitActive ? "#DC2626" : "#1A1A1A"} 
                strokeWidth={isCircuitActive ? "4" : "3"} 
              />
            </svg>
          </div>
        </div>

        {/* Guided Interactive Wiring Setup Controls */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-charcoal border-b-2 border-charcoal pb-2">
            Step-by-Step Circuit Assembly Checklist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            <button
              onClick={() => setWireBattery(!wireBattery)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireBattery ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>1. Power Battery</span>
              {wireBattery ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>

            <button
              onClick={() => setWireKey(!wireKey)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireKey ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>2. Switch Key</span>
              {wireKey ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>

            <button
              onClick={() => setWireRheostat(!wireRheostat)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireRheostat ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>3. Rheostat</span>
              {wireRheostat ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>

            <button
              onClick={() => setWireResistor(!wireResistor)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireResistor ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>4. Resistor (R)</span>
              {wireResistor ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>

            <button
              onClick={() => setWireAmmeter(!wireAmmeter)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireAmmeter ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>5. Ammeter (Series)</span>
              {wireAmmeter ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>

            <button
              onClick={() => setWireVoltmeter(!wireVoltmeter)}
              className={`p-3 border-2 border-charcoal flex items-center justify-between font-bold cursor-pointer ${
                wireVoltmeter ? 'bg-brutalGreen text-white' : 'bg-cream text-charcoal hover:bg-gray-100'
              }`}
            >
              <span>6. Voltmeter (Parallel)</span>
              {wireVoltmeter ? <Check className="w-4 h-4" /> : <span className="text-[10px]">[Wire]</span>}
            </button>
          </div>

          {!isCircuitComplete && (
            <div className="p-3 bg-amber-50 border-2 border-amber-400 text-amber-900 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Circuit Incomplete: Click the components above to wire all 6 required elements.</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Instrument Meters & Rheostat Sliders */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-6 flex-1">
          <h3 className="text-base font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">
            Apparatus Controls
          </h3>

          {/* Plug Key Switch */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-charcoal mb-2">
              Circuit Plug Key State
            </label>
            <button
              onClick={() => setIsKeyClosed(!isKeyClosed)}
              disabled={!isCircuitComplete}
              className={`w-full py-3 font-black text-xs uppercase border-3 border-charcoal shadow-brutal-sm cursor-pointer transition-all ${
                isKeyClosed ? 'bg-brutalGreen text-white' : 'bg-brutalRed text-white'
              }`}
            >
              {isKeyClosed ? 'KEY CLOSED (CURRENT ON)' : 'KEY OPEN (CIRCUIT OFF)'}
            </button>
          </div>

          {/* Rheostat Slider */}
          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Rheostat Resistance (Rh)</span>
              <span className="text-brutalBlue">{rheostatSetting} Ω</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={rheostatSetting}
              onChange={(e) => setRheostatSetting(Number(e.target.value))}
              disabled={!isCircuitActive}
              className="w-full accent-charcoal cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-charcoal/60 mt-0.5">
              <span>5 Ω (Max Current)</span>
              <span>100 Ω (Min Current)</span>
            </div>
          </div>

          {/* Resistor Value Selector */}
          <div>
            <div className="flex justify-between mb-1 font-mono text-xs font-bold">
              <span>Unknown Resistor (R)</span>
              <span className="text-brutalBlue">{resistorValue} Ω</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={resistorValue}
              onChange={(e) => setResistorValue(Number(e.target.value))}
              className="w-full accent-charcoal cursor-pointer"
            />
          </div>

          {/* Live Telemetry Display Cards */}
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-charcoal/70">Voltmeter Reading (V)</span>
              <span className="text-sm font-black text-brutalBlue">{voltageV.toFixed(2)} V</span>
            </div>

            <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-charcoal/70">Ammeter Reading (I)</span>
              <span className="text-sm font-black text-brutalRed">{currentI.toFixed(2)} A</span>
            </div>

            <div className="p-3 bg-brutalYellow/20 border-2 border-charcoal flex justify-between items-center font-mono">
              <span className="text-xs font-bold text-charcoal">V / I Ratio (R)</span>
              <span className="text-sm font-black text-charcoal">
                {isCircuitActive ? `${(voltageV / (currentI || 1)).toFixed(2)} Ω` : '0.00 Ω'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRecordObservation}
          disabled={!isCircuitActive}
          className="btn-brutal-yellow py-3.5 font-black text-sm uppercase shadow-brutal flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Reading to Table</span>
        </button>
      </div>
    </div>
  );
}
