/**
 * PharmaPrint In-Memory Seed Database
 * Pre-populated with realistic medicines, serialized packages, 128d visual fingerprints,
 * DBSCAN counterfeit family clusters, and geo-temporal velocity anomalies.
 */

// Master Medicines
export const medicines = [
  {
    id: 'MED-001',
    name: 'Paracetamol 500mg Micro-Coated',
    genericName: 'Acetaminophen / Paracetamol',
    manufacturer: 'NovaCare Global Ltd',
    dosageForm: '500mg Film-Coated Tablet',
    atcCode: 'N02BE01',
    description: 'Analgesic and antipyretic for mild to moderate pain relief.'
  },
  {
    id: 'MED-002',
    name: 'Amoxicillin Trihydrate 250mg',
    genericName: 'Amoxicillin',
    manufacturer: 'Apex BioPharma Europe',
    dosageForm: '250mg Oral Suspension',
    atcCode: 'J01CA04',
    description: 'Broad-spectrum beta-lactam antibiotic for bacterial infections.'
  },
  {
    id: 'MED-003',
    name: 'Ozempic (Semaglutide) 1mg Pen',
    genericName: 'Semaglutide Injection',
    manufacturer: 'Nordic Health Biosystems',
    dosageForm: '1mg/dose Pre-filled Pen',
    atcCode: 'A10BJ06',
    description: 'GLP-1 receptor agonist for type 2 diabetes management.'
  },
  {
    id: 'MED-004',
    name: 'Remdesivir Lyophilized 100mg',
    genericName: 'Remdesivir for Injection',
    manufacturer: 'Aegis Therapeutics Inc.',
    dosageForm: '100mg/vial Single-dose',
    atcCode: 'J05AB16',
    description: 'Broad-spectrum antiviral nucleotide analog.'
  },
  {
    id: 'MED-005',
    name: 'Lipitor (Atorvastatin Calcium) 20mg',
    genericName: 'Atorvastatin',
    manufacturer: 'Pfizer Global Health',
    dosageForm: '20mg Film-Coated Tablet',
    atcCode: 'C10AA05',
    description: 'HMG-CoA reductase inhibitor for hypercholesterolemia.'
  }
];

// Helper to generate deterministic 128-dimensional embedding
export function generate128dVector(seedKey) {
  const vec = [];
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) & 0xffffffff;
  }
  for (let i = 0; i < 128; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const val = (seed / 233280) * 2 - 1;
    vec.push(parseFloat(val.toFixed(4)));
  }
  // Normalize to unit L2 norm
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return vec.map(v => parseFloat((v / norm).toFixed(4)));
}

// Master Packages with Fingerprints
export const packages = [
  {
    id: 'PKG-2026-9041',
    packageId: 'PHARMA-9041',
    medicineId: 'MED-001',
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
    embedding: generate128dVector('PHARMA-9041-NC-26B-991'),
    registeredAt: '2026-03-01T10:14:22Z',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Geneva, Switzerland', lat: 46.2044, lng: 6.1432 }
  },
  {
    id: 'PKG-2026-8812',
    packageId: 'PHARMA-8812',
    medicineId: 'MED-002',
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
    embedding: generate128dVector('PHARMA-8812-AX-AMX-204'),
    registeredAt: '2026-02-12T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 }
  },
  {
    id: 'PKG-2026-7734',
    packageId: 'PHARMA-7734',
    medicineId: 'MED-003',
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
    embedding: generate128dVector('PHARMA-7734-NH-SEM-502'),
    registeredAt: '2026-03-15T08:20:10Z',
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683 }
  },
  {
    id: 'PKG-2026-6510',
    packageId: 'PHARMA-6510',
    medicineId: 'MED-004',
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
    embedding: generate128dVector('PHARMA-6510-AEG-RDV-118'),
    registeredAt: '2026-03-05T11:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1579165466791-78818925567b?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Boston, MA, USA', lat: 42.3601, lng: -71.0589 }
  },
  {
    id: 'PKG-2026-5421',
    packageId: 'PHARMA-5421',
    medicineId: 'MED-005',
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
    embedding: generate128dVector('PHARMA-5421-PF-LIP-9904'),
    registeredAt: '2026-01-20T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=80',
    registeredLocation: { city: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603 }
  }
];

// Scan History Audit Log
export const scanHistory = [
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
  }
];

// DBSCAN Counterfeit Family Clusters
export const counterfeitClusters = [
  {
    id: 'CF-804',
    clusterName: 'Counterfeit Family #CF-804: "Sub-Continental Gravure Offset"',
    defectPattern: 'Distorted micro-logo, misaligned batch typography, and low-viscosity blister ink bleeding.',
    algorithm: 'DBSCAN (eps=0.28, min_samples=3)',
    flaggedPackagesCount: 14,
    affectedMedicines: ['Paracetamol 500mg', 'Remdesivir 100mg'],
    intraClusterSimilarity: 0.942,
    detectionDate: '2026-11-12',
    status: 'UNDER_INVESTIGATION',
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

// Geo-Temporal Impossible Travel Alerts
export const geoAlerts = [
  {
    id: 'GEO-ALT-101',
    packageId: 'PHARMA-7734',
    medicineName: 'Ozempic (Semaglutide) 1mg Pen',
    batchNumber: 'NH-SEM-502',
    timestamp: '2026-11-15T18:15:30Z',
    severity: 'CRITICAL',
    status: 'ACTIVE_ALERT',
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

export const systemAnalytics = {
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
