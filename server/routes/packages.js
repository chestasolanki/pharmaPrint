import express from 'express';
import { packages, generate128dVector } from '../data/seedData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(packages);
});

router.get('/:id', (req, res) => {
  const pkg = packages.find(p => p.id === req.params.id || p.packageId === req.params.id);
  if (!pkg) return res.status(404).json({ error: 'Package not found' });
  res.json(pkg);
});

router.post('/register', (req, res) => {
  const {
    medicineName,
    genericName,
    manufacturer,
    batchNumber,
    packageId,
    mfgDate,
    expDate,
    dosage,
    imageUrl,
    location
  } = req.body;

  const pkgId = packageId || `PHARMA-${Math.floor(1000 + Math.random() * 9000)}`;
  const embedding = generate128dVector(`${pkgId}-${batchNumber}`);

  const newPackage = {
    id: `PKG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    packageId: pkgId,
    medicineName,
    genericName,
    manufacturer,
    batchNumber,
    mfgDate,
    expDate,
    dosage: dosage || 'Standard Unit Dose',
    status: 'ACTIVE',
    fingerprintId: `FP-${pkgId}-V1`,
    embeddingVersion: 'v1.4-siamese-128d',
    embedding,
    registeredAt: new Date().toISOString(),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    registeredLocation: location || { city: 'Geneva, Switzerland', lat: 46.2044, lng: 6.1432 }
  };

  packages.unshift(newPackage);
  res.status(201).json({ success: true, package: newPackage });
});

export default router;
