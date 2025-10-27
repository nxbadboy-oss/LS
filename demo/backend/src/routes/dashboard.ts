import express from 'express';
import db from '../database/db';
import { authMiddleware, AuthRequest, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// GP Dashboard
router.get('/gp', authMiddleware, roleMiddleware('GP_ADMIN', 'GP_OPERATOR'), (req: AuthRequest, res) => {
  try {
    // Get total funds
    const totalFunds = db.prepare('SELECT COUNT(*) as count FROM funds WHERE status = "ACTIVE"').get() as any;

    // Get total investors
    const totalInvestors = db.prepare('SELECT COUNT(*) as count FROM investors').get() as any;

    // Get total AUM
    const totalAUM = db.prepare('SELECT SUM(total_assets) as total FROM funds WHERE status = "ACTIVE"').get() as any;

    // Get pending subscriptions
    const pendingSubscriptions = db.prepare('SELECT COUNT(*) as count FROM subscriptions WHERE status = "PENDING"').get() as any;

    // Get pending redemptions
    const pendingRedemptions = db.prepare('SELECT COUNT(*) as count FROM redemptions WHERE status = "PENDING"').get() as any;

    // Get recent transactions
    const recentTransactions = db.prepare(`
      SELECT
        s.id,
        s.order_number,
        i.name as investor_name,
        f.fund_name,
        'SUBSCRIPTION' as type,
        s.subscription_amount as amount,
        s.status,
        s.apply_date as date
      FROM subscriptions s
      JOIN investors i ON s.investor_id = i.id
      JOIN funds f ON s.fund_id = f.id
      ORDER BY s.apply_date DESC
      LIMIT 10
    `).all();

    // Get fund performance
    const fundPerformance = db.prepare(`
      SELECT
        id,
        fund_name,
        fund_code,
        nav,
        accumulated_nav,
        total_assets,
        (accumulated_nav - 1) * 100 as total_return
      FROM funds
      WHERE status = 'ACTIVE'
      ORDER BY total_assets DESC
    `).all();

    res.json({
      success: true,
      data: {
        summary: {
          totalFunds: totalFunds.count,
          totalInvestors: totalInvestors.count,
          totalAUM: totalAUM.total || 0,
          pendingSubscriptions: pendingSubscriptions.count,
          pendingRedemptions: pendingRedemptions.count
        },
        recentTransactions,
        fundPerformance
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// LP Dashboard
router.get('/lp', authMiddleware, roleMiddleware('LP_INVESTOR'), (req: AuthRequest, res) => {
  try {
    // Get investor
    const investor = db.prepare('SELECT * FROM investors WHERE user_id = ?').get(req.user!.id) as any;

    if (!investor) {
      return res.status(404).json({ success: false, message: 'Investor not found' });
    }

    // Get holdings
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
    `).all(investor.id);

    // Calculate totals
    let totalInvestment = 0;
    let totalMarketValue = 0;
    let totalProfit = 0;

    holdings.forEach((h: any) => {
      totalInvestment += h.total_cost;
      totalMarketValue += h.market_value;
      totalProfit += h.unrealized_profit;
    });

    const returnRate = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

    // Get asset allocation
    const assetAllocation = holdings.map((h: any) => ({
      fundType: h.fund_type,
      fundName: h.fund_name,
      value: h.market_value,
      percentage: totalMarketValue > 0 ? (h.market_value / totalMarketValue) * 100 : 0
    }));

    // Get recent transactions
    const recentTransactions = db.prepare(`
      SELECT
        s.id,
        s.order_number,
        f.fund_name,
        'SUBSCRIPTION' as type,
        s.subscription_amount as amount,
        s.status,
        s.apply_date as date
      FROM subscriptions s
      JOIN funds f ON s.fund_id = f.id
      WHERE s.investor_id = ?
      ORDER BY s.apply_date DESC
      LIMIT 5
    `).all(investor.id);

    // Get performance history (last 30 days)
    const performanceHistory: any[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Calculate historical value (simplified - using current holdings)
      let dayValue = 0;
      holdings.forEach((h: any) => {
        const navOnDate = db.prepare('SELECT nav FROM nav_history WHERE fund_id = ? AND nav_date = ?')
          .get(h.fund_id, dateStr) as any;

        if (navOnDate) {
          dayValue += h.total_shares * navOnDate.nav;
        }
      });

      if (dayValue > 0) {
        performanceHistory.push({
          date: dateStr,
          value: Number(dayValue.toFixed(2))
        });
      }
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalInvestment: Number(totalInvestment.toFixed(2)),
          totalMarketValue: Number(totalMarketValue.toFixed(2)),
          totalProfit: Number(totalProfit.toFixed(2)),
          returnRate: Number(returnRate.toFixed(2))
        },
        holdings,
        assetAllocation,
        performanceHistory,
        recentTransactions
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
