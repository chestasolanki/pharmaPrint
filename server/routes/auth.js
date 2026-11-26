import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pharmaprint_secret_jwt_key_2026';

router.post('/login', (req, res) => {
  const { email, role = 'Pharmacist' } = req.body;
  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    token,
    user: {
      email,
      role,
      name: email ? email.split('@')[0] : 'Pharmacist Node',
      organization: 'Verified Pharma Dispensary'
    }
  });
});

router.post('/register', (req, res) => {
  const { name, email, organization, role = 'Pharmacist' } = req.body;
  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: {
      name,
      email,
      organization,
      role
    }
  });
});

export default router;
