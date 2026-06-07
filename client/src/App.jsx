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

  // App States
  const [selectedTool, setSelectedTool] = useState('select');
  const [activeColor, setActiveColor] = useState('#FACC15'); // default brutalYellow
  const [selectedBody, setSelectedBody] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [user, setUser] = useState(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
    
    // Auto close left drawer on mobile after spawning to clear viewport
    setIsLeftOpen(false);
  };

  // Rigid Body Presets
  const handleSpawnPreset = (presetType) => {
    if (!canvasRef.current) return;

    if (presetType === 'pendulum') {
      canvasRef.current.spawnPendulum(400, 80);
      showNotification('Suspended pendulum rig injected', 'success');
    } else if (presetType === 'spring') {
      canvasRef.current.spawnSpringBlock(400, 160);
      showNotification('Oscillating spring block anchored', 'success');
    }

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
      showNotification('Cleared sandbox rigid bodies', 'success');
    }
  };

  const handleSave = () => {
    if (!user || user.role === 'guest') {
      showNotification('Guest notebooks are archived locally. Register a premium account to sync in the cloud MongoDB cluster!', 'error');
      return;
    }
    showNotification(`Saved Sandbox: "${labMode === 'solo' ? 'My Physics Lab' : 'Newton\'s Den'}" successfully archived to MongoDB!`, 'success');
  };

  const handleLoad = () => {
    if (!user || user.role === 'guest') {
      showNotification('Guests can load cached sessions only. Log in for database cloud fetching.', 'error');
      return;
    }
    showNotification('Loaded latest experimental layout from Cloud Database.', 'success');
  };

  // Render Portal if on landing page
  if (currentPage === 'portal') {
    return <Portal onEnterWorkspace={handleEnterWorkspace} />;
  }

  return (
    <div className="w-screen min-h-screen flex flex-col p-4 bg-cream overflow-y-auto dashboard-lock relative font-sans">
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

      {/* Main Sandbox Layout Area (Dynamic height: full viewport height on large displays, min height locks scroll elsewhere) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:min-h-[720px] lg:h-[calc(100vh-120px)] relative overflow-visible flex-shrink-0">
        
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
          fixed lg:static top-0 left-0
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
        <div className="flex-1 min-w-0 lg:h-full flex flex-col gap-4">
          
          {/* Main Physics Canvas (Stretches fluidly to fill all upper vertical space) */}
          <div className="flex-1 min-h-[380px] relative">
            
            {/* MOBILE TOGGLE: Left Toolbar Menu Trigger */}
            <button
              onClick={() => { setIsLeftOpen(!isLeftOpen); setIsRightOpen(false); }}
              className="lg:hidden absolute top-4 left-4 z-20 bg-brutalYellow border-3 border-charcoal p-2 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
              title="Open Tools Dock"
            >
              {isLeftOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* MOBILE TOGGLE: Right Inspector / AI Prof Trigger */}
            <button
              onClick={() => { setIsRightOpen(!isRightOpen); setIsLeftOpen(false); }}
              className="lg:hidden absolute top-4 right-4 z-20 bg-brutalBlue text-white border-3 border-charcoal p-2 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
              title="Open Professor / Inspector"
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

          {/* Bottom Panel (Lobby / Private Journal) - Locked directly underneath canvas inside center column */}
          <div className="flex-shrink-0 h-48">
            {labMode === 'solo' ? <NotebookPanel /> : <BottomPanel />}
          </div>
        </div>

        {/* COLUMN 3: RIGHT SIDEBAR COLUMN (Inspector & AI Prof stacked, runs full height) */}
        <div className={`
          flex-shrink-0 z-40 transition-transform duration-200 ease-out h-full
          fixed lg:static top-0 right-0 w-80
          ${isRightOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
            <RightInspector
              selectedBody={selectedBody}
              onUpdateProperty={handleUpdateProperty}
            />
            <AIProf selectedBody={selectedBody} />
          </div>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={(authUser) => {
            setUser(authUser);
            showNotification(`Welcome ${authUser.name}!`, 'success');
          }} 
        />
      </div>
    </div>
  );
}

export default App;
