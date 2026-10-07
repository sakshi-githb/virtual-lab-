import React, { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

export default function SoundWavesSimulator({ onAddObservation }) {
  const [frequency, setFrequency] = useState(250); // Hz
  const [amplitude, setAmplitude] = useState(30); // cm
  const [mediumSpeed, setMediumSpeed] = useState(340); // m/s in Air

  const wavelength = mediumSpeed / frequency; // λ = v / f
  const period = 1 / frequency; // T = 1 / f

  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let phase = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Oscilloscope Grid
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center Baseline
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Sine Wave Path
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 4;
      ctx.beginPath();

      const spatialFreq = (2 * Math.PI) / (wavelength * 120); // Scale factor for canvas width
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 - amplitude * Math.sin(spatialFreq * x - phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.08 * (frequency / 100);
      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, [frequency, amplitude, wavelength]);

  const handleRecord = () => {
    onAddObservation({
      frequency: `${frequency} Hz`,
      amplitude: `${amplitude} cm`,
      wavelength: `${wavelength.toFixed(2)} m`,
      speed: `${mediumSpeed} m/s`,
      period: `${(period * 1000).toFixed(2)} ms`
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      <div className="flex-1 flex flex-col gap-6">
        {/* Oscilloscope Canvas */}
        <div className="card-brutal bg-white p-4">
          <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-charcoal">
            <span className="font-mono text-xs font-black uppercase text-charcoal">
              📺 Virtual Oscilloscope Display
            </span>
            <span className="font-mono text-xs font-bold text-brutalBlue">
              v = f × λ ({mediumSpeed} m/s)
            </span>
          </div>

          <div className="relative w-full aspect-[2.2/1] bg-cream border-3 border-charcoal overflow-hidden">
            <canvas ref={canvasRef} width={800} height={360} className="w-full h-full" />
          </div>
        </div>

        {/* Sliders */}
        <div className="card-brutal bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Sound Frequency (f)</span>
                <span className="text-brutalBlue">{frequency} Hz</span>
              </div>
              <input type="range" min="100" max="1000" step="25" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Wave Amplitude (A)</span>
                <span className="text-brutalRed">{amplitude} cm</span>
              </div>
              <input type="range" min="10" max="60" step="5" value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full accent-charcoal cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono text-xs font-bold">
                <span>Medium (Sound Speed)</span>
                <span>{mediumSpeed} m/s</span>
              </div>
              <select 
                value={mediumSpeed} 
                onChange={(e) => setMediumSpeed(Number(e.target.value))}
                className="w-full p-2 border-2 border-charcoal font-mono text-xs font-bold bg-cream"
              >
                <option value={340}>Air (340 m/s)</option>
                <option value={1480}>Water (1480 m/s)</option>
                <option value={5000}>Iron Conductor (5000 m/s)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="card-brutal bg-white p-6 space-y-4 font-mono text-xs flex-1">
          <h3 className="text-sm font-black uppercase text-charcoal border-b-2 border-charcoal pb-2">Wave Calculations</h3>

          <div className="p-3 bg-brutalYellow/30 border-2 border-charcoal flex justify-between items-center">
            <span>Wavelength λ = v/f</span>
            <span className="font-black text-sm text-charcoal">{wavelength.toFixed(2)} m</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Time Period T = 1/f</span>
            <span className="font-black text-sm text-brutalBlue">{(period * 1000).toFixed(2)} ms</span>
          </div>

          <div className="p-3 bg-cream border-2 border-charcoal flex justify-between items-center">
            <span>Wave Speed v = fλ</span>
            <span className="font-black text-sm text-brutalRed">{mediumSpeed} m/s</span>
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
