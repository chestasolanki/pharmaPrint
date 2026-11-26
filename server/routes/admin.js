import express from 'express';
import { counterfeitClusters, geoAlerts, systemAnalytics, packages, scanHistory } from '../data/seedData.js';

const router = express.Router();

router.get('/analytics', (req, res) => {
  const dynamicAnalytics = {
    ...systemAnalytics,
    totalRegisteredPackages: packages.length + 14275,
    totalScans: scanHistory.length + 89415,
  };
  res.json(dynamicAnalytics);
});

router.get('/clusters', (req, res) => {
  res.json(counterfeitClusters);
});

router.patch('/clusters/:id/status', (req, res) => {
  const cluster = counterfeitClusters.find(c => c.id === req.params.id);
  if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
  cluster.status = req.body.status || cluster.status;
  res.json({ success: true, cluster });
});

router.get('/geo-alerts', (req, res) => {
  res.json(geoAlerts);
});

router.patch('/geo-alerts/:id', (req, res) => {
  const alert = geoAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  Object.assign(alert, req.body);
  res.json({ success: true, alert });
});

export default router;
