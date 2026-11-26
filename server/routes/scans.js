import express from 'express';
import { scanHistory } from '../data/seedData.js';

const router = express.Router();

router.get('/history', (req, res) => {
  res.json(scanHistory);
});

router.get('/:id', (req, res) => {
  const scan = scanHistory.find(s => s.id === req.params.id);
  if (!scan) return res.status(404).json({ error: 'Scan not found' });
  res.json(scan);
});

export default router;
