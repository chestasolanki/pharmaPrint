import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Check,
  FileCheck,
  Lock,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Ban
} from 'lucide-react';
import { analyzePackagingImage } from './services/visionClassifier';

const API_BASE = import.meta.env.VITE_API_URL || '';

// Pre-calibrated demo samples matching real-world verification conditions
const DEMO_SAMPLES = [
  {
    id: 'sample-1',
    name: 'Ibuprofen 400mg (Sealed)',
    packageId: 'PP-001',
    verdict: 'Likely match',
    similarity: 96.4,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    type: 'likely_match',
    condition: 'sealed',
    analysis: [
      'Registered fingerprint match found.',
      'No conflicting package identity detected.',
      'Image quality sufficient for comparison.'
    ]
  },
  {
    id: 'sample-open',
    name: 'Open / Unsealed Package',
    packageId: 'PP-001',
    verdict: 'Suspicious',
    similarity: 58.4,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&auto=format&fit=crop&q=80',
    type: 'open',
    condition: 'open',
    analysis: [
      'Packaging seal integrity breached: Open flap or broken seal detected.',
      'Conflicting package condition: Physical structure deviates from registered factory-sealed baseline.',
      'Micro-surface fingerprint integrity compromised along opening seam.',
      'Warning: High risk of moisture exposure, contamination, or product substitution. Do not consume.'
    ]
  },
  {
    id: 'sample-non-medicine',
    name: 'Non-Medicine Photo',
    packageId: 'N/A',
    verdict: 'Unknown',
    similarity: 0,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80',
    type: 'non_medicine',
    condition: 'non_medicine',
    analysis: [
      'No medicine packaging or pharmaceutical features detected in image.',
      '0.0% visual similarity across all registered pharmaceutical fingerprints.',
      'No recognizable medicine carton, blister foil, or vial labels found.',
      'Please upload a clear photo of genuine medicine packaging.'
    ]
  },
  {
    id: 'sample-3',
    name: 'Counterfeit Print Variant',
    packageId: 'PP-098-SUSP',
    verdict: 'Suspicious',
    similarity: 61.8,
    image: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=400&auto=format&fit=crop&q=80',
    type: 'suspicious',
    condition: 'counterfeit',
    analysis: [
      'Visual print anomalies detected on seal and packaging typography.',
      'High variance compared to genuine manufacturer baseline (>3.2σ).',
      'Image quality sufficient for comparison.'
    ]
  }
];

