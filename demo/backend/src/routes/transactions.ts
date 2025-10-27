import express from 'express';
import db from '../database/db';
import { authMiddleware, AuthRequest, roleMiddleware } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = express.Router();

// Get subscriptions
router.get('/subscriptions', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { status, investorId } = req.query;

    let sql = `
      SELECT s.*, f.fund_name, f.fund_code, i.name as investor_name
      FROM subscriptions s
      JOIN funds f ON s.fund_id = f.id
      JOIN investors i ON s.investor_id = i.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // LP can only see their own
    if (req.user!.role === 'LP_INVESTOR') {
      const investor = db.prepare('SELECT id FROM investors WHERE user_id = ?').get(req.user!.id) as any;
      sql += ' AND s.investor_id = ?';
      params.push(investor.id);
    } else if (investorId) {
      sql += ' AND s.investor_id = ?';
      params.push(investorId);
    }

    if (status) {
      sql += ' AND s.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY s.apply_date DESC';

    const subscriptions = db.prepare(sql).all(...params);

    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create subscription
router.post('/subscriptions', authMiddleware, roleMiddleware('LP_INVESTOR'), async (req: AuthRequest, res) => {
  try {
    const { fundId, amount } = req.body;

    if (!fundId || !amount) {
      return res.status(400).json({ success: false, message: 'Fund ID and amount required' });
    }

    // Get investor
    const investor = db.prepare('SELECT * FROM investors WHERE user_id = ?').get(req.user!.id) as any;
    if (!investor) {
      return res.status(404).json({ success: false, message: 'Investor not found' });
    }

    // Get fund
    const fund = db.prepare('SELECT * FROM funds WHERE id = ?').get(fundId) as any;
    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }

    // Check minimum amount
    if (amount < fund.min_subscription_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum subscription amount is ${fund.min_subscription_amount}`
      });
    }

    // Calculate fees
    const subscriptionFee = amount * fund.subscription_fee_rate;
    const netAmount = amount - subscriptionFee;

    // Generate order number
    const orderNumber = `SUB${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Insert subscription
    const id = randomUUID();
    db.prepare(`
      INSERT INTO subscriptions (id, order_number, investor_id, fund_id, subscription_amount, subscription_fee, net_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `).run(id, orderNumber, investor.id, fundId, amount, subscriptionFee, netAmount);

    res.json({
      success: true,
      data: {
        id,
        orderNumber,
        subscriptionAmount: amount,
        subscriptionFee,
        netAmount,
        estimatedShares: netAmount / fund.nav
      },
      message: 'Subscription submitted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Confirm subscription (GP only)
router.patch('/subscriptions/:id/confirm', authMiddleware, roleMiddleware('GP_ADMIN', 'GP_OPERATOR'), (req: AuthRequest, res) => {
  try {
    const { nav, shares } = req.body;

    if (!nav || !shares) {
      return res.status(400).json({ success: false, message: 'NAV and shares required' });
    }

    const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(req.params.id) as any;

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Subscription already processed' });
    }

    // Begin transaction
    const updateSubscription = db.prepare(`
      UPDATE subscriptions
      SET status = 'CONFIRMED', confirmed_shares = ?, nav = ?, confirm_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    // Update or create holding
    const existingHolding = db.prepare('SELECT * FROM holdings WHERE investor_id = ? AND fund_id = ?')
      .get(subscription.investor_id, subscription.fund_id) as any;

    if (existingHolding) {
      db.prepare(`
        UPDATE holdings
        SET total_shares = total_shares + ?,
            available_shares = available_shares + ?,
            total_cost = total_cost + ?,
            market_value = (total_shares + ?) * ?,
            unrealized_profit = market_value - (total_cost + ?),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        shares,
        shares,
        subscription.subscription_amount,
        shares,
        nav,
        subscription.subscription_amount,
        existingHolding.id
      );
    } else {
      db.prepare(`
        INSERT INTO holdings (id, investor_id, fund_id, total_shares, available_shares, total_cost, market_value, unrealized_profit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        subscription.investor_id,
        subscription.fund_id,
        shares,
        shares,
        subscription.subscription_amount,
        shares * nav,
        (shares * nav) - subscription.subscription_amount
      );
    }

    // Update subscription
    updateSubscription.run(shares, nav, req.params.id);

    // Update investor stats
    db.prepare(`
      UPDATE investors
      SET total_investment = total_investment + ?,
          total_market_value = total_market_value + ?
      WHERE id = ?
    `).run(subscription.subscription_amount, shares * nav, subscription.investor_id);

    res.json({
      success: true,
      message: 'Subscription confirmed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get redemptions
router.get('/redemptions', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { status, investorId } = req.query;

    let sql = `
      SELECT r.*, f.fund_name, f.fund_code, i.name as investor_name
      FROM redemptions r
      JOIN funds f ON r.fund_id = f.id
      JOIN investors i ON r.investor_id = i.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // LP can only see their own
    if (req.user!.role === 'LP_INVESTOR') {
      const investor = db.prepare('SELECT id FROM investors WHERE user_id = ?').get(req.user!.id) as any;
      sql += ' AND r.investor_id = ?';
      params.push(investor.id);
    } else if (investorId) {
      sql += ' AND r.investor_id = ?';
      params.push(investorId);
    }

    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY r.apply_date DESC';

    const redemptions = db.prepare(sql).all(...params);

    res.json({
      success: true,
      data: redemptions
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create redemption
router.post('/redemptions', authMiddleware, roleMiddleware('LP_INVESTOR'), async (req: AuthRequest, res) => {
  try {
    const { fundId, shares } = req.body;

    if (!fundId || !shares) {
      return res.status(400).json({ success: false, message: 'Fund ID and shares required' });
    }

    // Get investor
    const investor = db.prepare('SELECT * FROM investors WHERE user_id = ?').get(req.user!.id) as any;

    // Check holding
    const holding = db.prepare('SELECT * FROM holdings WHERE investor_id = ? AND fund_id = ?')
      .get(investor.id, fundId) as any;

    if (!holding || holding.available_shares < shares) {
      return res.status(400).json({ success: false, message: 'Insufficient shares' });
    }

    // Get fund
    const fund = db.prepare('SELECT * FROM funds WHERE id = ?').get(fundId) as any;

    // Generate order number
    const orderNumber = `RED${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Insert redemption
    const id = randomUUID();
    db.prepare(`
      INSERT INTO redemptions (id, order_number, investor_id, fund_id, redemption_shares, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `).run(id, orderNumber, investor.id, fundId, shares);

    res.json({
      success: true,
      data: {
        id,
        orderNumber,
        redemptionShares: shares,
        estimatedAmount: shares * fund.nav * (1 - fund.redemption_fee_rate)
      },
      message: 'Redemption submitted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
