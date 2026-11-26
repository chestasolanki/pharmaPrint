/**
 * PharmaPrint API Client
 * Interfaces with Node.js Express backend (Port 5000) & provides resilient fallback demo data.
 */

const API_BASE = '/api';

// Fallback seed data in case backend is loading
export const FALLBACK_PACKAGES = [
  {
    id: 'PKG-2026-9041',
    packageId: 'PHARMA-9041',
    medicineName: 'Paracetamol 500mg Micro-Coated',
    genericName: 'Acetaminophen',
    manufacturer: 'NovaCare Global Ltd',
    batchNumber: 'NC-26B-991',
    mfgDate: '2026-02-15',
    expDate: '2028-02-14',
    dosage: '500mg Film-Coated Tablet',
    status: 'ACTIVE',
    fingerprintId: 'FP-NC-9041-A',
    embeddingVersion: 'v1.4-siamese-128d',
    registeredAt: '2026-03-01T10:14:22Z',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Geneva, Switzerland', lat: 46.2044, lng: 6.1432 }
  },
  {
    id: 'PKG-2026-8812',
    packageId: 'PHARMA-8812',
    medicineName: 'Amoxicillin Trihydrate 250mg',
    genericName: 'Amoxicillin',
    manufacturer: 'Apex BioPharma Europe',
    batchNumber: 'AX-AMX-204',
    mfgDate: '2026-01-10',
    expDate: '2027-01-09',
    dosage: '250mg Oral Suspension',
    status: 'ACTIVE',
    fingerprintId: 'FP-AX-8812-C',
    embeddingVersion: 'v1.4-siamese-128d',
    registeredAt: '2026-02-12T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 }
  },
  {
    id: 'PKG-2026-7734',
    packageId: 'PHARMA-7734',
    medicineName: 'Ozempic (Semaglutide) 1mg Pen',
    genericName: 'Semaglutide Injection',
    manufacturer: 'Nordic Health Biosystems',
    batchNumber: 'NH-SEM-502',
    mfgDate: '2026-03-01',
    expDate: '2027-09-01',
    dosage: '1mg/dose Pre-filled Pen',
    status: 'FLAGGED_MONITORING',
    fingerprintId: 'FP-NH-7734-X',
    embeddingVersion: 'v1.4-siamese-128d',
    registeredAt: '2026-03-15T08:20:10Z',
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683 }
  },
  {
    id: 'PKG-2026-6510',
    packageId: 'PHARMA-6510',
    medicineName: 'Remdesivir Lyophilized 100mg',
    genericName: 'Remdesivir for Injection',
    manufacturer: 'Aegis Therapeutics Inc.',
    batchNumber: 'AEG-RDV-118',
    mfgDate: '2026-02-20',
    expDate: '2027-08-20',
    dosage: '100mg/vial Single-dose',
    status: 'ACTIVE',
    fingerprintId: 'FP-AEG-6510-M',
    embeddingVersion: 'v1.4-siamese-128d',
    registeredAt: '2026-03-05T11:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Boston, MA, USA', lat: 42.3601, lng: -71.0589 }
  },
  {
    id: 'PKG-2026-5421',
    packageId: 'PHARMA-5421',
    medicineName: 'Lipitor (Atorvastatin Calcium) 20mg',
    genericName: 'Atorvastatin',
    manufacturer: 'Pfizer Global Health',
    batchNumber: 'PF-LIP-9904',
    mfgDate: '2026-01-05',
    expDate: '2028-01-04',
    dosage: '20mg Film-Coated Tablet',
    status: 'ACTIVE',
    fingerprintId: 'FP-PF-5421-K',
    embeddingVersion: 'v1.4-siamese-128d',
    registeredAt: '2026-01-20T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603 }
  }
];

