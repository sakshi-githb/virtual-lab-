import React, { useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  Settings, 
  TrendingUp, 
  Zap, 
  Move,
  Hash,
  PenTool
} from 'lucide-react';

const RightInspector = ({ selectedBody, onUpdateProperty }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [velocityHistory, setVelocityHistory] = useState([]);
  
  // Ref to throttle state updates for the charts
  const lastGraphUpdateRef = useRef(0);
  const bodyIdRef = useRef(null);

  useEffect(() => {
    if (!selectedBody) {
      setVelocityHistory([]);
      bodyIdRef.current = null;
      return;
    }

    // Reset history if user selected a different body
    if (bodyIdRef.current !== selectedBody.id) {
      bodyIdRef.current = selectedBody.id;
      setVelocityHistory([]);
    }

    const now = Date.now();
    // Throttle graph points to 150ms intervals
    if (now - lastGraphUpdateRef.current > 150) {
      const vx = parseFloat(selectedBody.velocity.x) || 0;
      const vy = parseFloat(selectedBody.velocity.y) || 0;
      const speed = Math.sqrt(vx * vx + vy * vy);

      setVelocityHistory(prev => {
        const next = [...prev, { 
          time: new Date().toLocaleTimeString([], { second: '2-digit' }), 
          speed: parseFloat(speed.toFixed(2)) 
        }];
        // Keep last 15 ticks of history
        if (next.length > 15) {
          return next.slice(1);
        }
        return next;
      });
      
      lastGraphUpdateRef.current = now;
    }
  }, [selectedBody]);

  if (!selectedBody) {
    return (
      <div className="w-80 h-full card-brutal bg-white flex flex-col justify-center items-center text-center p-6 select-none relative pt-10">
        <div className="absolute top-0 left-0 bg-brutalRed text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          🚨 Inspector
        </div>
        <div className="w-14 h-14 bg-cream border-3 border-charcoal rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Settings className="w-6 h-6 text-charcoal/40" />
        </div>
        <h3 className="font-bold text-sm mb-1 uppercase tracking-wide">Inspector Closed</h3>
        <p className="text-xs text-charcoal/60 leading-tight">
          Click or grab any rigid shape inside the sandbox grid to inspect its physics metrics.
        </p>
      </div>
    );
  }

  // Calculate dynamic scientific parameters
  const massVal = parseFloat(selectedBody.mass);
  const gravityForce = (massVal * 9.8).toFixed(1);
  const speedVal = Math.sqrt(
    selectedBody.velocity.x * selectedBody.velocity.x + 
    selectedBody.velocity.y * selectedBody.velocity.y
  );
  const netForce = (massVal * (speedVal > 0.1 ? 2.4 : 0)).toFixed(1);

  return (
    <div className="flex flex-col gap-4 flex-shrink-0">
      
      {/* INSPECTOR ATTRIBUTES CARD */}
      <div className="card-brutal bg-white flex flex-col gap-3 relative pt-10">
        {/* Mockup Red Banner Header */}
        <div className="absolute top-0 left-0 bg-brutalRed text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          🚨 Inspector
        </div>

        {/* Selected Shape label */}
        <div className="flex items-center justify-between border-b-2 border-charcoal pb-2 mt-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <input
              type="text"
              value={selectedBody.labelName}
              onChange={(e) => onUpdateProperty('labelName', e.target.value)}
              className="font-extrabold text-sm bg-transparent border-b-2 border-transparent hover:border-charcoal focus:border-charcoal focus:outline-none w-full font-sans uppercase truncate"
            />
            <PenTool className="w-3.5 h-3.5 text-charcoal/30 flex-shrink-0" />
          </div>
          <span className="text-[9px] font-mono bg-charcoal text-white px-2 py-0.5 font-bold uppercase flex-shrink-0">
            {selectedBody.shapeType}
          </span>
        </div>

        {/* Properties / Motion Tab Matrix */}
        <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold font-mono">
          <button
            onClick={() => setActiveTab('properties')}
            className={`border-2 border-charcoal py-1 transition-all uppercase ${
              activeTab === 'properties' ? 'bg-brutalYellow shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('motion')}
            className={`border-2 border-charcoal py-1 transition-all uppercase ${
              activeTab === 'motion' ? 'bg-brutalYellow shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Motion
          </button>
          <button
            onClick={() => setActiveTab('forces')}
            className={`border-2 border-charcoal py-1 transition-all uppercase ${
              activeTab === 'forces' ? 'bg-brutalYellow shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Forces
          </button>
        </div>

        {/* Tab Selection Switch */}
        {activeTab === 'properties' ? (
          <div className="flex flex-col gap-3 mt-1.5 text-xs">
            {/* Mass */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-bold">
                <span>Mass</span>
                <span className="font-mono text-[10px]">{selectedBody.mass} kg</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                value={selectedBody.mass}
                onChange={(e) => onUpdateProperty('mass', e.target.value)}
                className="w-full h-1.5 bg-cream border-2 border-charcoal rounded-none appearance-none cursor-pointer accent-charcoal animate-none"
              />
            </div>

            {/* Friction */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-bold">
                <span>Friction</span>
                <span className="font-mono text-[10px]">{selectedBody.friction}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={selectedBody.friction}
                onChange={(e) => onUpdateProperty('friction', e.target.value)}
                className="w-full h-1.5 bg-cream border-2 border-charcoal rounded-none appearance-none cursor-pointer accent-charcoal"
              />
            </div>

            {/* Restitution */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-bold">
                <span>Restitution</span>
                <span className="font-mono text-[10px]">{selectedBody.restitution}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={selectedBody.restitution}
                onChange={(e) => onUpdateProperty('restitution', e.target.value)}
                className="w-full h-1.5 bg-cream border-2 border-charcoal rounded-none appearance-none cursor-pointer accent-charcoal"
              />
            </div>
          </div>
        ) : activeTab === 'motion' ? (
          <div className="flex flex-col gap-2 mt-1.5 text-xs font-bold font-mono">
            <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-1">
              <span className="text-charcoal/50 flex items-center gap-1"><Hash className="w-3.5 h-3.5" />Density:</span>
              <span>{selectedBody.density} kg/m²</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-1">
              <span className="text-charcoal/50 flex items-center gap-1"><Move className="w-3.5 h-3.5" />Position:</span>
              <span>x: {selectedBody.position.x} y: {selectedBody.position.y}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/50 flex items-center gap-1"><Zap className="w-3.5 h-3.5" />Velocity:</span>
              <span className="text-brutalRed">x: {selectedBody.velocity.x} y: {selectedBody.velocity.y}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-1.5 text-xs font-bold font-mono">
            <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-1">
              <span className="text-charcoal/50">Gravity:</span>
              <span>{gravityForce} N ↓</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-charcoal/20 pb-1">
              <span className="text-charcoal/50">Spring Force:</span>
              <span>0.0 N</span>
            </div>
            <div className="flex justify-between text-brutalBlue">
              <span>Net Force:</span>
              <span>{netForce} N</span>
            </div>
          </div>
        )}

        {/* Freeze Toggles */}
        <div className="flex items-center justify-between border-t border-dashed border-charcoal/30 pt-2.5">
          <span className="font-bold text-xs uppercase">Freeze Shape</span>
          <button
            onClick={() => onUpdateProperty('static', !selectedBody.isStatic)}
            className={`w-10 h-5 border-2 border-charcoal flex items-center transition-all ${
              selectedBody.isStatic ? 'bg-brutalGreen justify-end' : 'bg-neutral-200 justify-start'
            }`}
          >
            <span className="w-3.5 h-3.5 bg-white border-2 border-charcoal mx-0.5 inline-block" />
          </button>
        </div>
      </div>

      {/* VELOCITY REAL-TIME CHART CARD */}
      <div className="card-brutal bg-white p-3 flex flex-col gap-2 relative pt-10 h-44">
        {/* Mockup Green Banner Header */}
        <div className="absolute top-0 left-0 bg-brutalGreen text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          📈 Velocity
        </div>
        
        {velocityHistory.length < 2 ? (
          <div className="h-full flex items-center justify-center text-center text-[10px] font-bold text-charcoal/40 font-mono mt-1">
            WAITING FOR KINEMATICS DATA...
          </div>
        ) : (
          <div className="h-full w-full font-mono text-[8px] -ml-6 mt-1 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={velocityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="time" stroke="#1A1A1A" tickMargin={3} />
                <YAxis stroke="#1A1A1A" tickMargin={3} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FDFBF7', 
                    border: '2px solid #1A1A1A', 
                    borderRadius: '0px',
                    fontWeight: 'bold',
                    fontSize: '9px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10B981" // brutalGreen line
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* FORCES SCIENTIFIC FIELD VECTOR CARD */}
      <div className="card-brutal bg-white p-3 flex flex-col gap-2 relative pt-10">
        {/* Mockup Blue Banner Header */}
        <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          🧬 Forces
        </div>
        <div className="flex flex-col gap-1.5 text-[10px] font-mono font-bold mt-1 text-left">
          <div className="flex justify-between items-center text-charcoal/70 bg-cream p-1.5 border border-charcoal/20">
            <span>GRAVITY FORCE (mg):</span>
            <span className="text-brutalRed">{gravityForce} N ↓</span>
          </div>
          <div className="flex justify-between items-center text-charcoal/75 bg-cream p-1.5 border border-charcoal/20">
            <span>SPRING CONSTANT (kx):</span>
            <span className="text-brutalBlue">0.0 N →</span>
          </div>
          <div className="flex justify-between items-center bg-charcoal text-white p-1.5">
            <span>TOTAL SUM VECTOR (Fnet):</span>
            <span className="text-brutalYellow">{netForce} N</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightInspector;
