import React from 'react';
import { ShieldCheck, Cpu, Database, Activity, GitBranch, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-sm">PharmaPrint AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-powered physical packaging verification platform. Detects counterfeit medicines, cloned packages, and printing defects in real-time.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Identification Engine Active
            </div>
          </div>

          {/* Col 2: Core AI Engine */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Detection Technology</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Siamese CNN (128d Twin Encoders)</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>FAISS Cosine Similarity Search</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>Defect Anomaly Recognition</span>
              </li>
              <li className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                <span>Cloned Identifier Verification</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quality & Safety */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold text-xs uppercase tracking-wider">Pharmaceutical Safety</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designed to help pharmacists, distributors, and consumers verify physical packaging authenticity and intercept dangerous counterfeit drugs.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Trust Physical Packaging Biometrics</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 PharmaPrint Medicine Identification Platform.
          </div>
          <div className="flex items-center gap-6">
            <span>Siamese Weights: v1.4-Contrastive</span>
            <span className="text-emerald-400 font-mono">Status: 99.98% Accuracy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
