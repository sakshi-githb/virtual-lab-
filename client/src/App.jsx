import React, { useState, useRef, useEffect } from 'react';
import PhysicsCanvas from './components/canvas/PhysicsCanvas';
import LeftToolbar from './components/panels/LeftToolbar';
import TopBar from './components/panels/TopBar';
import RightInspector from './components/panels/RightInspector';
import BottomPanel from './components/panels/BottomPanel';
import NotebookPanel from './components/panels/NotebookPanel';
import Portal from './components/auth/Portal';
import AuthModal from './components/auth/AuthModal';
import AIProf from './components/panels/AIProf';
import AnalyticsModal from './components/panels/AnalyticsModal';
import LibraryModal from './components/panels/LibraryModal';
import { useSocket } from './context/SocketContext';
import { 
  Save, 
  AlertCircle, 
  LogOut, 
  Menu, 
  Brain, 
  X 
} from 'lucide-react';

function App() {
  const canvasRef = useRef(null);
  
  // Consume Socket.io Collaboration Hooks
  const { 
    roomCode, 
    createRoom, 
    joinRoom, 
    leaveRoom,
    isHost,
    users: socketUsers,
    syncPhysicsState,
    sendPhysicsAction
  } = useSocket();

  // Platform Page Routing & Workspace Config
  const [currentPage, setCurrentPage] = useState('portal'); // 'portal' | 'workspace'
  const [labMode, setLabMode] = useState('solo'); // 'solo' | 'collaborative'
  
  // Responsive Drawer States for Mobile Viewports
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  // Mobile optimization states
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(window.innerWidth >= 1024);

  // App States
  const [selectedTool, setSelectedTool] = useState('select');
  const [activeColor, setActiveColor] = useState('#FACC15'); // default brutalYellow
  const [selectedBody, setSelectedBody] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePreset, setActivePreset] = useState('none');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check if opened on mobile/tablet to display warning popup
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowMobileWarning(true);
    }
  }, []);

  // Trigger physics loops when play state updates
  useEffect(() => {
    if (currentPage === 'workspace' && canvasRef.current) {
      canvasRef.current.setRunning(isPlaying);
    }
  }, [isPlaying, currentPage]);

  // Close side drawers when screen resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLeftOpen(false);
        setIsRightOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dispatch toast alerts
  const showNotification = (text, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Portal Entrance Configuration
  const handleEnterWorkspace = ({ user: authUser, labMode: chosenMode, roomToJoin }) => {
    setUser(authUser);
    setLabMode(chosenMode);
    
    if (chosenMode === 'collaborative') {
      if (roomToJoin && roomToJoin.trim()) {
        joinRoom(roomToJoin, authUser.name);
      } else {
        createRoom(authUser.name);
      }
    } else {
      setCurrentPage('workspace');
      showNotification(`Workspace active. Welcome ${authUser.name}!`, 'success');
    }
  };

  const handleLogout = () => {
    if (labMode === 'collaborative') {
      leaveRoom();
    }
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('portal');
    setSelectedBody(null);
    showNotification('Logged out of experiment chamber.', 'success');
  };

  // Sync route transition when room is joined
  useEffect(() => {
    if (labMode === 'collaborative' && roomCode) {
      setCurrentPage('workspace');
      showNotification(`Entered classroom room: ${roomCode}`, 'success');
    }
  }, [roomCode, labMode]);

  // Shape spawner delegation
  const handleSpawnShape = (shapeType) => {
    if (!canvasRef.current) return;
    
    const dropX = 350 + Math.random() * 100;
    const dropY = 120 + Math.random() * 60;

    setActivePreset('none');

    if (shapeType === 'circle') {
      canvasRef.current.spawnCircle(dropX, dropY, 30);
      showNotification('Spawned circular rigid body', 'success');
    } else if (shapeType === 'box') {
      canvasRef.current.spawnBox(dropX, dropY, 60, 60);
      showNotification('Spawned rectangle block', 'success');
    } else if (shapeType === 'polygon') {
      canvasRef.current.spawnPolygon(dropX, dropY, 5, 38);
      showNotification('Spawned pentagon shape', 'success');
    }
    
    setSelectedTool('select');
    // Auto close left drawer on mobile after spawning to clear viewport
    setIsLeftOpen(false);
  };

  // Rigid Body Presets
  const handleSpawnPreset = (presetType) => {
    if (!canvasRef.current) return;

    // Auto-clear the world first to present a clean, unconfusing setup for the selected experiment
    canvasRef.current.resetWorld();
    setIsPlaying(true);
    setActivePreset(presetType);

    if (presetType === 'pendulum') {
      canvasRef.current.spawnPendulum(400, 80);
      canvasRef.current.setGravity(1.0); // Standard Earth gravity
      showNotification('Suspended pendulum rig injected', 'success');
    } else if (presetType === 'spring') {
      canvasRef.current.spawnSpringBlock(450, 200);
      canvasRef.current.setGravity(0.0); // Zero-gravity for horizontal spring oscillation
      showNotification('Oscillating spring block anchored (Zero-G)', 'success');
    } else if (presetType === 'friction') {
      canvasRef.current.spawnFrictionSlope();
      canvasRef.current.setGravity(1.0); // Standard Earth gravity
      showNotification('Inclined friction slope ramp injected', 'success');
    } else if (presetType === 'bounciness') {
      canvasRef.current.spawnBouncingComparison();
      canvasRef.current.setGravity(1.0); // Standard Earth gravity
      showNotification('Elastic vs Inelastic collision spheres injected', 'success');
    } else if (presetType === 'projectile') {
      canvasRef.current.spawnProjectileMotion();
      canvasRef.current.setGravity(1.0);
      showNotification('Projectile cannon and target basket loaded', 'success');
    } else if (presetType === 'catapult') {
      canvasRef.current.spawnCatapult();
      canvasRef.current.setGravity(1.0);
      showNotification('Counterweight lever catapult loaded', 'success');
    } else if (presetType === 'bridge') {
      canvasRef.current.spawnBridge();
      canvasRef.current.setGravity(1.0);
      showNotification('Suspension plank bridge deck loaded', 'success');
    }

    setSelectedTool('select');
    // Auto close left drawer on mobile
    setIsLeftOpen(false);
  };

  const handleUpdateProperty = (key, value) => {
    if (canvasRef.current) {
      canvasRef.current.updateSelectedBodyProperty(key, value);
    }
  };

  const handleReset = () => {
    if (canvasRef.current) {
      canvasRef.current.resetWorld();
      setIsPlaying(true);
      setActivePreset('none');
      showNotification('Cleared sandbox rigid bodies', 'success');
    }
  };

  const handleSave = async () => {
    if (!user || user.role === 'guest') {
      showNotification('Guest notebooks are archived locally. Register a premium account to sync in the cloud MongoDB cluster!', 'error');
      return;
    }

    if (!canvasRef.current) return;

    const title = window.prompt("Enter a title for your physics experiment layout:", "My Physics Rig");
    if (!title || !title.trim()) {
      return; // cancelled or empty
    }

    const serialized = canvasRef.current.serializeWorld();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/experiments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          gravityY: serialized.gravityY,
          bodies: serialized.bodies,
          constraints: serialized.constraints
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save experiment layout');
      }

      showNotification(`Layout "${title.trim()}" successfully saved to cloud MongoDB!`, 'success');
    } catch (error) {
      console.error(error);
      showNotification(error.message, 'error');
    }
  };

  const handleLoad = () => {
    if (!user || user.role === 'guest') {
      showNotification('Guests can load cached sessions only. Log in for database cloud fetching.', 'error');
      return;
    }
    setIsLibraryOpen(true);
  };

  const handleLoadExperiment = (experiment) => {
    if (canvasRef.current && experiment) {
      setActivePreset('none');
      canvasRef.current.deserializeWorld(experiment.bodies, experiment.gravityY, false, experiment.constraints);
      showNotification(`Loaded layout: "${experiment.title}"`, 'success');
      setIsLibraryOpen(false);
    }
  };

  // Render Portal if on landing page
  if (currentPage === 'portal') {
    return <Portal onEnterWorkspace={handleEnterWorkspace} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col p-2 md:p-4 bg-cream overflow-hidden dashboard-lock relative font-sans select-none">
      {/* Toast Notifications */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`border-3 border-charcoal px-4 py-2 text-xs font-mono font-bold shadow-brutal flex items-center gap-2 pointer-events-auto animate-in slide-in-from-right-10 ${
              n.type === 'error' ? 'bg-brutalRed text-white' : 'bg-brutalGreen text-white'
            }`}
          >
            {n.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{n.text}</span>
          </div>
        ))}
      </div>

      {/* Top Header Command Bar */}
      <div className="flex gap-4 mb-4 select-none flex-shrink-0">
        <div className="flex-1 min-w-0">
          <TopBar
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onReset={handleReset}
            onSave={handleSave}
            onLoad={handleLoad}
            user={user}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            customRoomName={labMode === 'solo' ? 'Personal Lab' : (roomCode ? `Room: ${roomCode}` : "Newton's Den")}
            customOnlineHud={
              labMode === 'solo' ? (
                <div className="flex items-center gap-1.5 bg-neutral-200 text-charcoal border-2 border-charcoal px-2 py-0.5 text-xs font-bold rounded-none">
                  <span className="w-2.5 h-2.5 bg-charcoal border border-charcoal rounded-full inline-block" />
                  <span>Offline / Local</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-brutalGreen/20 text-emerald-800 border-2 border-charcoal px-2 py-0.5 text-xs font-bold rounded-none">
                  <span className="w-2.5 h-2.5 bg-brutalGreen border border-charcoal rounded-full inline-block animate-pulse" />
                  <span>{socketUsers.length} online</span>
                </div>
              )
            }
            isAIOpen={isAIOpen}
            onToggleAI={() => setIsAIOpen(!isAIOpen)}
            isGuideOpen={isGuideOpen}
            onToggleGuide={() => setIsGuideOpen(!isGuideOpen)}
          />
        </div>
        
        {/* Change Mode Portal Exit Button */}
        <button
          onClick={handleLogout}
          className="btn-brutal bg-white px-4 hover:bg-neutral-100 flex items-center gap-2 font-bold font-mono text-sm self-stretch"
          title="Return to Portal / Logout"
        >
          <LogOut className="w-4 h-4 text-charcoal" />
          <span className="hidden sm:inline">Exit Lab</span>
        </button>
      </div>

      {/* Main Sandbox Layout Area (Viewport height locked, flex-1 min-h-0 to allow proper scaling without scrollbars) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 relative overflow-hidden flex-shrink-0">
        
        {/* Drawer Backdrop Overlay (Mobile/Tablet only) */}
        {(isLeftOpen || isRightOpen) && (
          <div 
            onClick={() => { setIsLeftOpen(false); setIsRightOpen(false); }}
            className="lg:hidden absolute inset-0 bg-charcoal/30 z-30 transition-opacity backdrop-blur-xs cursor-pointer"
          />
        )}

        {/* COLUMN 1: LEFT TOOLBAR SIDEBAR (Runs full height) */}
        <div className={`
          flex-shrink-0 z-40 transition-transform duration-200 ease-out h-full
          fixed lg:static top-0 left-0 w-72 bg-cream lg:bg-transparent p-4 lg:p-0 border-r-3 lg:border-r-0 border-charcoal lg:border-none shadow-brutal lg:shadow-none
          ${isLeftOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <LeftToolbar
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            onSpawnShape={handleSpawnShape}
            onSpawnPreset={handleSpawnPreset}
          />
        </div>

        {/* COLUMN 2: CENTER SIMULATION COLUMN (Canvas + Bottom panel directly underneath) */}
        <div className="flex-1 min-w-0 h-full flex flex-col gap-4">
          
          {/* Main Physics Canvas (Stretches fluidly to fill all upper vertical space) */}
          <div className="flex-1 min-h-0 relative">
            
            {/* MOBILE TOGGLE: Left Toolbar Menu Trigger */}
            <button
              onClick={() => { setIsLeftOpen(!isLeftOpen); setIsRightOpen(false); }}
              className="lg:hidden absolute top-4 left-4 z-20 bg-brutalYellow border-3 border-charcoal p-2 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
              title="Open Tools Dock"
            >
              {isLeftOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* MOBILE TOGGLE: Right Inspector Trigger */}
            <button
              onClick={() => { setIsRightOpen(!isRightOpen); setIsLeftOpen(false); }}
              className="lg:hidden absolute top-4 right-4 z-20 bg-brutalBlue text-white border-3 border-charcoal p-2 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
              title="Open Inspector"
            >
              {isRightOpen ? <X className="w-5 h-5" /> : <Brain className="w-5 h-5 fill-current" />}
            </button>

            <PhysicsCanvas
              ref={canvasRef}
              onSelectBody={setSelectedBody}
              activeTool={selectedTool}
              activeColor={activeColor}
            />
          </div>

          {/* Bottom Panel (Lobby / Chat Room) - Locked directly underneath canvas only in collaborative mode */}
          {labMode === 'collaborative' && (
            isChatOpen ? (
              <div className="flex-shrink-0 h-48 flex flex-col">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="lg:hidden text-left bg-brutalBlue text-white border-3 border-charcoal px-3 py-1 font-extrabold text-[10px] uppercase tracking-wider mb-2 flex items-center justify-between shadow-brutal-sm cursor-pointer"
                >
                  <span>💬 Collaborative Chat & Players ({socketUsers.length})</span>
                  <span>[Hide Chat]</span>
                </button>
                <div className="flex-1 min-h-0">
                  <BottomPanel />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="lg:hidden flex-shrink-0 text-left bg-brutalBlue text-white border-3 border-charcoal px-3 py-2 font-extrabold text-xs uppercase tracking-wider flex items-center justify-between shadow-brutal-sm cursor-pointer"
              >
                <span>💬 Show Chat & Players ({socketUsers.length})</span>
                <span className="bg-white text-charcoal border-2 border-charcoal px-2 py-0.5 text-[9px] rounded-none">OPEN</span>
              </button>
            )
          )}
        </div>

        {/* COLUMN 3: RIGHT SIDEBAR COLUMN (Inspector, runs full height) */}
        <div className={`
          flex-shrink-0 z-40 transition-transform duration-200 ease-out h-full
          fixed lg:static top-0 right-0 w-80 bg-cream lg:bg-transparent p-4 lg:p-0 border-l-3 lg:border-l-0 border-charcoal lg:border-none shadow-brutal lg:shadow-none
          ${isRightOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
            <RightInspector
              selectedBody={selectedBody}
              onUpdateProperty={handleUpdateProperty}
            />
          </div>
        </div>

        {/* Floating AI Professor Widget */}
        {isAIOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-160px)]">
            <AIProf 
              selectedBody={selectedBody} 
              activePreset={activePreset}
              isPlaying={isPlaying}
              onClose={() => setIsAIOpen(false)}
            />
          </div>
        )}

        {/* Floating Lab Guide Widget */}
        {isGuideOpen && (
          <div className="fixed bottom-6 left-28 z-50 w-80 md:w-96 h-[480px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-160px)]">
            <NotebookPanel 
              onSpawnPreset={handleSpawnPreset} 
              onClose={() => setIsGuideOpen(false)}
            />
          </div>
        )}

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={(authUser) => {
            setUser(authUser);
            showNotification(`Welcome ${authUser.name}!`, 'success');
          }} 
        />
        <AnalyticsModal
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          canvasRef={canvasRef}
        />
        <LibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          onLoad={handleLoadExperiment}
          showNotification={showNotification}
        />

        {/* Mobile Warning Popup */}
        {showMobileWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs select-none animate-in fade-in duration-100">
            <div className="w-full max-w-sm bg-white border-4 border-charcoal shadow-brutal-xl p-6 relative flex flex-col gap-4 text-left rounded-none animate-in zoom-in-95 duration-100">
              <div className="bg-brutalYellow text-charcoal border-3 border-charcoal p-3 shadow-brutal-sm font-black text-sm uppercase tracking-wider text-center">
                ⚠️ Responsiveness Notice
              </div>
              <p className="font-mono text-xs text-charcoal leading-relaxed font-bold">
                VIRTUAL-LAB is optimized for desktop environments due to its complex physics modeler, side panels, and canvas drag gestures.
              </p>
              <p className="font-mono text-[11px] text-charcoal/80 leading-relaxed">
                We are actively working on mobile responsiveness. The physics sandbox has been maximized below for your workspace.
              </p>
              <button
                onClick={() => setShowMobileWarning(false)}
                className="btn-brutal bg-brutalGreen text-white text-xs py-2.5 font-black uppercase tracking-wider mt-2 hover:bg-emerald-600 cursor-pointer"
              >
                Got it, let's explore!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
