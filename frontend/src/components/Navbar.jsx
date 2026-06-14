import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const firstname = localStorage.getItem('firstname') || 'Member';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login';
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <nav className="glass-nav fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-ngo-950 border border-ngo-800 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Heart className="text-ngo-500 fill-ngo-500" size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                NayePankh <span className="text-ngo-500">Connect</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            {!isDashboard && (
              <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hidden md:block">
                About Us
              </a>
            )}
            {!isDashboard && (
              <a href="#programs" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hidden md:block">
                Our Programs
              </a>
            )}

            {token ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/volunteer-dashboard'}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-700/80 hover:border-slate-600 bg-slate-900/50 text-slate-200 rounded-xl transition-all hover:bg-slate-800 text-sm font-medium shadow-sm shadow-black/10"
                >
                  {role === 'ROLE_ADMIN' ? <Shield size={16} className="text-gold-500 animate-pulse" /> : <LayoutDashboard size={16} className="text-ngo-500" />}
                  <span>{firstname}'s Portal</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-950 hover:bg-red-950/50 text-red-400 hover:text-red-300 rounded-xl transition-all text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {!isAuthPage && (
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium text-sm">
                    Login
                  </Link>
                )}
                <Link 
                  to="/login?tab=register"
                  className="btn-gradient px-5 py-2.5 rounded-xl text-sm shadow-ngo-600/30"
                >
                  Become a Volunteer
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
