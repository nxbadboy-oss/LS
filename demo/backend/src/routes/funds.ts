import express from 'express';
import db from '../database/db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all funds
router.get('/', authMiddleware, (req, res) => {
  try {
    const { status, type } = req.query;

    let sql = 'SELECT * FROM funds WHERE 1=1';
    const params: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (type) {
      sql += ' AND fund_type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const funds = db.prepare(sql).all(...params);

    res.json({
      success: true,
      data: funds
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get fund by ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const fund = db.prepare('SELECT * FROM funds WHERE id = ?').get(req.params.id);

    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }

    // Get latest NAV history
    const latestNavs = db.prepare(`
      SELECT * FROM nav_history
      WHERE fund_id = ?
      ORDER BY nav_date DESC
      LIMIT 10
    `).all(req.params.id);

    res.json({
      success: true,
      data: {
        ...fund,
        recentNavs: latestNavs
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get fund NAV history
router.get('/:id/nav', authMiddleware, (req, res) => {
  try {
    const { startDate, endDate, limit = 90 } = req.query;

    let sql = 'SELECT * FROM nav_history WHERE fund_id = ?';
    const params: any[] = [req.params.id];

    if (startDate) {
      sql += ' AND nav_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND nav_date <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY nav_date DESC LIMIT ?';
    params.push(Number(limit));

    const navHistory = db.prepare(sql).all(...params);

    res.json({
      success: true,
      data: navHistory.reverse() // 从旧到新排序，方便图表展示
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