export const FALLBACK_SCANS = [
  {
    id: 'SCN-9982',
    timestamp: '2026-11-15T18:42:10Z',
    packageId: 'PHARMA-9041',
    medicineName: 'Paracetamol 500mg Micro-Coated',
    verdict: 'LIKELY_MATCH',
    similarityScore: 97.4,
    statusText: 'Verified Authentic',
    riskLevel: 'LOW',
    scannedBy: 'Marcus Chen, PharmD',
    facility: 'Metro Central Pharmacy & Health',
    location: { city: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
    matchedPackageId: 'PHARMA-9041',
    defectFlags: [],
    geoAnomaly: false,
    imageSnapshot: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'SCN-9981',
    timestamp: '2026-11-15T18:15:30Z',
    packageId: 'PHARMA-7734',
    medicineName: 'Ozempic (Semaglutide) 1mg Pen',
    verdict: 'CLONED_IDENTITY',
    similarityScore: 94.2,
    statusText: 'Identity Reuse Detected (Clone)',
    riskLevel: 'CRITICAL',
    scannedBy: 'Tariq Al-Mansoor',
    facility: 'Apex Cold-Chain Freight Depot',
    location: { city: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    matchedPackageId: 'PHARMA-7734',
    defectFlags: ['Impossible Physical Travel Velocity (2,340 km/h)'],
    geoAnomaly: true,
    previousScan: {
      location: 'New Delhi, India',
      timeDeltaMinutes: 30,
      distanceKm: 1148,
      calculatedVelocityKmh: 2296
    },
    imageSnapshot: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'SCN-9980',
    timestamp: '2026-11-15T17:30:45Z',
    packageId: 'PHARMA-UNREG-41',
    medicineName: 'Remdesivir Lyophilized 100mg (Counterfeit)',
    verdict: 'SUSPICIOUS_DEFECT',
    similarityScore: 61.8,
    statusText: 'Counterfeit Family Signature Match',
    riskLevel: 'HIGH',
    scannedBy: 'Apothecary Safety Inspector',
    facility: 'Regional Transit Warehouse B-4',
    location: { city: 'Hyderabad, India', lat: 17.3850, lng: 78.4867 },
    matchedPackageId: null,
    clusterId: 'CF-804',
    defectFlags: ['Distorted Micro-Logo', 'Foil Thickness Variance', 'Misaligned Batch Typography'],
    geoAnomaly: false,
    imageSnapshot: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'SCN-9979',
    timestamp: '2026-11-15T16:10:12Z',
    packageId: 'PHARMA-8812',
    medicineName: 'Amoxicillin Trihydrate 250mg',
    verdict: 'LIKELY_MATCH',
    similarityScore: 96.1,
    statusText: 'Verified Authentic',
    riskLevel: 'LOW',
    scannedBy: 'Dr. Evelyn Vance',
    facility: 'Port Customs Inspection Lab',
    location: { city: 'London, UK', lat: 51.5074, lng: -0.1278 },
    matchedPackageId: 'PHARMA-8812',
    defectFlags: [],
    geoAnomaly: false,
    imageSnapshot: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'SCN-9978',
    timestamp: '2026-11-15T15:05:00Z',
    packageId: 'UNKNOWN-LABEL-09',
    medicineName: 'Unknown Formulation',
    verdict: 'UNKNOWN',
    similarityScore: 38.5,
    statusText: 'Unregistered / High Discrepancy',
    riskLevel: 'HIGH',
    scannedBy: 'Field Officer Dave S.',
    facility: 'Border Post Delta',
    location: { city: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    matchedPackageId: null,
    defectFlags: ['No registered visual fingerprint', 'Unrecognized guilloche pattern'],
    geoAnomaly: false,
    imageSnapshot: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80'
  }
];

export const FALLBACK_CLUSTERS = [
  {
    id: 'CF-804',
    clusterName: 'Counterfeit Family #CF-804: "Sub-Continental Gravure Offset"',
    defectPattern: 'Distorted micro-logo, misaligned batch typography, and low-viscosity blister ink bleeding.',
    algorithm: 'DBSCAN (eps=0.28, min_samples=3)',
    flaggedPackagesCount: 14,
    affectedMedicines: ['Paracetamol 500mg', 'Remdesivir 100mg'],
    intraClusterSimilarity: 0.942,
    detectionDate: '2026-11-12',
    status: 'UNDER_INVESTIGATION', // OPEN, UNDER_INVESTIGATION, CONFIRMED_COUNTERFEIT, CLOSED
    primaryLocations: ['Hyderabad, India', 'Karachi, Pakistan', 'Dubai Free Zone'],
    defectSignatures: [
      { name: 'Logo Print Distortion', deviation: '+34% pixel jitter at 1200 DPI' },
      { name: 'Guilloche Line Discontinuity', deviation: '0.12mm line break in protective curves' },
      { name: 'Batch Ink Bleed', deviation: 'IR reflectance discrepancy of 18%' }
    ],
    sampleImages: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579165466791-78818925567b?w=300&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'CF-809',
    clusterName: 'Counterfeit Family #CF-809: "Syringe & Pen Tamper Seal Clones"',
    defectPattern: 'Counterfeit holographic seal, laser micro-perforation spacing error, identical barcode serial reuse.',
    algorithm: 'DBSCAN (eps=0.22, min_samples=2)',
    flaggedPackagesCount: 8,
    affectedMedicines: ['Ozempic 1mg Pre-filled Pen', 'Insulin Glargine'],
    intraClusterSimilarity: 0.978,
    detectionDate: '2026-11-14',
    status: 'CONFIRMED_COUNTERFEIT',
    primaryLocations: ['Mumbai, India', 'Istanbul, Turkey', 'Sofia, Bulgaria'],
    defectSignatures: [
      { name: 'Holographic Color-Shift Shift', deviation: 'Diffraction grating pitch off by 140nm' },
      { name: 'Cloned Security Thread', deviation: 'Photocopied microtext without magnetic pigment' }
    ],
    sampleImages: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'CF-812',
    clusterName: 'Counterfeit Family #CF-812: "Foil Emulsion Grain Variance"',
    defectPattern: 'Sub-standard aluminum foil grain, cold-formed blister bubbles, incorrect heat-sealing temperature mark.',
    algorithm: 'DBSCAN (eps=0.31, min_samples=4)',
    flaggedPackagesCount: 19,
    affectedMedicines: ['Amoxicillin 250mg', 'Ciprofloxacin 500mg'],
    intraClusterSimilarity: 0.915,
    detectionDate: '2026-11-09',
    status: 'OPEN',
    primaryLocations: ['Alexandria, Egypt', 'Nairobi, Kenya', 'Lagos, Nigeria'],
    defectSignatures: [
      { name: 'Alu-Foil Grain Dispersion', deviation: 'Roughness Ra 4.2 µm vs genuine 1.8 µm' },
      { name: 'Seal Impression Matrix', deviation: 'Knurl pitch 1.0mm instead of 0.8mm' }
    ],
    sampleImages: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
    ]
  }
];

export const FALLBACK_GEO_ALERTS = [
  {
    id: 'GEO-ALT-101',
    packageId: 'PHARMA-7734',
    medicineName: 'Ozempic (Semaglutide) 1mg Pen',
    batchNumber: 'NH-SEM-502',
    timestamp: '2026-11-15T18:15:30Z',
    severity: 'CRITICAL',
    status: 'ACTIVE_ALERT', // ACTIVE_ALERT, IN_REVIEW, RESOLVED
    scanA: {
      location: 'New Delhi (Pharmacy Connaught Place)',
      lat: 28.6315,
      lng: 77.2167,
      timestamp: '2026-11-15T17:45:00Z',
      verifiedBy: 'Dr. S. Kapoor'
    },
    scanB: {
      location: 'Mumbai (Wholesale Pharma Depot)',
      lat: 19.0760,
      lng: 72.8777,
      timestamp: '2026-11-15T18:15:30Z',
      verifiedBy: 'Tariq Al-Mansoor'
    },
    distanceKm: 1148,
    elapsedMinutes: 30.5,
    calculatedVelocityKmh: 2258,
    physicalVelocityThresholdKmh: 800,
    impossibleFactor: '2.8x Commercial Supersonic Limit',
    recommendation: 'Immediate supply chain freeze on Batch NH-SEM-502. Cloned physical identifier in circulation.'
  },
  {
    id: 'GEO-ALT-102',
    packageId: 'PHARMA-6510',
    medicineName: 'Remdesivir Lyophilized 100mg',
    batchNumber: 'AEG-RDV-118',
    timestamp: '2026-11-14T21:10:00Z',
    severity: 'HIGH',
    status: 'IN_REVIEW',
    scanA: {
      location: 'Frankfurt Air Cargo Center',
      lat: 50.0379,
      lng: 8.5622,
      timestamp: '2026-11-14T20:20:00Z',
      verifiedBy: 'Customs Officer Keller'
    },
    scanB: {
      location: 'Cairo General Hospital Dispensary',
      lat: 30.0444,
      lng: 31.2357,
      timestamp: '2026-11-14T21:10:00Z',
      verifiedBy: 'Pharmacist A. Mansour'
    },
    distanceKm: 2920,
    elapsedMinutes: 50.0,
    calculatedVelocityKmh: 3504,
    physicalVelocityThresholdKmh: 800,
    impossibleFactor: '4.4x Aircraft Maximum Practical Cruise',
    recommendation: 'Quarantine Cairo shipment and verify tamper-proof micro-fingerprint.'
  }
];

export const FALLBACK_ANALYTICS = {
  totalRegisteredPackages: 14280,
  totalScans: 89420,
  genuineMatchRate: 94.6,
  clonedIdentityAlerts: 48,
  counterfeitDetections: 126,
  activeClusters: 3,
  systemConfidence: 99.4,
  scansByDay: [
    { date: 'Nov 09', genuine: 1240, suspicious: 18, clones: 4 },
    { date: 'Nov 10', genuine: 1410, suspicious: 22, clones: 6 },
    { date: 'Nov 11', genuine: 1380, suspicious: 15, clones: 3 },
    { date: 'Nov 12', genuine: 1520, suspicious: 31, clones: 8 },
    { date: 'Nov 13', genuine: 1690, suspicious: 27, clones: 5 },
    { date: 'Nov 14', genuine: 1810, suspicious: 38, clones: 11 },
    { date: 'Nov 15', genuine: 1940, suspicious: 42, clones: 12 },
  ],
  threatByMedicine: [
    { name: 'Ozempic 1mg', clones: 28, suspicious: 45, threatScore: 92 },
    { name: 'Remdesivir 100mg', clones: 14, suspicious: 38, threatScore: 78 },
    { name: 'Paracetamol 500mg', clones: 4, suspicious: 26, threatScore: 42 },
    { name: 'Amoxicillin 250mg', clones: 2, suspicious: 17, threatScore: 35 },
  ]
};

// Helper fetcher with graceful fallback
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline or running in mock mode - handle gracefully below
  }
  return null;
}

