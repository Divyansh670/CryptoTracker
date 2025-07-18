import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Eye, Briefcase, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Market', icon: TrendingUp },
    { path: '/watchlist', label: 'Watchlist', icon: Eye },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/charts', label: 'Charts', icon: BarChart3 }
  ];

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">CryptoTrack</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    location.pathname === path
                      ? 'bg-blue-900 text-blue-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <div className="flex space-x-1">
              {navItems.map(({ path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    location.pathname === path
                      ? 'bg-blue-900 text-blue-300'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;