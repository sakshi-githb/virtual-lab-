import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Users, 
  ChevronRight, 
  Compass,
  BookOpen
} from 'lucide-react';

const Portal = ({ onEnterWorkspace }) => {
  const [labMode, setLabMode] = useState('solo'); // 'solo' | 'collaborative'
  const [authMethod, setAuthMethod] = useState('guest'); // 'guest' | 'login' | 'register'
  const [roomToJoin, setRoomToJoin] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
 
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
 
    // Guest Auth
    if (authMethod === 'guest') {
      if (!formData.name.trim()) {
        setErrorMsg('Please specify a screen name.');
        return;
      }
      onEnterWorkspace({
        user: { name: formData.name, role: 'guest' },
        labMode,
        roomToJoin
      });
      return;
    }
 
    // Registered Member Auth
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Please enter credentials.');
      return;
    }
    
    if (authMethod === 'register' && !formData.name.trim()) {
      setErrorMsg('Name is required to register.');
      return;
    }
 
    try {
      const endpoint = authMethod === 'register' ? '/api/auth/register' : '/api/auth/login';
      const bodyPayload = authMethod === 'register'
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };
 
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
 
      // Save token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
 
      onEnterWorkspace({
        user: { 
          id: data.user.id,
          name: data.user.name, 
          email: data.user.email,
          role: 'member' 
        },
        labMode,
        roomToJoin
      });
    } catch (error) {
      setErrorMsg(error.message || 'Server connection error');
    }
  };



  return (
    <div className="w-screen min-h-screen bg-cream flex items-center justify-center font-sans p-4 sm:p-6 select-none relative overflow-y-auto">
      {/* CSS Dotted Grid Backdrop */}
      <div className="absolute inset-0 opacity-15 pointer-events-none notebook-grid z-0" />
      
      {/* Heavy Geometric Central Block */}
      <div className="w-full max-w-5xl bg-white border-4 border-charcoal shadow-brutal-xl flex flex-col md:flex-row relative z-10 overflow-hidden rounded-none">
        
        {/* LEFT COLUMN: Editorial Bauhaus Poster */}
        <div className="w-full md:w-1/2 bg-brutalYellow border-b-4 md:border-b-0 md:border-r-4 border-charcoal p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden min-h-[350px] md:min-h-[500px]">
          {/* Grid lines inside yellow banner */}
          <div className="absolute inset-0 opacity-5 pointer-events-none notebook-grid" />

          {/* Header Title Banner */}
          <div className="flex items-center gap-3 z-10">
            <div className="bg-white border-3 border-charcoal p-2 shadow-brutal-sm font-bold flex items-center justify-center">
              <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <span className="font-extrabold text-2xl tracking-wider">VIRTUAL-LAB</span>
          </div>

          {/* Slogan Card */}
          <div className="flex flex-col gap-6 z-10 mt-12 md:mt-0">
            <div className="bg-white border-4 border-charcoal p-4 max-w-xs shadow-brutal-lg">
              <span className="text-xs font-mono font-bold uppercase text-charcoal/50 tracking-widest">
                Digital Twin Sandbox
              </span>
              <h1 className="font-black text-4xl mt-1 leading-none uppercase tracking-tight">
                Bring Formulas <br/>To Life.
              </h1>
            </div>
            <p className="text-charcoal/80 font-bold max-w-sm text-sm leading-snug">
              A collaborative 2D physics sandbox designed to help engineers and students visually interact with motion, forces, vectors, and digital constraints.
            </p>
          </div>

          {/* Footer stats banner */}
          <div className="flex justify-between items-end z-10 border-t-3 border-charcoal pt-4 mt-8 md:mt-0">
            <div className="flex flex-col">
              <span className="font-extrabold text-[10px] text-charcoal/40 uppercase">Framework Version</span>
              <span className="font-bold text-xs">v1.2.0 (Stable)</span>
            </div>
            <div className="bg-charcoal text-brutalYellow font-mono text-[9px] font-extrabold px-3 py-1.5 uppercase">
              Designed for education
            </div>
          </div>

          {/* Large Geometric Shapes */}
          <div className="absolute bottom-20 right-[-60px] w-72 h-72 rounded-full border-5 border-charcoal bg-brutalBlue opacity-40 transform translate-y-12" />
          <div className="absolute top-1/4 right-10 w-32 h-32 border-5 border-charcoal bg-brutalRed opacity-30 transform -rotate-12" />
        </div>

        {/* RIGHT COLUMN: Interactive Workspace Setup Form */}
        <div className="w-full md:w-1/2 p-6 lg:p-10 flex flex-col justify-center bg-white min-h-[480px]">
          <div className="border-b-3 border-charcoal pb-4 mb-5">
            <h2 className="font-black text-2xl uppercase tracking-tight">Configure Your Workspace</h2>
            <p className="text-xs text-charcoal/60 mt-1 leading-tight">
              Select your simulation framework and log in to begin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* STEP 1: Select Lab Mode */}
            <div className="flex flex-col gap-2.5">
              <span className="font-extrabold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                1. Select Lab Framework
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Solo Lab Card */}
                <button
                  type="button"
                  onClick={() => setLabMode('solo')}
                  className={`text-left p-3.5 border-3 border-charcoal flex flex-col gap-1 transition-all ${
                    labMode === 'solo'
                      ? 'bg-brutalBlue/10 border-brutalBlue shadow-brutal-sm translate-x-[2px] translate-y-[2px] ring-2 ring-charcoal'
                      : 'bg-white hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs uppercase">Solo Sandbox</span>
                    <User className={`w-4 h-4 ${labMode === 'solo' ? 'text-brutalBlue' : 'text-charcoal'}`} />
                  </div>
                  <p className="text-[10px] text-charcoal/60 leading-tight mt-1">
                    Personal sandboxing and offline laboratory notebook logs.
                  </p>
                </button>

                {/* Collaborative Classroom Card */}
                <button
                  type="button"
                  onClick={() => setLabMode('collaborative')}
                  className={`text-left p-3.5 border-3 border-charcoal flex flex-col gap-1 transition-all ${
                    labMode === 'collaborative'
                      ? 'bg-brutalGreen/10 border-brutalGreen shadow-brutal-sm translate-x-[2px] translate-y-[2px] ring-2 ring-charcoal'
                      : 'bg-white hover:-translate-y-0.5 hover:shadow-brutal cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs uppercase">Classroom</span>
                    <Users className={`w-4 h-4 ${labMode === 'collaborative' ? 'text-brutalGreen' : 'text-charcoal'}`} />
                  </div>
                  <p className="text-[10px] text-charcoal/60 leading-tight mt-1">
                    Real-time collaborative room and team chat lobby.
                  </p>
                </button>
              </div>
            </div>

            {/* STEP 2: Access Gateway Credentials Option */}
            <div className="flex flex-col gap-3.5 border-t-2 border-charcoal pt-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-xs uppercase tracking-wide">
                  2. Choose Access Token
                </span>
                
                {/* Method Swapper */}
                <div className="flex gap-1.5 text-[9px] font-mono font-bold bg-cream border-2 border-charcoal p-0.5">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('guest'); setErrorMsg(''); }}
                    className={`px-2 py-0.5 ${authMethod === 'guest' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/10 cursor-pointer'}`}
                  >
                    Guest
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('login'); setErrorMsg(''); }}
                    className={`px-2 py-0.5 ${authMethod === 'login' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/10 cursor-pointer'}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('register'); setErrorMsg(''); }}
                    className={`px-2 py-0.5 ${authMethod === 'register' ? 'bg-charcoal text-white' : 'hover:bg-charcoal/10 cursor-pointer'}`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Form Input Matrix */}
              <div className="flex flex-col gap-2.5">
                {authMethod === 'guest' ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-charcoal/60">Choose Screen Nickname</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Einstein123"
                      className="border-3 border-charcoal px-3 py-1.5 bg-cream font-bold text-xs focus:outline-none focus:bg-white"
                      required
                    />
                  </div>
                ) : (
                  <>
                    {authMethod === 'register' && (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-charcoal/60">Your Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Sam Smith"
                          className="border-3 border-charcoal px-3 py-1.5 bg-cream font-bold text-xs focus:outline-none focus:bg-white"
                          required
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-charcoal/60">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@university.edu"
                        className="border-3 border-charcoal px-3 py-1.5 bg-cream font-bold text-xs focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-charcoal/60">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="border-3 border-charcoal px-3 py-1.5 bg-cream font-bold text-xs focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                  </>
                )}
                {labMode === 'collaborative' && (
                  <div className="flex flex-col gap-1 border-t-2 border-dashed border-charcoal/20 pt-2.5 mt-2">
                    <label className="text-[10px] font-bold uppercase text-charcoal/60">Classroom Code (Optional)</label>
                    <input
                      type="text"
                      value={roomToJoin}
                      onChange={(e) => setRoomToJoin(e.target.value.toUpperCase())}
                      placeholder="e.g. ABC123 (Leave blank to Host)"
                      className="border-3 border-charcoal px-3 py-1.5 bg-cream font-bold text-xs focus:outline-none focus:bg-white uppercase"
                    />
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="border-2 border-charcoal bg-brutalRed/15 text-brutalRed font-mono font-bold text-[10px] p-2 text-center uppercase">
                {errorMsg}
              </div>
            )}

            {/* Launch Button */}
            <button
              type="submit"
              className="btn-brutal-yellow font-black text-xs uppercase py-2.5 tracking-widest mt-1 flex items-center justify-center gap-2"
            >
              <span>Initialize Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Portal;
