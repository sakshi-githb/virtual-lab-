import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { usePhysicsLab } from '../../context/PhysicsLabContext';
import { Menu, X } from 'lucide-react';

export default function PhysicsLabLayout() {
  const { currentUser, logout } = usePhysicsLab();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-1.5 font-mono text-xs font-black uppercase border-2 border-charcoal transition-all ${
      isActive
        ? 'bg-brutalYellow text-charcoal shadow-brutal-sm translate-x-[1px] translate-y-[1px]'
        : 'bg-white text-charcoal hover:bg-cream hover:-translate-y-0.5'
    }`;

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Neo-Brutalist Top Navigation Bar */}
      <header className="bg-white border-b-4 border-charcoal shadow-brutal-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="btn-brutal bg-cream text-xs py-1.5 px-3 uppercase font-black tracking-wider flex items-center gap-1.5 text-charcoal">
                <span>← Sandbox</span>
              </Link>
              <Link to="/physicslab" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-brutalYellow border-3 border-charcoal shadow-brutal-sm flex items-center justify-center font-black text-xl text-charcoal">
                  ⚡
                </div>
                <span className="font-black text-xl tracking-tight text-charcoal uppercase">
                  Physics Lab
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-3 items-center">
              <NavLink to="/physicslab" end className={navLinkClasses}>Home</NavLink>
              <NavLink to="/physicslab/standard/9" className={navLinkClasses}>Std 9</NavLink>
              <NavLink to="/physicslab/standard/10" className={navLinkClasses}>Std 10</NavLink>
              
              {currentUser ? (
                <div className="flex items-center gap-3 ml-3 pl-3 border-l-2 border-charcoal">
                  <Link 
                    to={currentUser.role === 'teacher' ? '/physicslab/teacher' : '/physicslab/dashboard'}
                    className="font-mono text-xs font-bold uppercase text-charcoal hover:underline"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="btn-brutal text-xs py-1 px-3 bg-cream font-mono uppercase"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="ml-3 pl-3 border-l-2 border-charcoal">
                  <Link 
                    to="/physicslab/login"
                    className="btn-brutal-yellow text-xs py-1.5 px-4 font-black uppercase tracking-wider"
                  >
                    Member Login
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={toggleMenu} 
                className="bg-brutalYellow border-3 border-charcoal p-1.5 shadow-brutal-sm cursor-pointer"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t-3 border-charcoal p-4 space-y-3">
            <Link to="/" onClick={toggleMenu} className="block btn-brutal bg-cream text-xs py-2 text-center font-bold uppercase">← Exit to Sandbox Workspace</Link>
            <Link to="/physicslab" onClick={toggleMenu} className="block btn-brutal bg-brutalYellow text-xs py-2 text-center font-bold uppercase">Home</Link>
            <Link to="/physicslab/standard/9" onClick={toggleMenu} className="block btn-brutal text-xs py-2 text-center font-bold uppercase">Standard 9</Link>
            <Link to="/physicslab/standard/10" onClick={toggleMenu} className="block btn-brutal text-xs py-2 text-center font-bold uppercase">Standard 10</Link>
            
            {currentUser ? (
              <>
                <Link to={currentUser.role === 'teacher' ? '/physicslab/teacher' : '/physicslab/dashboard'} onClick={toggleMenu} className="block btn-brutal text-xs py-2 text-center font-bold uppercase">Dashboard</Link>
                <button onClick={() => { logout(); toggleMenu(); }} className="block w-full btn-brutal text-xs py-2 text-center font-bold uppercase">Logout</button>
              </>
            ) : (
              <Link to="/physicslab/login" onClick={toggleMenu} className="block btn-brutal-yellow text-xs py-2 text-center font-bold uppercase">Login</Link>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet Workspace */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t-4 border-charcoal py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-mono text-xs font-bold text-charcoal">
          ⚡ Maharashtra State Board Virtual Physics Laboratory — Designed for Education
        </div>
      </footer>
    </div>
  );
}
