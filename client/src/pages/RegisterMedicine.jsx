import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackagePlus, 
  Sparkles, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileCheck, 
  Layers, 
  Microscope,
  ShieldCheck,
  RefreshCw,
  Camera,
  Upload
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import FingerprintVisualizer from '../components/FingerprintVisualizer';
import { api } from '../services/api';

export default function RegisterMedicine() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    medicineName: 'Paracetamol 500mg Micro-Coated',
    genericName: 'Acetaminophen / Paracetamol',
    manufacturer: 'NovaCare Global Pharmaceuticals Ltd',
    batchNumber: 'NC-26B-991',
    packageId: 'PHARMA-' + Math.floor(1000 + Math.random() * 9000),
    mfgDate: '2026-03-01',
    expDate: '2028-03-01',
    dosage: '500mg Film-Coated Tablet',
    manufacturingFacility: 'NovaCare Cleanroom Plant 3, Geneva'
  });

  // Multi-Angle Image Capture State (Front, Back, Side, Close-up of Texture/Print)
  const [activeAngle, setActiveAngle] = useState('front'); // 'front' | 'back' | 'side' | 'closeup'
  const [packageImages, setPackageImages] = useState({
    front: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    back: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    side: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
    closeup: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=600&auto=format&fit=crop&q=80'
  });

  const [inspectionMeta, setInspectionMeta] = useState(null);
  
  // Registration Processing Stages
  const [currentStep, setCurrentStep] = useState(1); // 1: Details & Upload, 2: AI Feature Extraction, 3: Success Certificate
  const [isProcessing, setIsProcessing] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelected = (imgUrl, meta) => {
    setPackageImages(prev => ({
      ...prev,
      [activeAngle]: imgUrl
    }));
    setInspectionMeta(meta);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageImages.front) {
      alert("Please capture or upload the front image of the medicine package.");
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Simulate multi-stage Siamese CNN inference & FAISS indexing
    setTimeout(async () => {
      try {
        const payload = {
          ...formData,
          imageUrl: packageImages.front,
          multiAngleImages: packageImages,
          qualityScore: inspectionMeta?.lightingScore || 94,
          blurVariance: inspectionMeta?.blurVariance || 298.4
        };

        const res = await api.registerPackage(payload);
        setRegistrationResult(res.package);
        setIsProcessing(false);
        setCurrentStep(3);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        alert("Registration failed. Please try again.");
      }
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <PackagePlus className="w-3.5 h-3.5" />
          <span>PHARMACEUTICAL SERIALIZATION & BIOMETRIC ENROLLMENT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Register Medicine Physical Fingerprint
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
          Capture multi-angle package photographs (Front, Back, Side, and Close-up texture) to extract the stochastic micro-surface fingerprint and index it in the FAISS vector database.
        </p>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
          currentStep === 1 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
            1
          </span>
          <span className="font-semibold hidden sm:inline">Package & Multi-Angle</span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
          currentStep === 2 
            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' 
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
            2
          </span>
          <span className="font-semibold hidden sm:inline">Siamese CNN Embedding</span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
          currentStep === 3 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs">
            3
          </span>
          <span className="font-semibold hidden sm:inline">FAISS Biometric Index</span>
        </div>
      </div>

      {/* STEP 1: Registration Form */}
      {currentStep === 1 && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Metadata Inputs (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              Medicine Details & Serialization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Medicine Trade Name *</label>
                <input
                  type="text"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Paracetamol 500mg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Generic / Active Formula *</label>
                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Acetaminophen"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Manufacturer Name *</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Production Facility *</label>
                <input
                  type="text"
                  name="manufacturingFacility"
                  value={formData.manufacturingFacility}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Batch Number *</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Unique Package / Serial ID *</label>
                <input
                  type="text"
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Manufacturing Date *</label>
                <input
                  type="date"
                  name="mfgDate"
                  value={formData.mfgDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Expiration Date *</label>
                <input
                  type="date"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">Dosage Formulation & Packaging Tier</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Column: Multi-Angle Image Capture (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Microscope className="w-4 h-4 text-cyan-400" />
                Multi-Angle Image Capture
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">4 Angles Required</span>
            </div>

            {/* 4-Angle Selection Buttons */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {[
                { id: 'front', label: '1. Front' },
                { id: 'back', label: '2. Back' },
                { id: 'side', label: '3. Side' },
                { id: 'closeup', label: '4. Micro-Close' },
              ].map(angle => (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setActiveAngle(angle.id)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    activeAngle === angle.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] truncate">{angle.label}</div>
                  <div className="w-2 h-2 rounded-full mx-auto mt-1 bg-emerald-400" />
                </button>
              ))}
            </div>

            {/* Image Uploader for Currently Active Angle */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              currentImage={packageImages[activeAngle]}
              label={`Capture: ${activeAngle.toUpperCase()} VIEW`}
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Cpu className="w-4 h-4" />
              <span>Generate & Register Fingerprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: Simulated Deep AI Processing */}
      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900 border border-cyan-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-glow-cyan">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Extracting Multi-Angle Visual Fingerprint</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              Passing front, back, side, and micro-close-up tensors through twin Siamese CNN encoders. Normalizing L2 norm and committing vector to FAISS IndexFlatIP.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-left max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400">
              <span>[1/3] OpenCV CLAHE & Sharpness Check:</span>
              <span className="font-bold">PASSED (284.1 σ²)</span>
            </div>
            <div className="flex items-center justify-between text-cyan-400">
              <span>[2/3] PyTorch Twin CNN Embedding:</span>
              <span className="font-bold">128-DIM COMPLETED</span>
            </div>
            <div className="flex items-center justify-between text-purple-400">
              <span>[3/3] FAISS Global Index Insertion:</span>
              <span className="font-bold animate-pulse">INDEXING...</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Success Certificate */}
      {currentStep === 3 && registrationResult && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-glow-emerald">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Package Successfully Enrolled</h3>
                <p className="text-xs text-emerald-400 font-mono">
                  Indexed in Global FAISS Vector Database
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block">Enrollment ID:</span>
              <span className="text-white font-bold">{registrationResult.id}</span>
            </div>
          </div>

          {/* Certificate Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block">Medicine:</span>
              <span className="text-white font-bold text-sm">{registrationResult.medicineName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Package ID:</span>
              <span className="text-emerald-400 font-bold text-sm">{registrationResult.packageId}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Batch Number:</span>
              <span className="text-slate-200">{registrationResult.batchNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Fingerprint Vector ID:</span>
              <span className="text-cyan-400">{registrationResult.fingerprintId}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Embedding Version:</span>
              <span className="text-slate-300">v1.4-siamese-128d (Contrastive)</span>
            </div>
            <div>
              <span className="text-slate-400 block">FAISS Cosine Space:</span>
              <span className="text-purple-300">Norm ||v|| = 1.0 (Unit Sphere)</span>
            </div>
          </div>

          {/* Interactive Pipeline Visualizer for Registered Item */}
          <FingerprintVisualizer
            imageUrl={registrationResult.imageUrl}
            packageId={registrationResult.packageId}
            fingerprintId={registrationResult.fingerprintId}
            similarityScore={99.8}
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setFormData(prev => ({
                  ...prev,
                  packageId: 'PHARMA-' + Math.floor(1000 + Math.random() * 9000)
                }));
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Enroll Another Package
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
            >
              Back to Identification Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
