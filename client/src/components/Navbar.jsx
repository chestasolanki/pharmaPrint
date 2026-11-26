import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scan, 
  PackagePlus, 
  History, 
  LayoutDashboard,
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Identify Medicine', path: '/verify', icon: Scan, highlight: true },
    { label: 'Register Medicine', path: '/register-medicine', icon: PackagePlus },
    { label: 'Scan History', path: '/scans', icon: History },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-glow-emerald transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    PharmaPrint
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AI Detector
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                  Fake vs Real Medicine Identification
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Widget */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* AI Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px]">AI Vision: Online</span>
            </div>

            {/* Quick Scan Call to Action */}
            <Link
              to="/verify"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-emerald"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scan Medicine</span>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800">
            <Link
              to="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-emerald"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Medicine Now</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