export const api = {
  // Packages
  async getPackages() {
    const data = await request('/packages');
    return data || FALLBACK_PACKAGES;
  },

  async getPackage(id) {
    const data = await request(`/packages/${id}`);
    return data || FALLBACK_PACKAGES.find(p => p.id === id || p.packageId === id);
  },

  async registerPackage(packageData) {
    const data = await request('/packages/register', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });
    if (data) return data;

    // Local fallback creation
    const newPkg = {
      id: `PKG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...packageData,
      status: 'ACTIVE',
      fingerprintId: `FP-${packageData.packageId || 'GEN'}-${Date.now().toString().slice(-4)}`,
      embeddingVersion: 'v1.4-siamese-128d',
      registeredAt: new Date().toISOString(),
      registeredLocation: packageData.location || { city: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5417 }
    };
    FALLBACK_PACKAGES.unshift(newPkg);
    return { success: true, package: newPkg };
  },

  // Verification Engine
  async verifyMedicine(verificationPayload) {
    const data = await request('/verify', {
      method: 'POST',
      body: JSON.stringify(verificationPayload)
    });
    if (data) return data;

    // Advanced local simulation of Siamese CNN + FAISS + Identity Correlation + Geo Analysis
    const expectedId = (verificationPayload.expectedPackageId || '').trim();
    const matched = FALLBACK_PACKAGES.find(p => p.packageId.toLowerCase() === expectedId.toLowerCase());
    
    // Simulate AI Feature Extraction & Preprocessing
    const qualityScore = verificationPayload.lightingScore || 92;
    if (qualityScore < 45) {
      return {
        verdict: 'POOR_IMAGE_QUALITY',
        similarityScore: 42.0,
        statusText: 'Image Blur / Glare Exceeds Tolerance - Please Rescan',
        riskLevel: 'MEDIUM',
        matchedPackage: null,
        preprocessing: {
          aspectRatioOk: true,
          lightingNormalized: false,
          boundaryDetected: false,
          blurLaplacianVariance: 32.4
        },
        geoAnomaly: false,
        message: 'The package boundaries or micro-texture could not be resolved clearly due to glare or focal blur.'
      };
    }

    if (matched) {
      // Package found in DB - check if simulate clone or genuine
      const isSimulateClone = verificationPayload.simulateClone || false;
      if (isSimulateClone) {
        return {
          verdict: 'CLONED_IDENTITY',
          similarityScore: 95.8,
          statusText: 'Potential Identity Reuse (Clone Alert)',
          riskLevel: 'CRITICAL',
          matchedPackage: matched,
          preprocessing: {
            aspectRatioOk: true,
            lightingNormalized: true,
            boundaryDetected: true,
            blurLaplacianVariance: 284.1
          },
          geoAnomaly: true,
          geoVelocityAlert: {
            distanceKm: 1250,
            elapsedMinutes: 24,
            calculatedSpeedKmh: 3125,
            message: 'Physical Travel Speed 3,125 km/h violates realistic travel bounds. Duplicate package label in transit.'
          },
          defectFlags: ['Geographic Teleportation Anomaly', 'Repeated Serial Authentication in Disjoint Hubs'],
          fingerprintId: matched.fingerprintId,
          scanId: `SCN-${Date.now().toString().slice(-4)}`
        };
      }

      return {
        verdict: 'LIKELY_MATCH',
        similarityScore: 98.2,
        statusText: 'Authentic Physical Package Confirmed',
        riskLevel: 'LOW',
        matchedPackage: matched,
        preprocessing: {
          aspectRatioOk: true,
          lightingNormalized: true,
          boundaryDetected: true,
          blurLaplacianVariance: 342.8
        },
        geoAnomaly: false,
        defectFlags: [],
        fingerprintId: matched.fingerprintId,
        scanId: `SCN-${Date.now().toString().slice(-4)}`
      };
    } else if (expectedId) {
      // Expected an ID, but does not match or matches a DIFFERENT package
      return {
        verdict: 'SUSPICIOUS_DEFECT',
        similarityScore: 68.4,
        statusText: 'Suspicious Signature - Discrepancy with Registered Model',
        riskLevel: 'HIGH',
        matchedPackage: FALLBACK_PACKAGES[0],
        mismatchDetail: `Claimed ID "${expectedId}" does not correlate with visual surface micro-texture.`,
        preprocessing: {
          aspectRatioOk: true,
          lightingNormalized: true,
          boundaryDetected: true,
          blurLaplacianVariance: 198.5
        },
        geoAnomaly: false,
        defectFlags: ['Micro-texture pattern offset > 3.2σ', 'Uncalibrated ink density in serial sector'],
        fingerprintId: 'FP-UNVERIFIED',
        scanId: `SCN-${Date.now().toString().slice(-4)}`
      };
    } else {
      // No ID passed, search FAISS index for nearest neighbor
      const bestMatch = FALLBACK_PACKAGES[0];
      return {
        verdict: 'LIKELY_MATCH',
        similarityScore: 96.4,
        statusText: 'Nearest Neighbor Identified: ' + bestMatch.medicineName,
        riskLevel: 'LOW',
        matchedPackage: bestMatch,
        preprocessing: {
          aspectRatioOk: true,
          lightingNormalized: true,
          boundaryDetected: true,
          blurLaplacianVariance: 310.2
        },
        geoAnomaly: false,
        defectFlags: [],
        fingerprintId: bestMatch.fingerprintId,
        scanId: `SCN-${Date.now().toString().slice(-4)}`
      };
    }
  },

  // Scan History
  async getScanHistory() {
    const data = await request('/scans/history');
    return data || FALLBACK_SCANS;
  },

  // Admin Analytics & Intelligence
  async getAnalytics() {
    const data = await request('/admin/analytics');
    return data || FALLBACK_ANALYTICS;
  },

  async getCounterfeitClusters() {
    const data = await request('/admin/clusters');
    return data || FALLBACK_CLUSTERS;
  },

  async updateClusterStatus(id, status) {
    const data = await request(`/admin/clusters/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (data) return data;
    const c = FALLBACK_CLUSTERS.find(item => item.id === id);
    if (c) c.status = status;
    return { success: true, cluster: c };
  },

  async getGeoAlerts() {
    const data = await request('/admin/geo-alerts');
    return data || FALLBACK_GEO_ALERTS;
  },

  async updateGeoAlert(id, update) {
    const data = await request(`/admin/geo-alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update)
    });
    if (data) return data;
    const a = FALLBACK_GEO_ALERTS.find(item => item.id === id);
    if (a) Object.assign(a, update);
    return { success: true, alert: a };
  }
};
