import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, PlusCircle, Thermometer, Flame } from 'lucide-react';

const SUBSTANCES = {
  water: { name: 'Water', c: 4184, color: '#3b82f6', bg: '#dbeafe' },
  aluminum: { name: 'Aluminum', c: 900, color: '#94a3b8', bg: '#e2e8f0' },
  copper: { name: 'Copper', c: 385, color: '#b45309', bg: '#fef3c7' },
  iron: { name: 'Iron', c: 450, color: '#475569', bg: '#cbd5e1' }
};

export default function HeatTransferSimulator({ onAddObservation }) {
  const [substanceKey, setSubstanceKey] = useState('water');
  const [mass, setMass] = useState(0.5); // kg
  const [initialTemp, setInitialTemp] = useState(25); // °C
  const [targetTemp, setTargetTemp] = useState(75); // °C
  const [currentTemp, setCurrentTemp] = useState(25);
  const [heaterPower, setHeaterPower] = useState(1000); // Watts (J/s)
  const [isHeating, setIsHeating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds

  const substance = SUBSTANCES[substanceKey];
  const tempDiff = targetTemp - initialTemp;
  const totalHeatJoules = mass * substance.c * Math.max(0, tempDiff); // Q = m * c * deltaT
  const calculatedTimeSec = heaterPower > 0 ? totalHeatJoules / heaterPower : 0;

  useEffect(() => {
    setCurrentTemp(initialTemp);
    setElapsedTime(0);
    setIsHeating(false);
  }, [substanceKey, mass, initialTemp, targetTemp]);

  useEffect(() => {
    let timer;
    if (isHeating) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => {
          const nextTime = prevTime + 0.1;
          const heatAdded = nextTime * heaterPower;
          const newTemp = initialTemp + heatAdded / (mass * substance.c);
          if (newTemp >= targetTemp) {
            setCurrentTemp(targetTemp);
            setIsHeating(false);
            return calculatedTimeSec;
          }
          setCurrentTemp(newTemp);
          return nextTime;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isHeating, initialTemp, targetTemp, mass, substance.c, heaterPower, calculatedTimeSec]);

  const handleReset = () => {
    setIsHeating(false);
    setCurrentTemp(initialTemp);
    setElapsedTime(0);
  };

  const handleRecord = () => {
    if (onAddObservation) {
      onAddObservation({
        trial: Date.now(),
        substance: substance.name,
        specificHeat: `${substance.c} J/kg°C`,
        mass: `${mass.toFixed(2)} kg`,
        initialTemp: `${initialTemp}°C`,
        finalTemp: `${currentTemp.toFixed(1)}°C`,
        deltaTemp: `${(currentTemp - initialTemp).toFixed(1)}°C`,
        heatRequired: `${(totalHeatJoules / 1000).toFixed(2)} kJ`,
        timeSec: `${elapsedTime.toFixed(1)} s`
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-orange-50 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono">
      {/* Controls Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-white p-5 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black bg-orange-300 p-2 border-2 border-black rounded uppercase text-center flex items-center justify-center gap-2">
          <Flame size={20} /> Specific Heat Lab
        </h3>

        {/* Substance Selector */}
        <div>
          <label className="font-bold text-sm block mb-1">Select Material:</label>
          <select
            value={substanceKey}
            onChange={(e) => setSubstanceKey(e.target.value)}
            disabled={isHeating}
            className="w-full p-2 bg-amber-100 border-2 border-black rounded font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {Object.entries(SUBSTANCES).map(([key, sub]) => (
              <option key={key} value={key}>
                {sub.name} (c = {sub.c} J/kg°C)
              </option>
            ))}
          </select>
        </div>

        {/* Mass Slider */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Mass (m):</span>
            <span className="text-blue-700">{mass.toFixed(2)} kg</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            disabled={isHeating}
            className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Initial Temp */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Initial Temp (T1):</span>
            <span className="text-emerald-700">{initialTemp}°C</span>
          </div>
          <input
            type="range"
            min="10"
            max="40"
            step="1"
            value={initialTemp}
            onChange={(e) => setInitialTemp(parseInt(e.target.value))}
            disabled={isHeating}
            className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Target Temp */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Target Temp (T2):</span>
            <span className="text-red-700">{targetTemp}°C</span>
          </div>
          <input
            type="range"
            min="45"
            max="100"
            step="5"
            value={targetTemp}
            onChange={(e) => setTargetTemp(parseInt(e.target.value))}
            disabled={isHeating}
            className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Heater Power */}
        <div>
          <div className="flex justify-between font-bold mb-1">
            <span>Heater Power (P):</span>
            <span className="text-purple-700">{heaterPower} W</span>
          </div>
          <input
            type="range"
            min="250"
            max="2000"
            step="250"
            value={heaterPower}
            onChange={(e) => setHeaterPower(parseInt(e.target.value))}
            disabled={isHeating}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setIsHeating(!isHeating)}
              className={`flex-1 py-3 font-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 ${
                isHeating ? 'bg-amber-400 text-black' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isHeating ? <Pause size={18} /> : <Play size={18} />}
              {isHeating ? 'PAUSE' : 'START HEATING'}
            </button>

            <button
              onClick={handleReset}
              className="p-3 font-black bg-gray-200 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-300"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <button
            onClick={handleRecord}
            className="w-full py-3 font-black bg-yellow-300 text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} /> RECORD OBSERVATION
          </button>
        </div>
      </div>

      {/* Visualizer & Thermometer */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="relative w-full h-[380px] bg-slate-900 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-around p-4">
          {/* Beaker with Sample */}
          <div className="relative w-48 h-64 border-4 border-t-0 border-slate-300 rounded-b-2xl bg-slate-800/40 flex items-end justify-center p-2 shadow-inner">
            {/* Liquid / Metal container */}
            <div
              className="w-full rounded-b-xl transition-all duration-300 flex items-center justify-center border-2 border-black/30"
              style={{
                height: `${Math.min(90, mass * 40)}%`,
                backgroundColor: substance.color,
                opacity: 0.85
              }}
            >
              <span className="text-white font-black text-sm drop-shadow">
                {substance.name} ({mass}kg)
              </span>
            </div>

            {/* Bubble effect when heating */}
            {isHeating && (
              <div className="absolute inset-0 flex justify-around items-end overflow-hidden pointer-events-none">
                <div className="w-3 h-3 bg-white/70 rounded-full animate-ping mb-4" />
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce mb-8" />
                <div className="w-4 h-4 bg-white/70 rounded-full animate-ping mb-2" />
              </div>
            )}

            {/* Hot plate heater underneath */}
            <div
              className={`absolute -bottom-6 w-56 h-6 border-2 border-black rounded-lg transition-colors ${
                isHeating ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-gray-700'
              }`}
            />
          </div>

          {/* Digital & Mercury Thermometer Display */}
          <div className="flex flex-col items-center gap-2 bg-slate-800 p-4 rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <Thermometer className="text-red-400" /> THERMOMETER
            </div>

            {/* Mercury Column */}
            <div className="relative w-8 h-48 bg-slate-700 border-2 border-black rounded-full overflow-hidden flex items-end">
              <div
                className="w-full bg-red-500 transition-all duration-200"
                style={{ height: `${Math.min(100, (currentTemp / 100) * 100)}%` }}
              />
            </div>

            {/* Digital Readout */}
            <div className="bg-emerald-950 text-emerald-400 font-mono font-black text-2xl px-4 py-2 border-2 border-black rounded shadow-inner">
              {currentTemp.toFixed(1)} °C
            </div>
            <div className="text-xs text-slate-300 font-bold">
              Elapsed Time: <span className="text-yellow-400">{elapsedTime.toFixed(1)} s</span>
            </div>
          </div>
        </div>

        {/* Heat Calculation Summary */}
        <div className="bg-white p-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="font-black text-sm text-gray-700">SPECIFIC HEAT EQUATION:</div>
            <div className="text-xs text-gray-600">
              Q = m × c × ΔT | ΔT = T₂ - T₁ = ({targetTemp}°C - {initialTemp}°C = {tempDiff}°C)
            </div>
            <div className="text-sm font-bold text-orange-700">
              Q = {mass} kg × {substance.c} J/kg°C × {tempDiff}°C = {(totalHeatJoules / 1000).toFixed(2)} kJ
            </div>
          </div>
          <div className="bg-orange-100 border-2 border-black p-3 rounded text-center min-w-[170px]">
            <div className="text-xs font-bold uppercase text-gray-700">Required Heat Q</div>
            <div className="text-2xl font-black text-orange-800">
              {(totalHeatJoules / 1000).toFixed(2)} kJ
            </div>
            <div className="text-[10px] font-bold text-gray-600">({totalHeatJoules.toFixed(0)} Joules)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
