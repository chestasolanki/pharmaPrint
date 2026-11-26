import express from 'express';
import { medicines } from '../data/seedData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(medicines);
});

router.post('/', (req, res) => {
  const newMed = {
    id: `MED-00${medicines.length + 1}`,
    ...req.body
  };
  medicines.push(newMed);
  res.status(201).json(newMed);
});

export default router;
