import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export default function Login() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@pharmaprint.org');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoPersona = (roleKey) => {
    switchRole(roleKey);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-glow-emerald mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sign In to PharmaPrint
          </h2>
          <p className="text-xs text-slate-400">
            Access the biometric medicine registration & verification network.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Admin">Admin / Regulatory Forensic Agency</option>
                <option value="Pharmacist">Community & Hospital Pharmacist</option>
                <option value="Manufacturer">Authorized Pharmaceutical Manufacturer</option>
                <option value="Distributor">Cold-Chain Freight & Wholesale Distributor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Sparkles className="w-3 h-3" />
                1-Click Demo Personas:
              </span>
              <span>Instant Access</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DEMO_USERS).map(([key, u]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectDemoPersona(key)}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                >
                  <div className="text-[11px] font-semibold text-slate-200">{u.role}</div>
                  <div className="text-[9px] text-slate-400 truncate">{u.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Need an authorized account?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-medium">
            Register Organization
          </Link>
        </p>

      </div>
    </div>
  );
}
