import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  History, 
  Microscope, 
  ArrowRight, 
  FileCheck, 
  RefreshCw, 
  Layers, 
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ImageUploader from '../components/ImageUploader';
import FingerprintVisualizer from '../components/FingerprintVisualizer';
import { api } from '../services/api';

export default function Dashboard() {
  const [packages, setPackages] = useState([]);
  const [scans, setScans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Instant Quick-Scanner State directly inside the Dashboard!
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
  const [packageIdInput, setPackageIdInput] = useState('PHARMA-9041');
  const [inspectionMeta, setInspectionMeta] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [simulateClone, setSimulateClone] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [pkgs, scns, anl] = await Promise.all([
        api.getPackages(),
        api.getScanHistory(),
        api.getAnalytics()
      ]);
      setPackages(pkgs);
      setScans(scns);
      setAnalytics(anl);
    }
    loadData();
  }, []);

  const handleImageSelected = (imgUrl, meta) => {
    setSelectedImage(imgUrl);
    setInspectionMeta(meta);

    if (meta?.sampleMeta) {
      setPackageIdInput(meta.sampleMeta.packageId);
      if (meta.sampleMeta.type === 'clone') {
        setSimulateClone(true);
      } else {
        setSimulateClone(false);
      }
    }
  };

  const handleRunScan = async (e) => {
    if (e) e.preventDefault();
    if (!selectedImage) return;

    setIsVerifying(true);
    setScanResult(null);

    try {
      const payload = {
        imageUrl: selectedImage,
        expectedPackageId: packageIdInput,
        lightingScore: inspectionMeta?.lightingScore || 92,
        blurVariance: inspectionMeta?.blurVariance || 284.1,
        simulateClone
      };

      const result = await api.verifyMedicine(payload);
      setScanResult(result);
      // Refresh recent scans
      const updatedScans = await api.getScanHistory();
      setScans(updatedScans);
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'LIKELY_MATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            REAL / AUTHENTIC
          </span>
        );
      case 'CLONED_IDENTITY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            CLONED / SUSPICIOUS
          </span>
        );
      case 'SUSPICIOUS_DEFECT':
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5" />
            FAKE / COUNTERFEIT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300">
            RESCAN NEEDED
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Physical Medicine Verification Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fake vs Real Medicine Identification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Verify whether a medicine package is genuine or counterfeit by analyzing micro-surface printing textures, optical tamper seals, and registered serialization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register-medicine"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <span>+ Enroll New Medicine</span>
          </Link>
          <a
            href="#scanner-station"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-glow-emerald flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Scan className="w-4 h-4" />
            <span>Start Scan Now</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans Conducted"
          value={analytics?.totalScans ? analytics.totalScans.toLocaleString() : '89,420'}
          change="+8.4%"
          isPositive={true}
          subtitle="Processed by Vision AI"
          icon={Scan}
          color="cyan"
          badge="Live"
        />
        <StatCard
          title="Authentic / Real Rate"
          value={`${analytics?.genuineMatchRate || 94.6}%`}
          change="+0.5%"
          isPositive={true}
          subtitle="Passed Biometric Check"
          icon={CheckCircle2}
          color="emerald"
          badge="Safe"
        />
        <StatCard
          title="Counterfeits Intercepted"
          value={analytics?.counterfeitDetections || 126}
          change="+14 this month"
          isPositive={false}
          subtitle="Flagged as Fake / Defective"
          icon={XCircle}
          color="rose"
          badge="Blocked"
        />
        <StatCard
          title="Cloned Serial Alerts"
          value={analytics?.clonedIdentityAlerts || 48}
          change="Duplicate Label"
          isPositive={false}
          subtitle="Teleportation & Reuse"
          icon={AlertTriangle}
          color="amber"
          badge="Warning"
        />
      </div>

      {/* CORE IDENTIFICATION WORKSTATION (Directly in Dashboard!) */}
      <div id="scanner-station" className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Microscope className="w-4 h-4" />
              Instant Biometric Scanner
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Scan Medicine Packaging for Authenticity
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            OpenCV CLAHE + 128d Siamese CNN + FAISS Index
          </span>
        </div>

        {/* Scanner Split: Inputs on Left, Results on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Capture & Serial Input (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">
                Medicine Package / Serial ID (Optional)
              </label>
              <input
                type="text"
                value={packageIdInput}
                onChange={(e) => setPackageIdInput(e.target.value)}
                placeholder="e.g. PHARMA-9041"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400">
                Leave blank for automated nearest-neighbor search, or enter printed ID to detect fake clones.
              </span>
            </div>

            <ImageUploader
              onImageSelected={handleImageSelected}
              currentImage={selectedImage}
              label="Medicine Package Image"
            />

            <button
              type="button"
              onClick={handleRunScan}
              disabled={isVerifying}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs uppercase font-mono tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Micro-Texture & Printing Plates...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>Identify Medicine (Real or Fake)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Instant Verdict & Inspection Result (7 cols) */}
          <div className="lg:col-span-7">
            {scanResult ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Big Bold Verdict Card */}
                <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
                  scanResult.verdict === 'LIKELY_MATCH'
                    ? 'bg-slate-950 border-emerald-500/40 shadow-glow-emerald'
                    : scanResult.verdict === 'CLONED_IDENTITY'
                    ? 'bg-slate-950 border-rose-500/40 shadow-glow-rose'
                    : 'bg-slate-950 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.25)]'
                }`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        Identification Verdict
                      </span>
                      <h3 className={`text-2xl font-extrabold flex items-center gap-2.5 mt-0.5 ${
                        scanResult.verdict === 'LIKELY_MATCH'
                          ? 'text-emerald-400'
                          : scanResult.verdict === 'CLONED_IDENTITY'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {scanResult.verdict === 'LIKELY_MATCH' && <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
                        {scanResult.verdict === 'CLONED_IDENTITY' && <AlertTriangle className="w-7 h-7 text-amber-400 animate-pulse" />}
                        {scanResult.verdict === 'SUSPICIOUS_DEFECT' && <XCircle className="w-7 h-7 text-rose-400" />}
                        
                        <span>
                          {scanResult.verdict === 'LIKELY_MATCH' && 'REAL / AUTHENTIC MEDICINE'}
                          {scanResult.verdict === 'CLONED_IDENTITY' && 'POTENTIAL CLONE / DUPLICATE'}
                          {scanResult.verdict === 'SUSPICIOUS_DEFECT' && 'FAKE / COUNTERFEIT DETECTED'}
                        </span>
                      </h3>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
                      <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                      <span className={`text-2xl font-bold ${
                        scanResult.similarityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {scanResult.similarityScore}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {scanResult.verdict === 'LIKELY_MATCH' && (
                        `Genuine medicine package confirmed. Surface printing patterns, micro-embossing, and serial ID ${scanResult.matchedPackage?.packageId} match original manufacturer registration.`
                      )}
                      {scanResult.verdict === 'CLONED_IDENTITY' && (
                        `WARNING: Visual print matches registered model, but the serial number was scanned concurrently or across impossible distances. Potential clone attack.`
                      )}
                      {scanResult.verdict === 'SUSPICIOUS_DEFECT' && (
                        `CRITICAL WARNING: The physical packaging deviates significantly from the authentic manufacturer baseline. Common counterfeit printing flaws or uncalibrated packaging detected. DO NOT DISPENSE.`
                      )}
                    </p>

                    {/* Defect or Warning Highlights */}
                    {scanResult.defectFlags?.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                        <span className="font-semibold text-rose-300 font-mono text-[11px] block">
                          Detected Defect Signatures:
                        </span>
                        {scanResult.defectFlags.map((flag, idx) => (
                          <div key={idx} className="text-rose-200 flex items-center gap-1.5 font-mono text-[11px]">
                            <span>•</span>
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Package Records Table */}
                {scanResult.matchedPackage && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Medicine:</span>
                      <span className="text-white font-bold">{scanResult.matchedPackage.medicineName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Manufacturer:</span>
                      <span className="text-slate-300">{scanResult.matchedPackage.manufacturer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Batch Number:</span>
                      <span className="text-emerald-400 font-bold">{scanResult.matchedPackage.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Expiration Date:</span>
                      <span className="text-slate-300">{scanResult.matchedPackage.expDate}</span>
                    </div>
                  </div>
                )}

                {/* Pipeline visualizer */}
                <FingerprintVisualizer
                  imageUrl={selectedImage}
                  similarityScore={scanResult.similarityScore}
                  packageId={packageIdInput || 'VERIFIED'}
                  fingerprintId={scanResult.fingerprintId || 'FP-SCAN'}
                />

              </div>
            ) : (
              <div className="h-full min-h-[360px] p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-white">Ready for Identification</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Select a sample image on the left or upload your own medicine photo, then click <strong className="text-emerald-400">"Identify Medicine"</strong> to check for counterfeit defects and verify authentic biometrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRunScan}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
                >
                  Test Sample Scan
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* RECENT IDENTIFICATION LOG */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              Recent Medicine Verifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit record of physical medicine packaging authentications.
            </p>
          </div>
          <Link
            to="/scans"
            className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1"
          >
            <span>View Full Audit Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Medicine & Package ID</th>
                <th className="pb-3 font-semibold">Verdict (Fake or Real)</th>
                <th className="pb-3 font-semibold">Sim Score</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {scans.slice(0, 6).map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="font-semibold text-slate-200">{scan.medicineName}</div>
                    <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                      {scan.packageId}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3">
                    {getVerdictBadge(scan.verdict)}
                  </td>
                  <td className="py-3.5 pr-3 font-mono font-bold">
                    <span className={scan.similarityScore >= 85 ? 'text-emerald-400' : 'text-rose-400'}>
                      {scan.similarityScore}%
                    </span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{scan.location.city}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-slate-400 text-[11px]">
                    {new Date(scan.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
