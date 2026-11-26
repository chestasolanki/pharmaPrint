import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Building, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Dr. Sarah Connor',
    email: 'sarah@globalhealth.org',
    organization: 'Global Health Dispensary Alliance',
    licenseNumber: 'PHA-REG-2026-99',
    role: 'Pharmacist',
    password: 'password123'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password, formData.role);
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
            Register Stakeholder Organization
          </h2>
          <p className="text-xs text-slate-400">
            Join the decentralized pharmaceutical verification node network.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Organization / Hospital / Facility</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Regulatory License / DEA / FDA Number</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                required
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Stakeholder Tier</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Pharmacist">Community & Hospital Pharmacist</option>
                <option value="Manufacturer">Authorized Manufacturer</option>
                <option value="Distributor">Cold-Chain Freight Distributor</option>
                <option value="Admin">Regulatory Investigator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 transition-all mt-4"
            >
              <span>Submit Organization Enrollment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
