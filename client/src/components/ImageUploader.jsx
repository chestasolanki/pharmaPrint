import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

const SAMPLE_TEST_IMAGES = [
  {
    name: 'Genuine Paracetamol 500mg',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    type: 'genuine',
    packageId: 'PHARMA-9041',
    description: 'Crisp micro-embossed batch seal & calibrated packaging font'
  },
  {
    name: 'Cloned Label Ozempic 1mg',
    url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
    type: 'clone',
    packageId: 'PHARMA-7734',
    description: 'Identical serial printed in Mumbai shortly after Delhi dispensary scan'
  },
  {
    name: 'Counterfeit Remdesivir (Distorted Logo)',
    url: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=600&auto=format&fit=crop&q=80',
    type: 'counterfeit',
    packageId: 'PHARMA-UNREG-41',
    description: 'Matches DBSCAN Cluster CF-804 defect signature'
  },
  {
    name: 'Amoxicillin 250mg Authentic',
    url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    type: 'genuine',
    packageId: 'PHARMA-8812',
    description: 'Calibrated foil grain with valid micro-optical pattern'
  }
];

export default function ImageUploader({ onImageSelected, currentImage, label = "Capture Medicine Package Image", simulateAutoInspect = true }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStats, setInspectionStats] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream when leaving camera mode
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
        setMode('camera');
      }
    } catch (err) {
      console.warn("Camera access not available, falling back to upload:", err);
      setCameraError("Camera permission denied or camera not found. Please upload an image or choose a demo sample below.");
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    setMode('upload');
    processImageSelection(dataUrl, 'Live Camera Capture');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processImageSelection(event.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processImageSelection(event.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const processImageSelection = (imageUrl, sourceName, sampleMeta = null) => {
    if (simulateAutoInspect) {
      setIsInspecting(true);
      // Simulate real-time OpenCV blur, lighting and ROI extraction calculation
      setTimeout(() => {
        const stats = {
          aspectRatio: '16:9 Standard Box ROI',
          lightingScore: Math.floor(88 + Math.random() * 10), // 88 - 98
          blurVariance: (260 + Math.random() * 90).toFixed(1), // Laplacian variance > 100 is sharp
          glareIndex: '3.1% (Within Tolerable 5% Range)',
          resolution: '1280 x 720 px ROI Extracted',
          sourceName,
          sampleMeta
        };
        setInspectionStats(stats);
        setIsInspecting(false);
        onImageSelected(imageUrl, stats);
      }, 450);
    } else {
      onImageSelected(imageUrl, { sourceName, sampleMeta });
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setMode('upload');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              mode === 'upload' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={startCamera}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              mode === 'camera' ? 'bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live WebCam
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Upload / Camera Viewport */}
      {mode === 'camera' ? (
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border-2 border-emerald-500/40 aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Biometric Reticle Overlay */}
          <div className="absolute inset-8 border border-emerald-400/40 rounded-lg pointer-events-none flex flex-col justify-between p-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 backdrop-blur-md">
                ALIGNED ROI: READY
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80 animate-pulse">
                • LIVE SENSOR
              </span>
            </div>

            {/* Scanning line animation */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-line relative" />

            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
                Fit medicine package within crosshairs
              </span>
            </div>
          </div>

          {/* Trigger capture button */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-emerald transition-all transform hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              Capture High-Res Scan
            </button>
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setMode('upload');
              }}
              className="px-4 py-2.5 rounded-full bg-slate-900/90 text-slate-300 text-xs border border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden p-6 flex flex-col items-center justify-center text-center ${
              currentImage
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {currentImage ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative max-h-60 rounded-lg overflow-hidden border border-emerald-500/30 shadow-lg">
                  <img
                    src={currentImage}
                    alt="Selected medicine"
                    className="max-h-60 w-auto object-contain rounded-lg"
                  />
                  {/* Overlay badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    IMAGE LOADED
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-slate-300 font-medium">Click or drop to replace image</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Switch to Camera
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Click to upload or drag & drop high-res medicine photo
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP (Min 800x800 recommended for print texture resolution)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Simulated OpenCV Preprocessing Feedback Banner */}
      {isInspecting && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          <div>
            <div className="font-semibold text-cyan-300">OpenCV Preprocessing in Progress...</div>
            <div className="text-slate-400 text-[11px]">Normalizing histogram, perspective crop & Laplacian sharpness calculation</div>
          </div>
        </div>
      )}

      {inspectionStats && !isInspecting && (
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-300 border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              OpenCV Quality Assessment: PASS
            </span>
            <span className="text-slate-400">{inspectionStats.aspectRatio}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block">Lighting Score:</span>
              <span className="text-emerald-400 font-bold">{inspectionStats.lightingScore}/100</span>
            </div>
            <div>
              <span className="text-slate-400 block">Laplacian Var (Sharpness):</span>
              <span className="text-cyan-400 font-bold">{inspectionStats.blurVariance} σ²</span>
            </div>
            <div>
              <span className="text-slate-400 block">Glare Index:</span>
              <span className="text-slate-200">{inspectionStats.glareIndex}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instant Demo Test Image Selection Buttons */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Quick Test Datasets (Pre-Calibrated Samples)
          </span>
          <span className="text-[10px] text-slate-400">Click to instantly populate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_TEST_IMAGES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => processImageSelection(sample.url, sample.name, sample)}
              className="text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-8 h-8 rounded object-cover border border-slate-700"
                />
                <span className={`text-[9px] font-mono px-1 rounded uppercase font-bold ${
                  sample.type === 'genuine'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : sample.type === 'clone'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {sample.type}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-200 group-hover:text-emerald-300 truncate">
                {sample.name}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                ID: {sample.packageId}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
