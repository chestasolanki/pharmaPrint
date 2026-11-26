import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  subtitle, 
  icon: Icon, 
  color = 'emerald',
  badge
}) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-5 rounded-xl bg-slate-900/90 border ${scheme.border} ${scheme.glow} transition-all duration-300 hover:translate-y-[-2px] hover:border-opacity-50`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">{value}</span>
            {change && (
              <span className={`text-xs font-mono font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '↑' : '↓'} {change}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.border} border`}>
          <Icon className={`w-5 h-5 ${scheme.text}`} />
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
        <span>{subtitle}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
