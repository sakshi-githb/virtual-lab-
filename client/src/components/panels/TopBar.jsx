import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  FolderOpen, 
  User, 
  Globe, 
  Sparkles,
  Activity,
  Brain,
  BookOpen,
  Menu,
  X
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
  customOnlineHud = null,
  isAIOpen,
  onToggleAI,
  isGuideOpen,
  onToggleGuide
}) => {
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col mb-4 select-none">
      {/* HEADER ROW */}
      <div className="w-full flex items-center justify-between card-brutal bg-white p-2.5 md:py-3 md:px-5">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <div className="bg-brutalYellow border-3 border-charcoal p-1.5 shadow-brutal-sm font-bold flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-xl tracking-tight leading-none text-charcoal">VIRTUAL-LAB</h1>
            <span className="hidden xs:inline text-[9px] sm:text-[10px] font-bold text-charcoal/50 uppercase tracking-widest leading-none">
              Physics Sandbox
            </span>
          </div>
        </div>

        {/* Desktop Multiplayer Room HUD (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-2.5 bg-brutalYellow/10 border-3 border-charcoal px-2.5 py-1.5 shadow-brutal-sm">
          <Globe className="w-5 h-5 text-charcoal animate-spin" style={{ animationDuration: '8s' }} />
          <div className="flex flex-col text-left">
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

        {/* Simulation Shortcuts (Play/Pause/Reset - Always Visible for fast usage) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(true)}
            className={`px-2.5 py-1.5 font-bold flex items-center gap-1 border-3 border-charcoal shadow-brutal-sm transition-all duration-100 ${
              isPlaying 
                ? 'bg-brutalGreen text-white translate-x-[1px] translate-y-[1px] shadow-none' 
                : 'bg-white hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-sm cursor-pointer'
            }`}
            title="Play Simulation"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline text-xs">Play</span>
          </button>

          <button
            onClick={() => setIsPlaying(false)}
            className={`px-2.5 py-1.5 font-bold flex items-center gap-1 border-3 border-charcoal shadow-brutal-sm transition-all duration-100 ${
              !isPlaying 
                ? 'bg-brutalYellow translate-x-[1px] translate-y-[1px] shadow-none' 
                : 'bg-white hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal-sm cursor-pointer'
            }`}
            title="Pause Simulation"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline text-xs">Pause</span>
          </button>

          <button
            onClick={onReset}
            className="btn-brutal px-2.5 py-1.5 bg-white text-xs hover:bg-neutral-100"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Reset</span>
          </button>

          {/* Mobile Menu Toggle button */}
          <button
            onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
            className={`lg:hidden border-3 border-charcoal p-1.5 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer transition-colors ${
              isMobileControlsOpen ? 'bg-brutalYellow' : 'bg-white'
            }`}
            title="Toggle Controls Menu"
          >
            {isMobileControlsOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenAnalytics}
            className="btn-brutal px-2.5 py-1.5 bg-brutalGreen text-white text-xs hover:bg-emerald-600 flex items-center gap-1"
            title="Open System Analytics"
          >
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-extrabold">Analytics</span>
          </button>

          <button
            onClick={onToggleAI}
            className={`btn-brutal px-2.5 py-1.5 text-xs flex items-center gap-1 transition-all duration-100 ${
              isAIOpen 
                ? 'bg-brutalBlue text-white hover:bg-blue-600' 
                : 'bg-white hover:bg-neutral-100'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-extrabold">AI Prof</span>
          </button>

          <button
            onClick={onToggleGuide}
            className={`btn-brutal px-2.5 py-1.5 text-xs flex items-center gap-1 transition-all duration-100 ${
              isGuideOpen 
                ? 'bg-brutalYellow text-charcoal hover:bg-yellow-300' 
                : 'bg-white hover:bg-neutral-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-extrabold">Lab Guide</span>
          </button>

          <div className="w-px h-6 bg-charcoal/20 mx-1" />

          <button
            onClick={onSave}
            className="btn-brutal bg-white px-2.5 py-1.5 text-xs"
            title="Save Layout"
          >
            <Save className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-extrabold">Save</span>
          </button>
          
          <button
            onClick={onLoad}
            className="btn-brutal bg-white px-2.5 py-1.5 text-xs"
            title="Load Layout"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-extrabold">Load</span>
          </button>

          <div className="w-px h-6 bg-charcoal/20 mx-1" />

          {user ? (
            <div className="flex items-center gap-2 border-3 border-charcoal p-0.5 bg-white pr-2 hover:-translate-y-[1px] hover:shadow-brutal-sm transition-all shadow-none">
              <div className="w-7 h-7 bg-brutalBlue text-white font-bold flex items-center justify-center border-2 border-charcoal text-[11px]">
                {user.name.slice(0,2).toUpperCase()}
              </div>
              <span className="font-bold text-[11px]">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-brutal bg-brutalYellow px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>

      </div>

      {/* MOBILE CONTROLS ACCORDION PANEL (Only visible on Mobile when toggled) */}
      {isMobileControlsOpen && (
        <div className="lg:hidden w-full card-brutal bg-cream border-t-0 p-4 flex flex-col gap-3.5 shadow-brutal-sm animate-in slide-in-from-top-4 duration-150">
          
          {/* Active Room Info */}
          <div className="flex items-center justify-between bg-white border-3 border-charcoal p-2.5 shadow-brutal-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-charcoal animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-charcoal/50 uppercase leading-none">Class Room</span>
                <span className="font-extrabold text-[11px] leading-tight">{customRoomName}</span>
              </div>
            </div>
            {customOnlineHud ? (
              customOnlineHud
            ) : (
              <div className="flex items-center gap-1.5 bg-brutalGreen/20 text-emerald-800 border-2 border-charcoal px-2 py-0.5 text-[10px] font-bold rounded-none">
                <span className="w-2.5 h-2.5 bg-brutalGreen border border-charcoal rounded-full inline-block animate-ping" />
                <span>4 online</span>
              </div>
            )}
          </div>

          {/* Quick Spawn Buttons grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { onOpenAnalytics(); setIsMobileControlsOpen(false); }}
              className="btn-brutal py-2 bg-brutalGreen text-white text-[10px] flex flex-col items-center justify-center gap-1 uppercase font-black"
            >
              <Activity className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => { onToggleAI(); setIsMobileControlsOpen(false); }}
              className={`btn-brutal py-2 text-[10px] flex flex-col items-center justify-center gap-1 uppercase font-black ${
                isAIOpen ? 'bg-brutalBlue text-white' : 'bg-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>AI Prof</span>
            </button>

            <button
              onClick={() => { onToggleGuide(); setIsMobileControlsOpen(false); }}
              className={`btn-brutal py-2 text-[10px] flex flex-col items-center justify-center gap-1 uppercase font-black ${
                isGuideOpen ? 'bg-brutalYellow text-charcoal' : 'bg-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lab Guide</span>
            </button>
          </div>

          <div className="h-px bg-charcoal/20 my-0.5" />

          {/* Save & Load & Login Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onSave(); setIsMobileControlsOpen(false); }}
              className="btn-brutal bg-white py-2 flex-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <Save className="w-4 h-4" />
              <span>Save Layout</span>
            </button>

            <button
              onClick={() => { onLoad(); setIsMobileControlsOpen(false); }}
              className="btn-brutal bg-white py-2 flex-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Load Layout</span>
            </button>
          </div>

          {/* User Authentication Row */}
          {user ? (
            <div className="flex items-center justify-between border-3 border-charcoal p-2 bg-white shadow-brutal-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brutalBlue text-white font-bold flex items-center justify-center border-2 border-charcoal text-xs">
                  {user.name.slice(0,2).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-charcoal/50 uppercase leading-none">Logged In</span>
                  <span className="font-bold text-xs">{user.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuthModal(); setIsMobileControlsOpen(false); }}
              className="btn-brutal bg-brutalYellow py-2.5 w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider"
            >
              <User className="w-4 h-4" />
              <span>Join Classroom / Login</span>
            </button>
          )}

        </div>
      )}
    </div>
  );
};

export default TopBar;
