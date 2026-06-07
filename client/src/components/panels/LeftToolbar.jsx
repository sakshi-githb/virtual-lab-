import React from 'react';
import { 
  MousePointer, 
  Circle, 
  Square, 
  Pentagon, 
  Activity, 
  FolderPlus,
  Zap,
  Play
} from 'lucide-react';

const LeftToolbar = ({ 
  selectedTool, 
  setSelectedTool, 
  activeColor, 
  setActiveColor, 
  onSpawnShape, 
  onSpawnPreset 
}) => {
  const tools = [
    { id: 'select', name: 'Select / Grab', icon: MousePointer, isSelectOnly: true },
    { id: 'circle', name: 'Circle', icon: Circle, action: () => onSpawnShape('circle') },
    { id: 'box', name: 'Box', icon: Square, action: () => onSpawnShape('box') },
    { id: 'polygon', name: 'Polygon', icon: Pentagon, action: () => onSpawnShape('polygon') },
  ];

  const presets = [
    { id: 'pendulum', name: 'Pendulum', action: () => onSpawnPreset('pendulum') },
    { id: 'spring', name: 'Spring', action: () => onSpawnPreset('spring') },
  ];

  const colors = [
    { hex: '#FACC15', name: 'brutalYellow' },
    { hex: '#3B82F6', name: 'brutalBlue' },
    { hex: '#EF4444', name: 'brutalRed' },
    { hex: '#10B981', name: 'brutalGreen' },
  ];

  return (
    <div className="w-64 h-full flex flex-col gap-4 overflow-y-auto select-none pr-1">
      
      {/* TOOLS BLOCK (Flat Yellow Banner) */}
      <div className="card-brutal flex-shrink-0 flex flex-col gap-3 relative pt-10">
        {/* Mockup Style Banner Label */}
        <div className="absolute top-0 left-0 bg-brutalYellow text-charcoal border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          🛠️ Tools
        </div>

        {/* Color Palette Selector */}
        <div className="flex flex-col gap-1.5 mt-2 border-b-2 border-dashed border-charcoal/20 pb-3">
          <span className="font-extrabold text-[10px] text-charcoal/50 uppercase tracking-wider">Object Color</span>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-7 h-7 border-3 border-charcoal transition-transform duration-100 ${
                  activeColor === c.hex 
                    ? 'translate-x-[2px] translate-y-[2px] shadow-none ring-2 ring-charcoal' 
                    : 'hover:-translate-x-[1px] hover:-translate-y-[1px] shadow-brutal-sm cursor-pointer'
                }`}
                title={`Select ${c.name}`}
              />
            ))}
          </div>
        </div>

        {/* Tool Selectors */}
        <div className="flex flex-col gap-2">
          <span className="font-extrabold text-[10px] text-charcoal/50 uppercase tracking-wider">Spawn Rigid Bodies</span>
          {tools.map((t) => {
            const Icon = t.icon;
            const isToolSelected = selectedTool === t.id;
            
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTool(t.id);
                  if (t.action) t.action();
                }}
                className={`w-full text-left font-bold border-3 border-charcoal px-3 py-2 flex items-center justify-between transition-all duration-100 ${
                  isToolSelected 
                    ? 'bg-brutalYellow shadow-brutal-sm translate-x-[2px] translate-y-[2px]' 
                    : 'bg-white hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {t.id === 'circle' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-charcoal flex items-center justify-center bg-brutalBlue/20">
                      <Circle className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                  ) : t.id === 'box' ? (
                    <div className="w-5 h-5 border-2 border-charcoal flex items-center justify-center bg-brutalRed/20">
                      <Square className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                  ) : (
                    <Icon className="w-4 h-4 text-charcoal" />
                  )}
                  <span className="text-xs uppercase tracking-wide">{t.name}</span>
                </div>
                <span className="text-[8px] text-charcoal/40 font-mono font-bold uppercase">
                  {t.isSelectOnly ? 'SELECT' : 'SPAWN'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TEMPLATES BLOCK (Flat Blue Banner) */}
      <div className="card-brutal flex-shrink-0 flex flex-col gap-3 relative pt-10">
        {/* Mockup Style Banner Label */}
        <div className="absolute top-0 left-0 bg-brutalBlue text-white border-r-3 border-b-3 border-charcoal px-3 py-1 font-extrabold text-[11px] uppercase tracking-widest leading-none select-none">
          🔬 Templates
        </div>

        <div className="flex flex-col gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={p.action}
              className="btn-brutal text-[11px] py-2 bg-cream text-charcoal uppercase tracking-wider font-extrabold flex items-center gap-2"
            >
              {p.id === 'pendulum' ? <Activity className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span>{p.name}</span>
            </button>
          ))}
          
          <button className="border-3 border-dashed border-charcoal/30 bg-neutral-50 px-3 py-2 text-center text-[10px] font-bold text-charcoal/40 uppercase tracking-widest hover:border-charcoal hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1 cursor-pointer">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default LeftToolbar;