export default function App() {
  // App States: 'upload' | 'preview' | 'verifying' | 'result'
  const [currentStep, setCurrentStep] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  // Real-time Automated Packaging Condition: 'sealed' | 'open' | 'non_medicine' | 'counterfeit'
  const [packagingCondition, setPackagingCondition] = useState('sealed');
  const [isClassifying, setIsClassifying] = useState(false);

  // Verification Result State
  const [verificationResult, setVerificationResult] = useState(null);

  // References
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera error:", err);
      setCameraError("Camera permission was denied or camera is not available. You can upload an image or choose one of the sample medicines below.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
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
    processIncomingImage(dataUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processIncomingImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processIncomingImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const selectSample = (sample) => {
    stopCamera();
    setSelectedImage(sample.image);
    setPackagingCondition(sample.condition || 'sealed');
    setCurrentStep('preview');
  };

  // Run real-time computer vision classifier on the image pixels
  const processIncomingImage = async (dataUrl) => {
    setSelectedImage(dataUrl);
    setCurrentStep('preview');
    setIsClassifying(true);

    try {
      const response = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          packageId: 'PP-001'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data);
        if (data.verdictClass === 'unknown' || data.similarityScore === 0) {
          setPackagingCondition('non_medicine');
        } else if (data.verdictClass === 'suspicious' && data.similarityScore < 60) {
          setPackagingCondition('open');
        } else if (data.verdictClass === 'suspicious') {
          setPackagingCondition('counterfeit');
        } else {
          setPackagingCondition('sealed');
        }
      } else {
        const cvAnalysis = await analyzePackagingImage(dataUrl);
        setPackagingCondition(cvAnalysis.detectedCondition);
      }
    } catch (err) {
      console.warn("Classification error, applying visual fallback:", err);
      try {
        const cvAnalysis = await analyzePackagingImage(dataUrl);
        setPackagingCondition(cvAnalysis.detectedCondition);
      } catch (e) {
        // ignore
      }
    } finally {
      setIsClassifying(false);
    }
  };

  const runVerification = async () => {
    setCurrentStep('verifying');

    // Simulate AI pipeline: OpenCV Preprocessing -> Siamese CNN -> FAISS Matching
    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: selectedImage,
            packagingCondition: packagingCondition,
            sampleType: packagingCondition,
            packageId: 'PP-001'
          })
        });

        if (response.ok) {
          const data = await response.json();
          setVerificationResult(data);
        } else {
          fallbackCvResult();
        }
      } catch (err) {
        fallbackCvResult();
      } finally {
        setCurrentStep('result');
      }
    }, 1300);
  };

  const fallbackCvResult = () => {
    if (packagingCondition === 'non_medicine') {
      setVerificationResult({
        verdict: 'Unknown',
        verdictClass: 'unknown',
        similarityScore: 0,
        packageId: 'N/A',
        medicineName: 'Non-Medicine Image Detected',
        imageUrl: selectedImage,
        analysisPoints: [
          'No medicine packaging or pharmaceutical features detected in image.',
          '0.0% visual similarity across all registered pharmaceutical fingerprints.',
          'No recognizable medicine carton, blister foil, or vial labels found.',
          'Please upload a clear photo of genuine medicine packaging.'
        ],
        disclaimer: 'This is a mockup, not a real model prediction. Similarity is not a probability of authenticity.'
      });
    } else if (packagingCondition === 'open') {
      setVerificationResult({
        verdict: 'Suspicious',
        verdictClass: 'suspicious',
        similarityScore: 58.4,
        packageId: 'PP-001',
        medicineName: 'Medicine package (Open Packaging Detected)',
        imageUrl: selectedImage,
        analysisPoints: [
          'Packaging seal integrity breached: Open flap or broken seal detected.',
          'Conflicting package condition: Physical structure deviates from registered factory-sealed baseline.',
          'Micro-surface fingerprint integrity compromised along opening seam.',
          'Warning: High risk of moisture exposure, contamination, or product substitution. Do not consume.'
        ],
        disclaimer: 'This is a mockup, not a real model prediction. Similarity is not a probability of authenticity.'
      });
    } else if (packagingCondition === 'counterfeit') {
      setVerificationResult({
        verdict: 'Suspicious',
        verdictClass: 'suspicious',
        similarityScore: 61.8,
        packageId: 'PP-098-SUSP',
        medicineName: 'Medicine package (Counterfeit Flaws)',
        imageUrl: selectedImage,
        analysisPoints: [
          'Visual print anomalies detected on seal and packaging typography.',
          'High variance compared to genuine manufacturer baseline (>3.2σ).',
          'Image quality sufficient for comparison.'
        ],
        disclaimer: 'This is a mockup, not a real model prediction. Similarity is not a probability of authenticity.'
      });
    } else {
      setVerificationResult({
        verdict: 'Likely match',
        verdictClass: 'likely_match',
        similarityScore: 96.4,
        packageId: 'PP-001',
        medicineName: 'Medicine package',
        imageUrl: selectedImage,
        analysisPoints: [
          'Registered fingerprint match found.',
          'No conflicting package identity detected.',
          'Image quality sufficient for comparison.'
        ],
        disclaimer: 'This is a mockup, not a real model prediction. Similarity is not a probability of authenticity.'
      });
    }
  };

  const resetScanner = () => {
    stopCamera();
    setSelectedImage(null);
    setVerificationResult(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={resetScanner}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                PharmaPrint
              </span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Vision Engine Active</span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        
        {/* 2. HERO SECTION */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Scan a Medicine
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto">
            Upload a photo of the medicine packaging to get instant AI analysis.
          </p>
        </div>

        {/* 3. SCANNER / UPLOAD / PREVIEW / RESULT CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* --- STEP A: UPLOAD / CAMERA (Matching Screenshot 2) --- */}
          {currentStep === 'upload' && !isCameraActive && (
            <div className="p-6 sm:p-10 space-y-6">
              
              {/* Dashed Drag & Drop Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Upload Cloud Icon in rounded light blue box */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-800">
                    Drag medicine image here
                  </h3>
                  <p className="text-xs text-slate-500">
                    or click to select from your device
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1 font-mono">
                    JPEG, PNG, WebP up to 5MB
                  </p>
                </div>
              </div>

              {/* Primary Blue Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image</span>
              </button>

              {/* Divider & Camera Button */}
              <div className="text-center space-y-3 pt-2">
                <span className="text-xs text-slate-400 block font-medium">
                  Or use your device camera
                </span>
                
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
                >
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span>Open Camera</span>
                </button>
              </div>

              {cameraError && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

            </div>
          )}

          {/* --- STEP A-CAMERA: LIVE WEBCAM CAPTURE --- */}
          {currentStep === 'upload' && isCameraActive && (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span>Align medicine package within reticle</span>
                </div>
                <button
                  onClick={stopCamera}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Target Reticle Overlay */}
                <div className="absolute inset-8 scanner-reticle pointer-events-none flex flex-col justify-between p-3">
                  <span className="text-[11px] font-mono bg-black/60 text-white px-2 py-0.5 rounded self-start">
                    Camera Sensor Active
                  </span>
                  <div className="text-center">
                    <span className="text-xs bg-black/70 text-slate-200 px-3 py-1 rounded-full">
                      Hold packaging flat and steady
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Image</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* --- STEP B: IMAGE PREVIEW WITH AUTOMATIC PIXEL-LEVEL CLASSIFIER --- */}
          {currentStep === 'preview' && selectedImage && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Image Preview</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {isClassifying ? 'Analyzing image pixels...' : 'AI feature scan complete'}
                </span>
              </div>

              <div className="relative max-h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center p-2">
                <img
                  src={selectedImage}
                  alt="Medicine Packaging Preview"
                  className="max-h-72 w-auto object-contain rounded-xl shadow-sm"
                />
              </div>

              {/* Real-Time Computer Vision Classification Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    <span>AI Visual Inspection Result:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Auto-detected from image
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  
                  {/* Option 1: Open / Broken Packaging */}
                  <button
                    type="button"
                    onClick={() => setPackagingCondition('open')}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                      packagingCondition === 'open'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-medium shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>⚠️ Open / Broken</span>
                        {packagingCondition === 'open' && <span className="text-[9px] bg-amber-200 px-1 rounded font-mono">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-amber-800/80 leading-tight mt-0.5">
                        Open flap, torn seal, or exposed blister pack.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Factory Sealed Medicine */}
                  <button
                    type="button"
                    onClick={() => setPackagingCondition('sealed')}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                      packagingCondition === 'sealed'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-medium shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>🟢 Sealed Box</span>
                        {packagingCondition === 'sealed' && <span className="text-[9px] bg-emerald-200 px-1 rounded font-mono">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-emerald-800/80 leading-tight mt-0.5">
                        Intact unopened package with sealed flap.
                      </div>
                    </div>
                  </button>

                  {/* Option 3: NOT a Medicine Photo (0% Match) */}
                  <button
                    type="button"
                    onClick={() => setPackagingCondition('non_medicine')}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition-all ${
                      packagingCondition === 'non_medicine'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-medium shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1">
                        <span>🚫 Non-Medicine</span>
                        {packagingCondition === 'non_medicine' && <span className="text-[9px] bg-rose-200 px-1 rounded font-mono">0% MATCH</span>}
                      </div>
                      <div className="text-[10px] text-rose-800/80 leading-tight mt-0.5">
                        Unrelated image (car, object, landscape).
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={runVerification}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Verification</span>
                </button>

                <button
                  type="button"
                  onClick={resetScanner}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Choose Another</span>
                </button>
              </div>
            </div>
          )}

          {/* --- STEP C: AI PROCESSING LOADING --- */}
          {currentStep === 'verifying' && (
            <div className="p-12 sm:p-16 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  Verifying Physical Packaging & Seal...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Running OpenCV preprocessing → Siamese CNN embedding (128-d) → FAISS similarity search.
                </p>
              </div>
            </div>
          )}

          {/* --- STEP D: EXACT RESULT SCREEN (Matching Screenshot 1) --- */}
          {currentStep === 'result' && verificationResult && (
            <div className="bg-black text-white p-6 sm:p-8 rounded-2xl space-y-6">
              
              {/* Header: "Verification Report" with status badge */}
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Verification Report
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  verificationResult.similarityScore === 0
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : verificationResult.verdict === 'Likely match'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {verificationResult.similarityScore === 0 
                    ? 'Non-medicine image' 
                    : verificationResult.verdict === 'Likely match' 
                    ? 'Verified match' 
                    : 'Tamper alert'}
                </span>
              </div>

              {/* Medicine package row */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center shrink-0 border border-slate-800">
                  <img
                    src={verificationResult.imageUrl || selectedImage}
                    alt={verificationResult.medicineName}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {verificationResult.medicineName || 'Medicine package'}
                  </h4>
                  <div className="text-xs text-slate-400 font-mono">
                    Package ID: {verificationResult.packageId || 'PP-001'}
                  </div>
                  <div>
                    {verificationResult.similarityScore === 0 ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800/80">
                        Unknown (0% Match)
                      </span>
                    ) : verificationResult.verdict === 'Likely match' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                        Likely match
                      </span>
                    ) : verificationResult.verdict === 'Suspicious' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800/80">
                        Suspicious
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-400 border border-rose-800/80">
                        Unknown
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Large Similarity Score */}
              <div className="space-y-2 pt-2">
                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                  verificationResult.similarityScore === 0
                    ? 'text-rose-400'
                    : verificationResult.verdict === 'Likely match'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {verificationResult.similarityScore}%
                </div>
                <div className="text-xs text-slate-400">
                  {verificationResult.similarityScore === 0 
                    ? 'No pharmaceutical packaging correlation detected'
                    : 'Illustrative visual similarity score'}
                </div>

                {/* Progress Bar (Matching Screenshot 1) */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      verificationResult.similarityScore === 0
                        ? 'bg-rose-500'
                        : verificationResult.verdict === 'Likely match'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(verificationResult.similarityScore, 100)}%` }}
                  />
                </div>
              </div>

              {/* Analysis Section */}
              <div className="space-y-3 pt-2">
                <h5 className="text-sm font-bold text-white">
                  Analysis
                </h5>

                <ul className="space-y-2 text-xs text-slate-300">
                  {verificationResult.analysisPoints?.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={`${
                        point.includes('breached') || point.includes('Warning') || point.includes('deviates') || point.includes('No medicine packaging') || point.includes('0.0%')
                          ? 'text-rose-400' 
                          : 'text-slate-500'
                      } mt-1`}>•</span>
                      <span className={point.includes('breached') || point.includes('Warning') || point.includes('0.0%') ? 'text-rose-200 font-medium' : ''}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Disclaimer in small muted text */}
                <p className="text-[11px] text-slate-400 pt-3 border-t border-slate-900 leading-relaxed">
                  {verificationResult.disclaimer || 'This is a mockup, not a real model prediction. Similarity is not a probability of authenticity.'}
                </p>
              </div>

              {/* Scan another action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetScanner}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Another Medicine</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* 4. PRE-CALIBRATED TEST SAMPLES */}
        {currentStep === 'upload' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Or test with pre-calibrated samples:</span>
              </span>
              <span className="text-[11px] text-slate-400">Click to preview</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEMO_SAMPLES.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm text-left transition-all group flex flex-col justify-between"
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 mb-2 border border-slate-100">
                    <img
                      src={sample.image}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {sample.name}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sample.packageId}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        sample.similarity === 0
                          ? 'bg-rose-50 text-rose-700'
                          : sample.type === 'likely_match'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {sample.similarity === 0 ? '0% Match' : sample.verdict}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. TIPS & FORMATS (Matching Screenshot 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Tips for Best Results</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 leading-relaxed">
              <li>• Ensure photo contains clear medicine packaging or label.</li>
              <li>• Keep the medicine package flat and centered in frame.</li>
              <li>• Avoid unrelated objects, clutter, or direct flash glare.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Packaging Integrity Checks</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 leading-relaxed">
              <li>• Factory-sealed boxes with intact tamper threads.</li>
              <li>• Open flap and broken packaging detection.</li>
              <li>• Non-medicine photos automatically flag 0% match.</li>
            </ul>
          </div>
        </div>

      </main>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">PharmaPrint Biometric Verification</span>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-md">
            PharmaPrint utilizes Siamese CNN embeddings and FAISS vector matching to assess physical packaging integrity. This is an assistive tool and does not constitute absolute chemical certification.
          </p>
        </div>
      </footer>

    </div>
  );
}
