import db from './db';

/**
 * 数据库初始化 V2 - 支持母子基金架构
 * 新增功能：
 * - 母子基金关联
 * - 审批工作流
 * - 文档管理
 * - 操作日志
 * - 通知系统
 */
export function initDatabaseV2() {
  console.log('Initializing database V2 (Master-Feeder Fund Architecture)...');

  // ==================== 核心表 ====================

  // 用户表（增强版）
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      status TEXT DEFAULT 'ACTIVE',
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 基金表（增强版 - 支持母子基金）
  db.exec(`
    CREATE TABLE IF NOT EXISTS funds (
      id TEXT PRIMARY KEY,
      fund_code TEXT UNIQUE NOT NULL,
      fund_name TEXT NOT NULL,
      fund_name_en TEXT,
      fund_type TEXT NOT NULL,
      fund_category TEXT DEFAULT 'SUB',         -- MASTER(母基金)/SUB(子基金)
      nav REAL NOT NULL DEFAULT 1.0,
      accumulated_nav REAL NOT NULL DEFAULT 1.0,
      total_assets REAL DEFAULT 0,
      total_shares REAL DEFAULT 0,

      -- 费率结构
      management_fee_rate REAL DEFAULT 0.015,
      subscription_fee_rate REAL DEFAULT 0.015,
      redemption_fee_rate REAL DEFAULT 0.005,
      performance_fee_rate REAL DEFAULT 0.20,

      -- 限额设置
      min_subscription_amount REAL DEFAULT 1000,
      min_redemption_shares REAL DEFAULT 0,

      -- 基金详细信息
      manager_name TEXT,
      custodian TEXT,
      administrator TEXT,
      investment_strategy TEXT,
      investment_objective TEXT,
      benchmark TEXT,
      risk_level TEXT DEFAULT 'MODERATE',
      currency TEXT DEFAULT 'USD',

      -- 状态和日期
      status TEXT DEFAULT 'ACTIVE',
      inception_date DATE,
      fiscal_year_end TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 母子基金关联表（核心新增）
  db.exec(`
    CREATE TABLE IF NOT EXISTS fund_relationships (
      id TEXT PRIMARY KEY,
      master_fund_id TEXT NOT NULL,
      sub_fund_id TEXT NOT NULL,
      allocation_ratio REAL DEFAULT 0,
      target_allocation REAL,
      min_allocation REAL,
      max_allocation REAL,
      rebalance_threshold REAL DEFAULT 0.05,
      status TEXT DEFAULT 'ACTIVE',
      effective_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (master_fund_id) REFERENCES funds(id) ON DELETE CASCADE,
      FOREIGN KEY (sub_fund_id) REFERENCES funds(id) ON DELETE CASCADE,
      UNIQUE(master_fund_id, sub_fund_id)
    );
  `);

  // 投资者表（增强版）
  db.exec(`
    CREATE TABLE IF NOT EXISTS investors (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      investor_code TEXT UNIQUE,
      name TEXT NOT NULL,
      name_en TEXT,
      investor_type TEXT DEFAULT 'INDIVIDUAL',  -- INDIVIDUAL/INSTITUTIONAL
      id_number TEXT,
      passport_number TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      country TEXT,

      -- 风险评估
      risk_level TEXT DEFAULT 'MODERATE',
      risk_assessment_date DATE,

      -- 银行信息
      bank_name TEXT,
      bank_account TEXT,
      bank_swift TEXT,

      -- KYC 状态
      kyc_status TEXT DEFAULT 'PENDING',
      kyc_verified_date DATE,

      -- 统计信息
      total_investment REAL DEFAULT 0,
      total_market_value REAL DEFAULT 0,
      total_profit REAL DEFAULT 0,

      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 持仓账户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS holdings (
      id TEXT PRIMARY KEY,
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,
      total_shares REAL DEFAULT 0,
      available_shares REAL DEFAULT 0,
      locked_shares REAL DEFAULT 0,
      total_cost REAL DEFAULT 0,
      average_cost REAL DEFAULT 0,
      market_value REAL DEFAULT 0,
      unrealized_profit REAL DEFAULT 0,
      realized_profit REAL DEFAULT 0,
      first_purchase_date DATE,
      last_transaction_date DATE,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE,
      UNIQUE(investor_id, fund_id)
    );
  `);

  // 申购记录表（增强版）
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,

      -- 金额和费用
      subscription_amount REAL NOT NULL,
      subscription_fee REAL DEFAULT 0,
      net_amount REAL,

      -- 份额确认
      confirmed_shares REAL,
      nav REAL,
      nav_date DATE,

      -- 状态流转
      status TEXT DEFAULT 'PENDING',  -- PENDING/APPROVED/CONFIRMED/REJECTED/CANCELLED

      -- 审批信息
      approval_id TEXT,
      approved_by TEXT,
      approved_at DATETIME,
      approval_notes TEXT,

      -- 确认信息
      confirmed_by TEXT,
      confirm_date DATETIME,

      -- 支付信息
      payment_method TEXT,
      payment_reference TEXT,
      payment_date DATE,

      apply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE
    );
  `);

  // 赎回记录表（增强版）
  db.exec(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,

      -- 赎回份额和金额
      redemption_shares REAL NOT NULL,
      redemption_amount REAL,
      redemption_fee REAL DEFAULT 0,
      net_amount REAL,

      -- 净值信息
      nav REAL,
      nav_date DATE,

      -- 状态流转
      status TEXT DEFAULT 'PENDING',  -- PENDING/APPROVED/CONFIRMED/REJECTED/CANCELLED

      -- 审批信息
      approval_id TEXT,
      approved_by TEXT,
      approved_at DATETIME,
      approval_notes TEXT,

      -- 确认信息
      confirmed_by TEXT,
      confirm_date DATETIME,

      -- 付款信息
      payment_method TEXT,
      payment_reference TEXT,
      payment_date DATE,
      expected_payment_date DATE,

      apply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE
    );
  `);

  // 净值历史表
  db.exec(`
    CREATE TABLE IF NOT EXISTS nav_history (
      id TEXT PRIMARY KEY,
      fund_id TEXT NOT NULL,
      nav_date DATE NOT NULL,
      nav REAL NOT NULL,
      accumulated_nav REAL,
      daily_return REAL,
      total_assets REAL,
      total_shares REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT,
      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE,
      UNIQUE(fund_id, nav_date)
    );
  `);

  // ==================== 审批工作流 ====================

  // 审批记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      transaction_type TEXT NOT NULL,  -- SUBSCRIPTION/REDEMPTION
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,
      amount REAL NOT NULL,

      -- 审批状态
      status TEXT DEFAULT 'PENDING',   -- PENDING/APPROVED/REJECTED
      priority TEXT DEFAULT 'NORMAL',  -- LOW/NORMAL/HIGH/URGENT

      -- 提交信息
      submitted_by TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      -- 审批信息
      approved_by TEXT,
      processed_at DATETIME,
      approval_notes TEXT,
      rejection_reason TEXT,

      -- 关联数据
      investor_name TEXT,
      fund_name TEXT,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE,
      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE
    );
  `);

  // ==================== 文档管理 ====================

  // 文档表
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      doc_type TEXT NOT NULL,          -- CONTRACT/STATEMENT/REPORT/NOTICE/KYC
      category TEXT,                   -- MONTHLY/QUARTERLY/ANNUAL
      fund_id TEXT,
      investor_id TEXT,

      title TEXT NOT NULL,
      description TEXT,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      file_type TEXT,

      -- 权限控制
      is_public BOOLEAN DEFAULT 0,
      access_level TEXT DEFAULT 'PRIVATE',  -- PUBLIC/PRIVATE/RESTRICTED

      -- 版本控制
      version TEXT DEFAULT '1.0',
      parent_doc_id TEXT,

      -- 审计信息
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      uploaded_by TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (fund_id) REFERENCES funds(id) ON DELETE CASCADE,
      FOREIGN KEY (investor_id) REFERENCES investors(id) ON DELETE CASCADE
    );
  `);

  // ==================== 通知系统 ====================

  // 通知表
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT DEFAULT 'INFO',        -- INFO/WARNING/SUCCESS/ERROR
      category TEXT,                   -- TRANSACTION/SYSTEM/ANNOUNCEMENT

      -- 关联信息
      related_type TEXT,               -- SUBSCRIPTION/REDEMPTION/DOCUMENT
      related_id TEXT,

      -- 状态
      is_read BOOLEAN DEFAULT 0,
      read_at DATETIME,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // ==================== 审计日志 ====================

  // 操作日志表
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      username TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      changes TEXT,                    -- JSON 格式存储变更内容
      ip_address TEXT,
      user_agent TEXT,
      status TEXT DEFAULT 'SUCCESS',   -- SUCCESS/FAILED
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // ==================== 系统配置 ====================

  // 系统配置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id TEXT PRIMARY KEY,
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      setting_type TEXT DEFAULT 'STRING',  -- STRING/NUMBER/BOOLEAN/JSON
      category TEXT,
      description TEXT,
      is_public BOOLEAN DEFAULT 0,
      updated_by TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 创建索引以提升查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_subscriptions_investor ON subscriptions(investor_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_fund ON subscriptions(fund_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_redemptions_investor ON redemptions(investor_id);
    CREATE INDEX IF NOT EXISTS idx_redemptions_fund ON redemptions(fund_id);
    CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status);
    CREATE INDEX IF NOT EXISTS idx_holdings_investor ON holdings(investor_id);
    CREATE INDEX IF NOT EXISTS idx_holdings_fund ON holdings(fund_id);
    CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
  `);

  console.log('Database V2 initialized successfully!');
  console.log('New features added:');
  console.log('  - Master-Feeder Fund relationships');
  console.log('  - Approval workflow system');
  console.log('  - Document management');
  console.log('  - Notification system');
  console.log('  - Audit logging');
}

// 如果直接运行此文件
if (require.main === module) {
  initDatabaseV2();
  db.close();
}
