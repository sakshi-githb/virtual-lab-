import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  X, 
  Download, 
  Activity, 
  Zap, 
  Scale, 
  Compass, 
  FileJson 
} from 'lucide-react';

const AnalyticsModal = ({ isOpen, onClose, canvasRef }) => {
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    bodyCount: 0,
    totalMass: 0,
    kineticEnergy: 0,
    potentialEnergy: 0,
    totalEnergy: 0,
    rawBodiesList: []
  });
  const [isChartReady, setIsChartReady] = useState(false);

  // Delay chart render until modal transition completes, ensuring parent dimensions are non-zero
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsChartReady(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsChartReady(false);
    }
  }, [isOpen]);

  // Pull telemetry every 250ms when modal is active
  useEffect(() => {
    if (!isOpen) {
      setMetricsHistory([]);
      return;
    }

    const interval = setInterval(() => {
      if (canvasRef?.current) {
        const metrics = canvasRef.current.getSystemMetrics();
        if (metrics) {
          setCurrentMetrics(metrics);
          setMetricsHistory(prev => {
            const timeLabel = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
            const next = [...prev, {
              time: timeLabel,
              kinetic: metrics.kineticEnergy,
              potential: metrics.potentialEnergy,
              total: metrics.totalEnergy,
              bodies: metrics.rawBodiesList
            }];
            // Keep last 30 samples to prevent performance drag
            if (next.length > 30) return next.slice(1);
            return next;
          });
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, canvasRef]);

  if (!isOpen) return null;

  // Export full gathered history log to JSON
  const handleExportJSON = () => {
    const reportData = {
      project: "VIRTUAL-LAB 2D Physics Twin Simulation",
      exportedAt: new Date().toISOString(),
      summary: {
        totalObjects: currentMetrics.bodyCount,
        totalInvolvedMassKg: currentMetrics.totalMass,
        finalKineticEnergyJ: currentMetrics.kineticEnergy,
        finalPotentialEnergyJ: currentMetrics.potentialEnergy,
        finalSystemEnergyJ: currentMetrics.totalEnergy
      },
      timeSeriesLog: metricsHistory
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `virtual-lab-telemetry-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl bg-white border-4 border-charcoal shadow-brutal-xl relative flex flex-col max-h-[90vh] overflow-hidden rounded-none animate-in fade-in zoom-in-95 duration-100">
        
        {/* Modal Banner Header */}
        <div className="bg-brutalYellow border-b-4 border-charcoal p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-charcoal animate-pulse" />
            <h2 className="font-black text-xl uppercase tracking-tight text-charcoal">
              📊 System Telemetry & Conservation of Energy
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="border-3 border-charcoal bg-white p-1 hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-brutal-sm cursor-pointer"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1 bg-cream">
          
          {/* Card Deck: Live Numerical Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {/* Dynamic Bodies */}
            <div className="card-brutal bg-white p-3 flex flex-col gap-0.5 justify-center relative">
              <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40">Active Bodies</span>
              <span className="font-black text-2xl text-charcoal flex items-center gap-1.5 mt-1">
                <Compass className="w-5 h-5 text-brutalBlue" />
                {currentMetrics.bodyCount}
              </span>
            </div>
            
            {/* Total Mass */}
            <div className="card-brutal bg-white p-3 flex flex-col gap-0.5 justify-center relative">
              <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40">Total Mass</span>
              <span className="font-black text-2xl text-charcoal flex items-center gap-1.5 mt-1">
                <Scale className="w-5 h-5 text-neutral-600" />
                {currentMetrics.totalMass} <span className="text-xs font-bold font-mono">kg</span>
              </span>
            </div>

            {/* Kinetic Energy */}
            <div className="card-brutal bg-[#FFF5F5] border-brutalRed/50 p-3 flex flex-col gap-0.5 justify-center relative">
              <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40">Kinetic Energy</span>
              <span className="font-black text-2xl text-brutalRed flex items-center gap-1.5 mt-1">
                <Zap className="w-5 h-5 text-brutalRed" />
                {currentMetrics.kineticEnergy} <span className="text-xs font-bold font-mono">J</span>
              </span>
            </div>

            {/* Potential Energy */}
            <div className="card-brutal bg-[#F0F7FF] border-brutalBlue/50 p-3 flex flex-col gap-0.5 justify-center relative">
              <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40">Potential Energy</span>
              <span className="font-black text-2xl text-brutalBlue flex items-center gap-1.5 mt-1">
                <Activity className="w-5 h-5 text-brutalBlue" />
                {currentMetrics.potentialEnergy} <span className="text-xs font-bold font-mono">J</span>
              </span>
            </div>

            {/* Total Energy */}
            <div className="card-brutal bg-[#F2FFF9] border-brutalGreen/50 p-3 flex flex-col gap-0.5 justify-center col-span-2 md:col-span-1 relative">
              <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40">Total System Energy</span>
              <span className="font-black text-2xl text-brutalGreen flex items-center gap-1.5 mt-1">
                <Activity className="w-5 h-5 text-brutalGreen" />
                {currentMetrics.totalEnergy} <span className="text-xs font-bold font-mono">J</span>
              </span>
            </div>
          </div>

          {/* Conservation of Energy Graph Container */}
          <div className="card-brutal bg-white p-4 flex flex-col gap-2 relative min-h-[300px]">
            <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal/40 font-mono">Dynamic Wave telemetries</span>
                <h3 className="font-extrabold text-sm uppercase text-charcoal">System Conservation of Energy Graph</h3>
              </div>
              
              <div className="flex gap-4 text-[9px] font-mono font-bold">
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brutalRed inline-block border border-charcoal" /> Kinetic (Ek)</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brutalBlue inline-block border border-charcoal" /> Potential (Ep)</div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brutalGreen inline-block border border-charcoal" /> Total (Ek+Ep)</div>
              </div>
            </div>

            {!isChartReady || metricsHistory.length < 2 ? (
              <div className="h-[250px] w-full flex items-center justify-center font-mono text-xs font-bold text-charcoal/40">
                WAITING FOR SIMULATION RUN AND DYNAMIC TELEMETRY CHECKPOINTS...
              </div>
            ) : (
              <div className="h-[250px] w-full font-mono text-[9px] relative">
                <ResponsiveContainer width="99%" height={250}>
                  <AreaChart data={metricsHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKinetic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02}/>
                      </linearGradient>
                      <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="time" stroke="#1A1A1A" tickMargin={3} />
                    <YAxis stroke="#1A1A1A" tickMargin={3} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FDFBF7', 
                        border: '2px solid #1A1A1A', 
                        borderRadius: '0px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kinetic" 
                      stroke="#EF4444" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorKinetic)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="potential" 
                      stroke="#3B82F6" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorPotential)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      strokeDasharray="4 4"
                      fill="none" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Table list of individual bodies details */}
          <div className="card-brutal bg-white p-4 flex flex-col gap-2 relative">
            <h3 className="font-extrabold text-xs uppercase text-charcoal/80 text-left border-b border-charcoal/20 pb-1.5 mb-1">
              📋 Spatial telemetry metrics table
            </h3>
            
            {currentMetrics.rawBodiesList.length === 0 ? (
              <div className="py-4 font-mono text-[10px] text-charcoal/40 font-bold">
                NO ACTIVE DYNAMIC RIGID BODIES IN THE SYSTEM
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-charcoal bg-cream">
                      <th className="p-1.5 uppercase font-extrabold">Label</th>
                      <th className="p-1.5 uppercase font-extrabold">Position (X, Y)</th>
                      <th className="p-1.5 uppercase font-extrabold">Velocity (Vx, Vy)</th>
                      <th className="p-1.5 uppercase font-extrabold">Speed (m/s)</th>
                      <th className="p-1.5 uppercase font-extrabold">Mass (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMetrics.rawBodiesList.map((b, idx) => (
                      <tr key={idx} className="border-b border-dashed border-charcoal/20 hover:bg-neutral-50">
                        <td className="p-1.5 font-bold uppercase">{b.label}</td>
                        <td className="p-1.5">({b.x}, {b.y})</td>
                        <td className="p-1.5">({b.vx}, {b.vy})</td>
                        <td className="p-1.5 font-bold text-brutalRed">{b.speed}</td>
                        <td className="p-1.5">{b.mass}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-cream border-t-4 border-charcoal p-4 flex justify-between items-center flex-shrink-0">
          <span className="text-[10px] font-bold font-mono text-charcoal/60 uppercase">
            Double-Twin Kinematics Logger v1.0.0
          </span>
          <button
            onClick={handleExportJSON}
            className="btn-brutal bg-brutalGreen text-white text-[11px] py-1.5 px-3 flex items-center gap-1.5 uppercase font-extrabold tracking-wider"
          >
            <FileJson className="w-4 h-4" />
            <span>Export Telemetry Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
