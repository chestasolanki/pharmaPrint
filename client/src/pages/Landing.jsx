import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scan, 
  Cpu, 
  Database, 
  Layers, 
  Activity, 
  Zap, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  ArrowRight, 
  Globe2, 
  Lock,
  Sparkles,
  Microscope,
  FileCheck
} from 'lucide-react';
import FingerprintVisualizer from '../components/FingerprintVisualizer';

export default function Landing() {
  const [demoState, setDemoState] = useState('genuine'); // 'genuine' | 'clone' | 'counterfeit'

  const demoScenarios = {
    genuine: {
      name: 'Paracetamol 500mg (Authentic)',
      packageId: 'PHARMA-9041',
      batch: 'NC-26B-991',
      similarity: 98.4,
      verdict: 'REAL / AUTHENTIC MEDICINE',
      verdictColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Physical micro-surface texture matches cryptographic 128d vector registered by NovaCare at manufacture. Safe to consume.',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      icon: CheckCircle2,
      geoStatus: 'Single Valid Supply Chain Transit Node (New Delhi, India)'
    },
    clone: {
      name: 'Ozempic 1mg Pen (Cloned Label)',
      packageId: 'PHARMA-7734',
      batch: 'NH-SEM-502',
      similarity: 95.2,
      verdict: 'POTENTIAL IDENTITY REUSE (CLONE ALERT)',
      verdictColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'High visual match, but Haversine velocity engine detected impossible physical travel (Delhi to Mumbai in 30 mins = 2,296 km/h).',
      image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
      icon: AlertTriangle,
      geoStatus: 'CRITICAL: Teleportation Velocity Anomaly Flagged'
    },
    counterfeit: {
      name: 'Remdesivir 100mg (Counterfeit Ring)',
      packageId: 'PHARMA-UNREG-41',
      batch: 'FAKE-RDV-09',
      similarity: 62.1,
      verdict: 'FAKE / COUNTERFEIT DETECTED',
      verdictColor: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
      description: 'Defect pattern reveals distorted micro-logo, substandard blister foil, and misaligned typography. Unsafe.',
      image: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=600&auto=format&fit=crop&q=80',
      icon: XCircle,
      geoStatus: 'Counterfeit Defect Signature Identified Across Transit Hubs'
    }
  };

  const activeDemo = demoScenarios[demoState];
  const VerdictIcon = activeDemo.icon;

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Ambient Glow Backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6 shadow-glow-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Physical Medicine Verification Platform</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Siamese CNN + FAISS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
            Instant Fake or Real{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Medicine Identification
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Every physical medicine package holds an unforgeable microscopic fingerprint born from unique printing plate jitter and paper fiber patterns. PharmaPrint analyzes packaging biometrics to tell you instantly if a medicine is genuine or fake.
          </p>

          {/* CTA Button Group */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <Scan className="w-4 h-4" />
              <span>Open Identification Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/verify"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Microscope className="w-4 h-4 text-cyan-400" />
              <span>Direct Camera Scanner</span>
            </Link>

            <Link
              to="/register-medicine"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Register Genuine Package</span>
            </Link>
          </div>

          {/* Live System Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-emerald-400">128-Dim</div>
              <div className="text-xs text-slate-400 mt-1">Twin CNN Embedding</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-cyan-400">&lt; 0.42 ms</div>
              <div className="text-xs text-slate-400 mt-1">FAISS Vector Search</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-rose-400">Real-Time</div>
              <div className="text-xs text-slate-400 mt-1">Fake & Clone Detection</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-amber-400">99.4%</div>
              <div className="text-xs text-slate-400 mt-1">System Accuracy</div>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE LIVE DEMO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              • Interactive Verification Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Try the Fake vs Real Detection Simulation
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Authenticity is never based on barcode numbers alone. Select a scenario below to see how PharmaPrint’s Siamese neural engine cross-examines physical packaging.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
            <button
              onClick={() => setDemoState('genuine')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                demoState === 'genuine'
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald scale-105'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Scenario 1: Authentic Medicine</span>
            </button>

            <button
              onClick={() => setDemoState('clone')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                demoState === 'clone'
                  ? 'bg-rose-500 text-white shadow-glow-rose scale-105'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Scenario 2: Cloned Identifier (Geo Anomaly)</span>
            </button>

            <button
              onClick={() => setDemoState('counterfeit')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                demoState === 'counterfeit'
                  ? 'bg-rose-600 text-white shadow-glow-rose scale-105'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Scenario 3: Fake / Counterfeit Package</span>
            </button>
          </div>

          {/* Live Simulator Preview Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Package Snapshot + Verdict Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video sm:aspect-4/3 group">
                <img
                  src={activeDemo.image}
                  alt={activeDemo.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Visual scan reticle */}
                <div className="absolute inset-4 border border-emerald-400/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400">
                    <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      ID: {activeDemo.packageId}
                    </span>
                    <span className="animate-pulse">● SENSOR LOCKED</span>
                  </div>
                  <div className="text-[10px] font-mono text-center text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                    Batch: {activeDemo.batch}
                  </div>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className={`p-4 rounded-xl border ${activeDemo.verdictColor} space-y-2`}>
                <div className="flex items-center gap-2">
                  <VerdictIcon className="w-5 h-5 shrink-0" />
                  <span className="font-bold font-mono text-sm tracking-wide">
                    {activeDemo.verdict}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDemo.description}
                </p>
                <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono flex items-center justify-between">
                  <span className="text-slate-400">Cosine Match:</span>
                  <span className="font-bold text-white text-sm">{activeDemo.similarity}%</span>
                </div>
              </div>
            </div>

            {/* Right: AI Pipeline Deep-Dive for this package */}
            <div className="lg:col-span-7">
              <FingerprintVisualizer
                imageUrl={activeDemo.image}
                similarityScore={activeDemo.similarity}
                packageId={activeDemo.packageId}
                fingerprintId={`FP-${activeDemo.packageId}`}
              />
            </div>

          </div>

        </div>
      </section>

      {/* 3 STEPS TO IDENTIFY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How Fake Medicine Identification Works
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            3 simple steps from camera capture to instant safety verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
              1
            </div>
            <h4 className="text-base font-bold text-white">Capture or Upload Package</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use your device camera or upload a photo of the medicine box, blister seal, or bottle label.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
              2
            </div>
            <h4 className="text-base font-bold text-white">AI Vision Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              OpenCV normalizes the image, and our Siamese CNN encoder maps the micro-texture to a 128-dimensional embedding.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">
              3
            </div>
            <h4 className="text-base font-bold text-white">Instant Real vs Fake Verdict</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an immediate score and clear verdict: Real Authentic Medicine or Fake Counterfeit.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 shadow-glow-emerald">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Verify Your Medicine Now
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate counterfeit medication risks and protect patient lives with AI-powered physical package biometrics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-glow-emerald transition-all"
            >
              Open Medicine Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
