import React, { useState } from 'react';
import { X, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'register' | 'guest'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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

    // Guest Authentication
    if (activeMode === 'guest') {
      if (!formData.name.trim()) {
        setErrorMsg('Please specify a screen name.');
        return;
      }
      // Bubble guest context upwards
      onAuthSuccess({
        name: formData.name,
        role: 'guest'
      });
      onClose();
      return;
    }

    // Registered Member Authentication
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Please enter credentials.');
      return;
    }
    
    if (activeMode === 'register' && !formData.name.trim()) {
      setErrorMsg('Name is required to register.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const endpoint = activeMode === 'register' 
        ? `${API_URL}/api/auth/register` 
        : `${API_URL}/api/auth/login`;
      const bodyPayload = activeMode === 'register'
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

      onAuthSuccess({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'member'
      });
      onClose();
    } catch (error) {
      setErrorMsg(error.message || 'Server connection error');
    }
  };


  return (
    <div className="fixed inset-0 bg-charcoal/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div 
        className="w-full max-w-md bg-cream border-5 border-charcoal shadow-brutal-xl relative p-6 animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border-3 border-charcoal bg-white flex items-center justify-center font-bold shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Banner */}
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-brutalYellow border-3 border-charcoal p-1 font-bold">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="font-extrabold text-xl tracking-tight uppercase">Enter The Lab Room</h2>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-mono mb-5">
          <button
            onClick={() => { setActiveMode('login'); setErrorMsg(''); }}
            className={`border-3 border-charcoal py-2 transition-all ${
              activeMode === 'login' ? 'bg-brutalBlue text-white shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveMode('register'); setErrorMsg(''); }}
            className={`border-3 border-charcoal py-2 transition-all ${
              activeMode === 'register' ? 'bg-brutalGreen text-white shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setActiveMode('guest'); setErrorMsg(''); }}
            className={`border-3 border-charcoal py-2 transition-all ${
              activeMode === 'guest' ? 'bg-brutalYellow shadow-brutal-sm translate-x-[1px] translate-y-[1px]' : 'bg-white hover:-translate-y-[1px] shadow-none cursor-pointer'
            }`}
          >
            Guest Pass
          </button>
        </div>

        {/* Warning Messages */}
        {errorMsg && (
          <div className="border-3 border-charcoal bg-brutalRed/15 text-red-900 px-3 py-2 text-xs font-mono font-bold flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          {activeMode === 'guest' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold uppercase tracking-wide">Screen Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. IsaacNewton"
                className="w-full border-3 border-charcoal bg-white px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-brutalYellow"
                required
              />
              <span className="text-[10px] font-bold text-charcoal/50 leading-tight">
                * Guest mode provides sandbox editing & multiplayer access, but does not backing up files to server database.
              </span>
            </div>
          )}

          {activeMode !== 'guest' && (
            <>
              {activeMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-extrabold uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sam Smith"
                    className="w-full border-3 border-charcoal bg-white px-3 py-2 font-bold focus:outline-none"
                    required
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@university.edu"
                  className="w-full border-3 border-charcoal bg-white px-3 py-2 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full border-3 border-charcoal bg-white px-3 py-2 font-bold focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full btn-brutal-yellow font-extrabold text-sm py-2.5 uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-5 h-5" />
            <span>Enter Sandbox</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
