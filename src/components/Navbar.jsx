import { Link } from 'react-router-dom';
import { Menu, X, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-700">FarmBora</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/prediction" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Predictions
            </Link>
            <Link to="/market" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Market
            </Link>
            <Link to="/alerts" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Alerts
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
              Settings
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/prediction"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Predictions
            </Link>
            <Link
              to="/market"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Market
            </Link>
            <Link
              to="/alerts"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Alerts
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/settings"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left bg-red-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
