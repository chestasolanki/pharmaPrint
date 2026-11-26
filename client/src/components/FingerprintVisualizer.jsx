import React, { useState, useMemo } from 'react';
import { Eye, Layers, Cpu, Database, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function FingerprintVisualizer({ 
  imageUrl, 
  similarityScore = 97.4, 
  packageId = 'PHARMA-9041',
  fingerprintId = 'FP-NC-9041-A',
  compact = false 
}) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'vector' | 'faiss'

  // Generate synthetic deterministic 128-dimensional embedding vector for display
  const embedding128 = useMemo(() => {
    const vec = [];
    let seed = 42;
    for (let i = 0; i < 128; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const val = (seed / 233280) * 2 - 1; // range -1.0 to 1.0
      vec.push(parseFloat(val.toFixed(3)));
    }
    return vec;
  }, [packageId]);

  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Siamese AI Biometric Pipeline</h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Fingerprint: <span className="text-emerald-400 font-bold">{fingerprintId}</span> (128-dim Float32)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'pipeline' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pipeline Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vector')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'vector' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            128-d Vector Heatmap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faiss')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'faiss' ? 'bg-slate-800 text-purple-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FAISS Cosine Space
          </button>
        </div>
      </div>

      {/* Tab 1: 4-Stage AI Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Stage 1: Physical Capture */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-slate-300 font-semibold">1. Capture</span>
              <span className="text-emerald-400">Raw</span>
            </div>
            <div className="aspect-square rounded-md overflow-hidden bg-slate-900 border border-slate-800 relative group">
              <img
                src={imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                alt="Raw packaging"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-mono bg-slate-950/90 text-emerald-300 px-2 py-0.5 rounded">
                  RGB 3-Channel
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Micro-surface texture & typography capture.
            </p>
          </div>

          {/* Stage 2: OpenCV Preprocessing */}
          <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
              <span className="font-semibold">2. Preprocessing</span>
              <span className="text-[10px]">OpenCV</span>
            </div>
            <div className="aspect-square rounded-md overflow-hidden bg-slate-900 border border-cyan-500/20 relative flex items-center justify-center p-2">
              {/* Simulated edge / grayscale representation */}
              <div 
                className="w-full h-full rounded border-2 border-dashed border-cyan-400/60 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 80%)'
                }}
              >
                <div className="w-16 h-12 border border-cyan-400/50 rounded flex flex-col items-center justify-center">
                  <div className="w-10 h-1 bg-cyan-400/40 rounded mb-1" />
                  <div className="w-8 h-1 bg-cyan-400/30 rounded" />
                </div>
                <div className="absolute top-1 left-1 text-[8px] font-mono text-cyan-400">ROI-EXTRACT</div>
                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-cyan-400">CLAHE EQ</div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Boundary crop, lighting CLAHE equalization & Laplacian blur filter.
            </p>
          </div>

          {/* Stage 3: Siamese CNN */}
          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span className="font-semibold">3. Siamese Twin CNN</span>
              <span className="text-[10px]">PyTorch</span>
            </div>
            <div className="aspect-square rounded-md overflow-hidden bg-slate-900 border border-emerald-500/20 p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span>Twin Conv4</span>
                <span className="text-emerald-400">Shared W</span>
              </div>
              
              {/* Mini neural network representation */}
              <div className="space-y-1 py-1">
                <div className="flex justify-around">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
                </div>
                <div className="w-full h-0.5 bg-emerald-500/30 my-1" />
                <div className="flex justify-around">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
                </div>
              </div>

              <div className="text-[9px] font-mono text-emerald-300 text-center bg-emerald-500/10 py-0.5 rounded border border-emerald-500/20">
                128-Dim Embedding
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Shared weights map micro-imperfections into non-invertible vector.
            </p>
          </div>

          {/* Stage 4: FAISS Cosine Index */}
          <div className="p-3 rounded-lg bg-slate-950 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
              <span className="font-semibold">4. FAISS Search</span>
              <span className="text-[10px]">IndexFlatIP</span>
            </div>
            <div className="aspect-square rounded-md overflow-hidden bg-slate-900 border border-purple-500/20 p-2.5 flex flex-col justify-between">
              <div className="text-[9px] font-mono text-slate-400 flex justify-between">
                <span>Top-1 Cosine:</span>
                <span className="text-emerald-400 font-bold">{similarityScore}%</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" 
                    style={{ width: `${Math.min(similarityScore, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                  <span>Threshold: 85%</span>
                  <span className="text-emerald-400 font-bold">MATCH</span>
                </div>
              </div>

              <div className="text-[9px] font-mono text-purple-300 text-center bg-purple-500/10 py-0.5 rounded border border-purple-500/20">
                Sub-ms Neighbor Search
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Cosine metric checks identity correlation & flags clones.
            </p>
          </div>

        </div>
      )}

      {/* Tab 2: 128-D Vector Projection */}
      {activeTab === 'vector' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Projection: 128 Float32 Neurons (Normalized L2 Norm = 1.0)</span>
            <span className="text-emerald-400">Vector Hash: sha256:{packageId.toLowerCase()}-v1.4</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 font-mono text-[9px]">
              {embedding128.map((val, idx) => {
                const isPositive = val >= 0;
                const intensity = Math.abs(val);
                return (
                  <div
                    key={idx}
                    title={`dim_${idx}: ${val}`}
                    className="h-6 rounded flex items-center justify-center transition-transform hover:scale-125 cursor-help"
                    style={{
                      backgroundColor: isPositive
                        ? `rgba(16, 185, 129, ${0.15 + intensity * 0.7})`
                        : `rgba(244, 63, 94, ${0.15 + intensity * 0.7})`,
                      color: intensity > 0.4 ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Each cell represents a latent spatial feature dimension learned by the twin CNN encoder. 
            Identical genuine boxes maintain high cosine alignment across varying ambient lighting.
          </p>
        </div>
      )}

      {/* Tab 3: FAISS Vector Space */}
      {activeTab === 'faiss' && (
        <div className="p-4 bg-slate-950 rounded-lg border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">FAISS Index Type: IndexFlatIP (Inner Product)</span>
            <span className="text-purple-400">Indexed Vectors: 14,280</span>
          </div>

          <div className="space-y-2">
            {[
              { id: packageId, name: 'Expected / Registered Fingerprint', score: similarityScore, isMatch: true },
              { id: 'PHARMA-8812', name: 'Amoxicillin Trihydrate 250mg', score: 38.2, isMatch: false },
              { id: 'PHARMA-6510', name: 'Remdesivir Lyophilized 100mg', score: 31.0, isMatch: false },
              { id: 'PHARMA-5421', name: 'Lipitor (Atorvastatin) 20mg', score: 24.5, isMatch: false },
            ].map((candidate, i) => (
              <div 
                key={candidate.id} 
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                  candidate.isMatch 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">#{i + 1}</span>
                  <span className="font-bold text-white font-mono">{candidate.id}</span>
                  <span className="text-slate-400 text-[11px]">• {candidate.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{candidate.score}% Sim</span>
                  {candidate.isMatch && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      TOP-1 WINNER
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
