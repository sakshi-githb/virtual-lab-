import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { usePhysicsLab } from '../../context/PhysicsLabContext';
import { Menu, X } from 'lucide-react';

export default function PhysicsLabLayout() {
  const { currentUser, logout } = usePhysicsLab();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-100 text-amber-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-navy-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/physicslab" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-[#1E3A5F] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <span className="font-bold text-xl text-[#1E3A5F]">Virtual Physics Lab</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-4 items-center">
              <NavLink to="/physicslab" end className={navLinkClasses}>Home</NavLink>
              <NavLink to="/physicslab/standard/9" className={navLinkClasses}>Standard 9</NavLink>
              <NavLink to="/physicslab/standard/10" className={navLinkClasses}>Standard 10</NavLink>
              
              {currentUser ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <Link 
                    to={currentUser.role === 'teacher' ? '/physicslab/teacher' : '/physicslab/dashboard'}
                    className="text-sm font-medium text-gray-700 hover:text-[#1E3A5F]"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="ml-4 pl-4 border-l border-gray-200">
                  <Link 
                    to="/physicslab/login"
                    className="px-4 py-2 bg-[#1E3A5F] text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>

            <div className="flex items-center md:hidden">
              <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none p-2">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/physicslab" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
              <Link to="/physicslab/standard/9" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Standard 9</Link>
              <Link to="/physicslab/standard/10" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Standard 10</Link>
              
              {currentUser ? (
                <>
                  <Link to={currentUser.role === 'teacher' ? '/physicslab/teacher' : '/physicslab/dashboard'} onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                  <button onClick={() => { logout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Logout</button>
                </>
              ) : (
                <Link to="/physicslab/login" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Maharashtra State Board Virtual Physics Laboratory.
        </div>
      </footer>
    </div>
  );
}
