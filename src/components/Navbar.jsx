import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sprout, LogOut, User, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Predictions', path: '/prediction' },
    { name: 'Market', path: '/market' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'About', path: '/about' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-surface-200 py-2 shadow-soft' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary-200">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-surface-900">
                Farm<span className="text-primary-600">Bora</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100' 
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-surface-500 hover:text-primary-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-surface-200 mx-2"></div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-bold text-surface-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-surface-500 font-medium">Pro Farmer</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-200">
                {user.name?.charAt(0) || <User className="h-5 w-5" />}
              </div>
              <button
                onClick={logout}
                className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-surface-600 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-surface-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    block px-4 py-3 rounded-xl text-base font-bold transition-all
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t border-surface-100">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
