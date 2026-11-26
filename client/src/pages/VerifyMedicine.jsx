import React, { useState } from 'react';
import { 
  Scan, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Cpu, 
  Activity, 
  RefreshCw, 
  Layers, 
  FileCheck, 
  Microscope,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import FingerprintVisualizer from '../components/FingerprintVisualizer';
import { api } from '../services/api';

export default function VerifyMedicine() {
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
  const [expectedPackageId, setExpectedPackageId] = useState('PHARMA-9041');
  const [inspectionMeta, setInspectionMeta] = useState(null);

  // Scan Telemetry
  const [telemetry, setTelemetry] = useState({
    city: 'New Delhi (Pharmacy Dispensing Node 12)',
    lat: 28.6139,
    lng: 77.2090,
    timestamp: new Date().toISOString()
  });

  // Simulation controls
  const [simulateClone, setSimulateClone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verdictResult, setVerdictResult] = useState(null);

  const handleImageSelected = (imgUrl, meta) => {
    setSelectedImage(imgUrl);
    setInspectionMeta(meta);

    // If pre-configured sample was clicked, update expected ID and clone mode appropriately
    if (meta?.sampleMeta) {
      setExpectedPackageId(meta.sampleMeta.packageId);
      if (meta.sampleMeta.type === 'clone') {
        setSimulateClone(true);
      } else {
        setSimulateClone(false);
      }
    }
  };

  const handleRunVerification = async (e) => {
    if (e) e.preventDefault();
    if (!selectedImage) {
      alert("Please upload or capture a medicine package image first.");
      return;
    }

    setIsVerifying(true);
    setVerdictResult(null);

    try {
      const payload = {
        imageUrl: selectedImage,
        expectedPackageId,
        lightingScore: inspectionMeta?.lightingScore || 92,
        blurVariance: inspectionMeta?.blurVariance || 284.1,
        simulateClone,
        telemetry
      };

      const result = await api.verifyMedicine(payload);
      setVerdictResult(result);
    } catch (err) {
      console.error(err);
      alert("Verification service error.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Scan className="w-3.5 h-3.5" />
          <span>PHARMA-VISION BIOMETRIC SCANNER WORKSTATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Verify Medicine Packaging Integrity
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
          Multi-factor verification: Compare microscopic package surface texture against FAISS vector embeddings, cross-verify expected serial identity, and check physical travel velocity plausibility.
        </p>
      </div>

      {/* Main Grid: Left Scanner Input (5 cols) & Right Verification Verdict (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input & Image Scanner */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-emerald-400" />
              Capture / Input Specimen
            </span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Sensor Live
            </span>
          </h3>

          {/* Expected Package ID Input */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Expected Package / Serial ID</label>
              <span className="text-[10px] text-slate-400">(from barcode or printed label)</span>
            </div>
            <input
              type="text"
              value={expectedPackageId}
              onChange={(e) => setExpectedPackageId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              placeholder="e.g. PHARMA-9041"
            />
          </div>

          {/* Image Uploader & Live Camera */}
          <ImageUploader
            onImageSelected={handleImageSelected}
            currentImage={selectedImage}
            label="Package Surface Scan"
          />

          {/* Telemetry Node Info */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Current Scan Node:
              </span>
              <span className="text-cyan-400 font-semibold">{telemetry.city}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>GPS: {telemetry.lat}, {telemetry.lng}</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Simulation Switches */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-300">Simulate Impossible Travel Anomaly (Clone):</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateClone}
                onChange={(e) => setSimulateClone(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
            </label>
          </div>

          {/* Execute Verification Trigger */}
          <button
            type="button"
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs uppercase font-mono tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Siamese CNN & FAISS Search...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Execute Complete Verification Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Verification Verdict & Risk Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {verdictResult ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3">
              
              {/* Verdict Banner Card */}
              <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
                verdictResult.verdict === 'LIKELY_MATCH'
                  ? 'bg-slate-900 border-emerald-500/40 shadow-glow-emerald'
                  : verdictResult.verdict === 'CLONED_IDENTITY'
                  ? 'bg-slate-900 border-rose-500/40 shadow-glow-rose'
                  : 'bg-slate-900 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
              }`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Verification Result
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-bold flex items-center gap-2.5 mt-0.5 ${
                      verdictResult.verdict === 'LIKELY_MATCH'
                        ? 'text-emerald-400'
                        : verdictResult.verdict === 'CLONED_IDENTITY'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}>
                      {verdictResult.verdict === 'LIKELY_MATCH' && <CheckCircle2 className="w-6 h-6" />}
                      {verdictResult.verdict === 'CLONED_IDENTITY' && <AlertTriangle className="w-6 h-6 animate-pulse" />}
                      {verdictResult.verdict === 'SUSPICIOUS_DEFECT' && <AlertTriangle className="w-6 h-6" />}
                      <span>{verdictResult.statusText}</span>
                    </h3>
                  </div>

                  {/* Similarity Gauge Meter */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">Cosine Sim</span>
                    <span className={`text-2xl font-bold ${
                      verdictResult.similarityScore >= 85 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {verdictResult.similarityScore}%
                    </span>
                  </div>
                </div>

                {/* Risk Explanation */}
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {verdictResult.verdict === 'LIKELY_MATCH' && (
                      `Strong optical match with registered package ID ${verdictResult.matchedPackage?.packageId}. Micro-surface texture coordinates align with original manufacturing baseline within 0.18σ.`
                    )}
                    {verdictResult.verdict === 'CLONED_IDENTITY' && (
                      `CRITICAL WARNING: The physical serial number ${verdictResult.matchedPackage?.packageId} matches registered packaging, but geo-temporal telemetry detected an impossible physical travel velocity. Identical physical identifier was recently authenticated in a geographically distant location.`
                    )}
                    {verdictResult.verdict === 'SUSPICIOUS_DEFECT' && (
                      `High anomaly deviation detected. The visual print texture deviates significantly from the manufacturer's calibrated baseline. Potential counterfeit family defect.`
                    )}
                  </p>

                  {/* Defect or Anomaly Flags */}
                  {verdictResult.defectFlags?.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                      <span className="font-semibold text-rose-300 font-mono text-[11px] block">
                        Observed Anomalies & Threat Indicators:
                      </span>
                      {verdictResult.defectFlags.map((flag, i) => (
                        <div key={i} className="text-rose-200 flex items-center gap-1.5 font-mono text-[11px]">
                          <span>•</span>
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Geo-Velocity Alert Details */}
                  {verdictResult.geoVelocityAlert && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 font-mono text-xs text-rose-300 space-y-1.5">
                      <div className="flex justify-between font-bold text-rose-400">
                        <span>Haversine Distance:</span>
                        <span>{verdictResult.geoVelocityAlert.distanceKm} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time Delta:</span>
                        <span>{verdictResult.geoVelocityAlert.elapsedMinutes} mins</span>
                      </div>
                      <div className="flex justify-between text-rose-400 font-bold">
                        <span>Calculated Velocity:</span>
                        <span>{verdictResult.geoVelocityAlert.calculatedSpeedKmh} km/h (Limit: 800 km/h)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                        {verdictResult.geoVelocityAlert.message}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Matched Package Metadata */}
              {verdictResult.matchedPackage && (
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    Enrolled Package Records
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block">Medicine:</span>
                      <span className="text-white font-semibold">{verdictResult.matchedPackage.medicineName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Manufacturer:</span>
                      <span className="text-slate-300">{verdictResult.matchedPackage.manufacturer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Batch No:</span>
                      <span className="text-emerald-400 font-bold">{verdictResult.matchedPackage.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Expiry:</span>
                      <span className="text-slate-300">{verdictResult.matchedPackage.expDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Serial ID:</span>
                      <span className="text-cyan-400 font-bold">{verdictResult.matchedPackage.packageId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fingerprint Ref:</span>
                      <span className="text-slate-300 truncate">{verdictResult.matchedPackage.fingerprintId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Deep-dive pipeline visualizer */}
              <FingerprintVisualizer
                imageUrl={selectedImage}
                similarityScore={verdictResult.similarityScore}
                packageId={expectedPackageId || 'VERIFIED'}
                fingerprintId={verdictResult.fingerprintId || 'FP-SCAN'}
              />

            </div>
          ) : (
            /* Standby State */
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">Scanner Ready for Verification</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Select or capture a medicine package image on the left, then click "Execute Complete Verification Analysis" to inspect micro-texture patterns, identity correlation, and geo-travel anomalies.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRunVerification}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
                >
                  Run Instant Check
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
