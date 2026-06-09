import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  FolderOpen, 
  User, 
  Globe, 
  Sparkles,
  Activity
} from 'lucide-react';

const TopBar = ({ 
  isPlaying, 
  setIsPlaying, 
  onReset, 
  onSave, 
  onLoad,
  user,
  onOpenAuthModal,
  onOpenAnalytics,
  customRoomName = "Newton's Den",
  customOnlineHud = null
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-4 card-brutal bg-white py-3 px-5 mb-4 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="bg-brutalYellow border-3 border-charcoal p-1.5 shadow-brutal-sm font-bold flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl tracking-tight leading-none">VIRTUAL-LAB</h1>
          <span className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest leading-none">
            Collaborative Physics Sandbox
          </span>
        </div>
      </div>

      {/* Multiplayer Room HUD */}
      <div className="flex items-center gap-3 bg-brutalYellow/10 border-3 border-charcoal px-3 py-1.5 shadow-brutal-sm">
        <Globe className="w-5 h-5 text-charcoal animate-spin" style={{ animationDuration: '8s' }} />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-charcoal/50 uppercase leading-none">Active Room</span>
          <span className="font-bold text-xs">{customRoomName}</span>
        </div>
        {customOnlineHud ? (
          customOnlineHud
        ) : (
          <div className="flex items-center gap-1.5 bg-brutalGreen/20 text-emerald-800 border-2 border-charcoal px-2 py-0.5 text-xs font-bold rounded-none">
            <span className="w-2.5 h-2.5 bg-brutalGreen border border-charcoal rounded-full inline-block animate-ping" />
            <span>4 online</span>
          </div>
        )}
      </div>

      {/* Simulation Controls */}
      <div className="flex items-center gap-2 border-r-3 border-charcoal/20 pr-4">
        <button
          onClick={() => setIsPlaying(true)}
          className={`px-3 py-1.5 font-bold flex items-center gap-1.5 border-3 border-charcoal shadow-brutal-sm transition-all duration-100 ${
            isPlaying 
              ? 'bg-brutalGreen text-white translate-x-[1px] translate-y-[1px] shadow-none' 
              : 'bg-white hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-sm cursor-pointer'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Play</span>
        </button>

        <button
          onClick={() => setIsPlaying(false)}
          className={`px-3 py-1.5 font-bold flex items-center gap-1.5 border-3 border-charcoal shadow-brutal-sm transition-all duration-100 ${
            !isPlaying 
              ? 'bg-brutalYellow translate-x-[1px] translate-y-[1px] shadow-none' 
              : 'bg-white hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-sm cursor-pointer'
          }`}
        >
          <Pause className="w-4 h-4 fill-current" />
          <span>Pause</span>
        </button>

        <button
          onClick={onReset}
          className="btn-brutal px-3 py-1.5 bg-white text-xs hover:bg-neutral-100"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={onOpenAnalytics}
          className="btn-brutal px-3 py-1.5 bg-brutalGreen text-white text-xs hover:bg-emerald-600 flex items-center gap-1.5"
          title="Open System Analytics & Telemetry"
        >
          <Activity className="w-4 h-4" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Save / Load & User Auth Matrices */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="btn-brutal bg-white px-3 py-1.5 text-sm"
            title="Save sandbox to Cloud"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onLoad}
            className="btn-brutal bg-white px-3 py-1.5 text-sm"
            title="Load sandboxes"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Load</span>
          </button>
        </div>

        {/* User Badge */}
        {user ? (
          <div className="flex items-center gap-2 border-3 border-charcoal p-1 bg-white pr-3 hover:-translate-y-[1px] hover:shadow-brutal-sm transition-all shadow-none">
            <div className="w-8 h-8 bg-brutalBlue text-white font-bold flex items-center justify-center border-2 border-charcoal select-none">
              {user.name.slice(0,2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold text-charcoal/50 uppercase leading-none">Lab Member</span>
              <span className="font-bold text-xs">{user.name}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="btn-brutal-yellow px-4 py-1.5 flex items-center gap-2 text-sm"
          >
            <User className="w-4 h-4" />
            <span>Join Class / Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
