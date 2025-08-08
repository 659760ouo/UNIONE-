// routes/protected.js
import express from 'express';
import { authenticateUser } from '../../middleware/auth.js';

const router = express.Router();

// Protected route: Only accessible with a valid token
router.get('/profile', authenticateUser, (req, res) => {
  // Use the user data attached to req by the middleware
  res.json({
    message: 'Profile data',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Another protected route (e.g., admin-only)
router.get('/admin', authenticateUser, (req, res) => {
  // Add role-based check (optional)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  res.json({ message: 'Admin dashboard' });
});

export default router;