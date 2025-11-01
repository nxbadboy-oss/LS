import { Router, Request, Response } from 'express';
import db from '../database/db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 获取母基金的所有子基金
 * GET /api/fund-relationships/master/:masterFundId
 */
router.get('/master/:masterFundId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { masterFundId } = req.params;

    // 获取子基金列表及其关联信息
    const subFunds = db
      .prepare(
        `
      SELECT
        f.*,
        fr.allocation_ratio,
        fr.target_allocation,
        fr.min_allocation,
        fr.max_allocation,
        fr.id as relationship_id
      FROM funds f
      INNER JOIN fund_relationships fr ON f.id = fr.sub_fund_id
      WHERE fr.master_fund_id = ? AND fr.status = 'ACTIVE'
      ORDER BY fr.allocation_ratio DESC
    `
      )
      .all(masterFundId);

    // 计算总配置比例
    const totalAllocation = subFunds.reduce(
      (sum: number, fund: any) => sum + (fund.allocation_ratio || 0),
      0
    );

    res.json({
      success: true,
      data: {
        subFunds,
        totalAllocation,
        isBalanced: Math.abs(totalAllocation - 1.0) < 0.01,
      },
    });
  } catch (error: any) {
    console.error('Error fetching sub funds:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取子基金所属的母基金
 * GET /api/fund-relationships/sub/:subFundId
 */
router.get('/sub/:subFundId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { subFundId } = req.params;

    const masterFunds = db
      .prepare(
        `
      SELECT
        f.*,
        fr.allocation_ratio,
        fr.id as relationship_id
      FROM funds f
      INNER JOIN fund_relationships fr ON f.id = fr.master_fund_id
      WHERE fr.sub_fund_id = ? AND fr.status = 'ACTIVE'
    `
      )
      .all(subFundId);

    res.json({
      success: true,
      data: masterFunds,
    });
  } catch (error: any) {
    console.error('Error fetching master funds:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取母基金的合并统计数据
 * GET /api/fund-relationships/master/:masterFundId/consolidated
 */
router.get('/master/:masterFundId/consolidated', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { masterFundId } = req.params;

    // 获取母基金信息
    const masterFund: any = db
      .prepare('SELECT * FROM funds WHERE id = ? AND fund_category = ?')
      .get(masterFundId, 'MASTER');

    if (!masterFund) {
      return res.status(404).json({ success: false, message: 'Master fund not found' });
    }

    // 获取所有子基金及其配置
    const subFunds = db
      .prepare(
        `
      SELECT
        f.*,
        fr.allocation_ratio
      FROM funds f
      INNER JOIN fund_relationships fr ON f.id = fr.sub_fund_id
      WHERE fr.master_fund_id = ? AND fr.status = 'ACTIVE'
    `
      )
      .all(masterFundId);

    // 计算加权平均净值
    let weightedNav = 0;
    let totalWeight = 0;
    let consolidatedAssets = 0;
    let consolidatedShares = 0;

    subFunds.forEach((fund: any) => {
      const weight = fund.allocation_ratio || 0;
      weightedNav += fund.nav * weight;
      totalWeight += weight;
      consolidatedAssets += (fund.total_assets || 0) * weight;
      consolidatedShares += (fund.total_shares || 0) * weight;
    });

    const avgNav = totalWeight > 0 ? weightedNav / totalWeight : 0;

    // 获取最近30天的合并净值历史
    const consolidatedNavHistory = [];
    const dates = db
      .prepare(
        `
      SELECT DISTINCT nav_date
      FROM nav_history
      WHERE fund_id IN (
        SELECT sub_fund_id FROM fund_relationships WHERE master_fund_id = ?
      )
      ORDER BY nav_date DESC
      LIMIT 30
    `
      )
      .all(masterFundId);

    for (const dateRow: any of dates) {
      const date = dateRow.nav_date;

      // 获取该日期所有子基金的净值
      const navs = db
        .prepare(
          `
        SELECT nh.nav, fr.allocation_ratio
        FROM nav_history nh
        INNER JOIN fund_relationships fr ON nh.fund_id = fr.sub_fund_id
        WHERE fr.master_fund_id = ? AND nh.nav_date = ?
      `
        )
        .all(masterFundId, date);

      if (navs.length > 0) {
        let dayWeightedNav = 0;
        let dayTotalWeight = 0;

        navs.forEach((nav: any) => {
          dayWeightedNav += nav.nav * nav.allocation_ratio;
          dayTotalWeight += nav.allocation_ratio;
        });

        consolidatedNavHistory.push({
          nav_date: date,
          nav: dayTotalWeight > 0 ? dayWeightedNav / dayTotalWeight : 0,
        });
      }
    }

    res.json({
      success: true,
      data: {
        masterFund,
        subFundsCount: subFunds.length,
        consolidatedData: {
          weightedAverageNav: parseFloat(avgNav.toFixed(4)),
          totalAssets: consolidatedAssets,
          totalShares: consolidatedShares,
          totalAllocationRatio: totalWeight,
        },
        subFunds,
        navHistory: consolidatedNavHistory.reverse(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching consolidated data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新子基金配置比例（GP管理员权限）
 * PUT /api/fund-relationships/:relationshipId
 */
router.put('/:relationshipId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    // 检查权限
    if (req.user?.role !== 'GP_ADMIN') {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const { relationshipId } = req.params;
    const { allocation_ratio, target_allocation, min_allocation, max_allocation } = req.body;

    // 验证配置比例
    if (allocation_ratio !== undefined && (allocation_ratio < 0 || allocation_ratio > 1)) {
      return res.status(400).json({ success: false, message: 'Invalid allocation ratio' });
    }

    const updateStmt = db.prepare(`
      UPDATE fund_relationships
      SET allocation_ratio = COALESCE(?, allocation_ratio),
          target_allocation = COALESCE(?, target_allocation),
          min_allocation = COALESCE(?, min_allocation),
          max_allocation = COALESCE(?, max_allocation),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = updateStmt.run(
      allocation_ratio,
      target_allocation,
      min_allocation,
      max_allocation,
      relationshipId
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Relationship not found' });
    }

    // 获取更新后的关联关系
    const updated = db.prepare('SELECT * FROM fund_relationships WHERE id = ?').get(relationshipId);

    res.json({
      success: true,
      message: 'Fund relationship updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating fund relationship:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 检查母基金配置是否需要再平衡
 * GET /api/fund-relationships/master/:masterFundId/rebalance-check
 */
router.get('/master/:masterFundId/rebalance-check', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { masterFundId } = req.params;

    const relationships: any[] = db
      .prepare(
        `
      SELECT
        fr.*,
        f.fund_name,
        f.fund_code
      FROM fund_relationships fr
      INNER JOIN funds f ON fr.sub_fund_id = f.id
      WHERE fr.master_fund_id = ? AND fr.status = 'ACTIVE'
    `
      )
      .all(masterFundId);

    const needsRebalancing = [];

    for (const rel of relationships) {
      const deviation = Math.abs(rel.allocation_ratio - rel.target_allocation);

      if (deviation > (rel.rebalance_threshold || 0.05)) {
        needsRebalancing.push({
          fund_name: rel.fund_name,
          fund_code: rel.fund_code,
          current_allocation: rel.allocation_ratio,
          target_allocation: rel.target_allocation,
          deviation,
          action: rel.allocation_ratio > rel.target_allocation ? 'REDUCE' : 'INCREASE',
        });
      }
    }

    res.json({
      success: true,
      data: {
        needsRebalancing: needsRebalancing.length > 0,
        rebalanceItems: needsRebalancing,
      },
    });
  } catch (error: any) {
    console.error('Error checking rebalance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
