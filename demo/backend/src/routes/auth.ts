import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'demo-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Get investor info if LP
    let investorInfo = null;
    if (user.role === 'LP_INVESTOR') {
      investorInfo = db.prepare('SELECT * FROM investors WHERE user_id = ?').get(user.id);
    }

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        },
        investor: investorInfo
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  try {
    const user = db.prepare('SELECT id, username, name, email, role FROM users WHERE id = ?')
      .get(req.user!.id) as any;

    let investorInfo = null;
    if (user.role === 'LP_INVESTOR') {
      investorInfo = db.prepare('SELECT * FROM investors WHERE user_id = ?').get(user.id);
    }

    res.json({
      success: true,
      data: {
        user,
        investor: investorInfo
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
