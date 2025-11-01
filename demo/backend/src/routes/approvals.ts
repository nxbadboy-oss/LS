import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import db from '../database/db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 获取待审批列表（GP管理员和操作员）
 * GET /api/approvals?status=PENDING&type=SUBSCRIPTION
 */
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    // 检查权限
    if (!['GP_ADMIN', 'GP_OPERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const { status, type, priority } = req.query;

    let query = `
      SELECT
        a.*,
        i.name as investor_name,
        i.investor_code,
        f.fund_name,
        f.fund_code,
        u.name as submitted_by_name
      FROM approvals a
      LEFT JOIN investors i ON a.investor_id = i.id
      LEFT JOIN funds f ON a.fund_id = f.id
      LEFT JOIN users u ON a.submitted_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND a.transaction_type = ?';
      params.push(type);
    }

    if (priority) {
      query += ' AND a.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY a.submitted_at DESC';

    const approvals = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: approvals,
    });
  } catch (error: any) {
    console.error('Error fetching approvals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取审批详情
 * GET /api/approvals/:id
 */
router.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (!['GP_ADMIN', 'GP_OPERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const { id } = req.params;

    const approval: any = db
      .prepare(
        `
      SELECT
        a.*,
        i.name as investor_name,
        i.investor_code,
        i.email as investor_email,
        i.phone as investor_phone,
        f.fund_name,
        f.fund_code,
        f.nav as current_nav,
        u.name as submitted_by_name
      FROM approvals a
      LEFT JOIN investors i ON a.investor_id = i.id
      LEFT JOIN funds f ON a.fund_id = f.id
      LEFT JOIN users u ON a.submitted_by = u.id
      WHERE a.id = ?
    `
      )
      .get(id);

    if (!approval) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }

    // 获取交易详情
    let transactionDetails = null;

    if (approval.transaction_type === 'SUBSCRIPTION') {
      transactionDetails = db
        .prepare('SELECT * FROM subscriptions WHERE id = ?')
        .get(approval.transaction_id);
    } else if (approval.transaction_type === 'REDEMPTION') {
      transactionDetails = db
        .prepare('SELECT * FROM redemptions WHERE id = ?')
        .get(approval.transaction_id);
    }

    res.json({
      success: true,
      data: {
        approval,
        transactionDetails,
      },
    });
  } catch (error: any) {
    console.error('Error fetching approval details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 审批通过
 * POST /api/approvals/:id/approve
 */
router.post('/:id/approve', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    // 只有GP管理员可以审批
    if (req.user?.role !== 'GP_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only GP Admin can approve' });
    }

    const { id } = req.params;
    const { approval_notes } = req.body;

    // 获取审批信息
    const approval: any = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id);

    if (!approval) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }

    if (approval.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Approval already processed' });
    }

    // 开始事务
    const updateApproval = db.prepare(`
      UPDATE approvals
      SET status = 'APPROVED',
          approved_by = ?,
          processed_at = CURRENT_TIMESTAMP,
          approval_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    // 更新对应的交易记录状态
    let updateTransaction;

    if (approval.transaction_type === 'SUBSCRIPTION') {
      updateTransaction = db.prepare(`
        UPDATE subscriptions
        SET status = 'APPROVED',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            approval_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
    } else if (approval.transaction_type === 'REDEMPTION') {
      updateTransaction = db.prepare(`
        UPDATE redemptions
        SET status = 'APPROVED',
            approved_by = ?,
            approved_at = CURRENT_TIMESTAMP,
            approval_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    // 执行更新
    db.transaction(() => {
      updateApproval.run(req.user?.id, approval_notes || null, id);
      updateTransaction.run(req.user?.id, approval_notes || null, approval.transaction_id);

      // 创建通知给投资者
      const investor: any = db.prepare('SELECT user_id FROM investors WHERE id = ?').get(approval.investor_id);

      if (investor && investor.user_id) {
        const notificationStmt = db.prepare(`
          INSERT INTO notifications (id, user_id, title, content, type, category, related_type, related_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const title = approval.transaction_type === 'SUBSCRIPTION' ? '申购申请已批准' : '赎回申请已批准';
        const content = `您的${approval.fund_name || '基金'}${approval.transaction_type === 'SUBSCRIPTION' ? '申购' : '赎回'}申请已获批准，等待份额确认。`;

        notificationStmt.run(
          randomUUID(),
          investor.user_id,
          title,
          content,
          'SUCCESS',
          'TRANSACTION',
          approval.transaction_type,
          approval.transaction_id
        );
      }
    })();

    res.json({
      success: true,
      message: 'Approval processed successfully',
    });
  } catch (error: any) {
    console.error('Error approving transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 审批拒绝
 * POST /api/approvals/:id/reject
 */
router.post('/:id/reject', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'GP_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only GP Admin can reject' });
    }

    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!rejection_reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const approval: any = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id);

    if (!approval) {
      return res.status(404).json({ success: false, message: 'Approval not found' });
    }

    if (approval.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Approval already processed' });
    }

    // 更新审批记录
    const updateApproval = db.prepare(`
      UPDATE approvals
      SET status = 'REJECTED',
          approved_by = ?,
          processed_at = CURRENT_TIMESTAMP,
          rejection_reason = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    // 更新交易记录
    let updateTransaction;

    if (approval.transaction_type === 'SUBSCRIPTION') {
      updateTransaction = db.prepare(`
        UPDATE subscriptions
        SET status = 'REJECTED',
            approval_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
    } else if (approval.transaction_type === 'REDEMPTION') {
      updateTransaction = db.prepare(`
        UPDATE redemptions
        SET status = 'REJECTED',
            approval_notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transaction type' });
    }

    // 执行更新
    db.transaction(() => {
      updateApproval.run(req.user?.id, rejection_reason, id);
      updateTransaction.run(rejection_reason, approval.transaction_id);

      // 通知投资者
      const investor: any = db.prepare('SELECT user_id FROM investors WHERE id = ?').get(approval.investor_id);

      if (investor && investor.user_id) {
        const notificationStmt = db.prepare(`
          INSERT INTO notifications (id, user_id, title, content, type, category, related_type, related_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const title = approval.transaction_type === 'SUBSCRIPTION' ? '申购申请已拒绝' : '赎回申请已拒绝';
        const content = `您的${approval.fund_name || '基金'}${approval.transaction_type === 'SUBSCRIPTION' ? '申购' : '赎回'}申请已被拒绝。原因：${rejection_reason}`;

        notificationStmt.run(
          randomUUID(),
          investor.user_id,
          title,
          content,
          'ERROR',
          'TRANSACTION',
          approval.transaction_type,
          approval.transaction_id
        );
      }
    })();

    res.json({
      success: true,
      message: 'Approval rejected successfully',
    });
  } catch (error: any) {
    console.error('Error rejecting transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 批量审批
 * POST /api/approvals/batch-approve
 */
router.post('/batch-approve', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'GP_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only GP Admin can approve' });
    }

    const { approval_ids, approval_notes } = req.body;

    if (!Array.isArray(approval_ids) || approval_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid approval IDs' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // 逐个处理审批
    for (const approvalId of approval_ids) {
      try {
        const approval: any = db.prepare('SELECT * FROM approvals WHERE id = ? AND status = ?').get(approvalId, 'PENDING');

        if (!approval) {
          results.failed++;
          results.errors.push(`Approval ${approvalId} not found or already processed`);
          continue;
        }

        // 更新审批
        db.prepare(`
          UPDATE approvals
          SET status = 'APPROVED',
              approved_by = ?,
              processed_at = CURRENT_TIMESTAMP,
              approval_notes = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(req.user?.id, approval_notes || null, approvalId);

        // 更新交易
        if (approval.transaction_type === 'SUBSCRIPTION') {
          db.prepare(`
            UPDATE subscriptions
            SET status = 'APPROVED',
                approved_by = ?,
                approved_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(req.user?.id, approval.transaction_id);
        } else if (approval.transaction_type === 'REDEMPTION') {
          db.prepare(`
            UPDATE redemptions
            SET status = 'APPROVED',
                approved_by = ?,
                approved_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(req.user?.id, approval.transaction_id);
        }

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Error processing ${approvalId}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Batch approval completed: ${results.success} succeeded, ${results.failed} failed`,
      data: results,
    });
  } catch (error: any) {
    console.error('Error in batch approval:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取审批统计
 * GET /api/approvals/stats
 */
router.get('/stats/summary', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    if (!['GP_ADMIN', 'GP_OPERATOR'].includes(req.user?.role || '')) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // 按状态统计
    const byStatus = db
      .prepare(
        `
      SELECT status, COUNT(*) as count
      FROM approvals
      GROUP BY status
    `
      )
      .all();

    // 按类型统计
    const byType = db
      .prepare(
        `
      SELECT transaction_type, COUNT(*) as count
      FROM approvals
      WHERE status = 'PENDING'
      GROUP BY transaction_type
    `
      )
      .all();

    // 今日待审批
    const todayPending: any = db
      .prepare(
        `
      SELECT COUNT(*) as count
      FROM approvals
      WHERE status = 'PENDING' AND DATE(submitted_at) = DATE('now')
    `
      )
      .get();

    // 最近7天审批量
    const last7Days = db
      .prepare(
        `
      SELECT
        DATE(processed_at) as date,
        COUNT(*) as count
      FROM approvals
      WHERE processed_at >= DATE('now', '-7 days')
      GROUP BY DATE(processed_at)
      ORDER BY date DESC
    `
      )
      .all();

    res.json({
      success: true,
      data: {
        byStatus,
        byType,
        todayPending: todayPending?.count || 0,
        last7Days,
      },
    });
  } catch (error: any) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
