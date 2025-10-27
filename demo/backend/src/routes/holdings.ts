import express from 'express';
import db from '../database/db';
import { authMiddleware, AuthRequest, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get holdings
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    // Get investor ID
    let investorId = req.query.investorId as string;

    if (req.user!.role === 'LP_INVESTOR') {
      const investor = db.prepare('SELECT id FROM investors WHERE user_id = ?').get(req.user!.id) as any;
      investorId = investor.id;
    }

    if (!investorId) {
      return res.status(400).json({ success: false, message: 'Investor ID required' });
    }

    const holdings = db.prepare(`
      SELECT
        h.*,
        f.fund_name,
        f.fund_code,
        f.fund_type,
        f.nav as current_nav
      FROM holdings h
      JOIN funds f ON h.fund_id = f.id
      WHERE h.investor_id = ?
      ORDER BY h.updated_at DESC
    `).all(investorId);

    res.json({
      success: true,
      data: holdings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get holding detail
router.get('/:id', authMiddleware, (req: AuthRequest, res) => {
  try {
    const holding = db.prepare(`
      SELECT
        h.*,
        f.fund_name,
        f.fund_code,
        f.fund_type,
        f.nav as current_nav,
        f.accumulated_nav
      FROM holdings h
      JOIN funds f ON h.fund_id = f.id
      WHERE h.id = ?
    `).get(req.params.id) as any;

    if (!holding) {
      return res.status(404).json({ success: false, message: 'Holding not found' });
    }

    // Check permission for LP
    if (req.user!.role === 'LP_INVESTOR') {
      const investor = db.prepare('SELECT id FROM investors WHERE user_id = ?').get(req.user!.id) as any;
      if (holding.investor_id !== investor.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    // Get recent transactions
    const transactions = db.prepare(`
      SELECT 'SUBSCRIPTION' as type, order_number, subscription_amount as amount, confirmed_shares as shares, nav, status, apply_date as date
      FROM subscriptions
      WHERE investor_id = ? AND fund_id = ? AND status = 'CONFIRMED'
      UNION ALL
      SELECT 'REDEMPTION' as type, order_number, redemption_amount as amount, redemption_shares as shares, nav, status, apply_date as date
      FROM redemptions
      WHERE investor_id = ? AND fund_id = ? AND status = 'CONFIRMED'
      ORDER BY date DESC
      LIMIT 20
    `).all(holding.investor_id, holding.fund_id, holding.investor_id, holding.fund_id);

    res.json({
      success: true,
      data: {
        ...holding,
        transactions
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
