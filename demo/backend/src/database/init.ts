import db from './db';

// 创建数据库表
export function initDatabase() {
  console.log('Initializing database...');

  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 基金表
  db.exec(`
    CREATE TABLE IF NOT EXISTS funds (
      id TEXT PRIMARY KEY,
      fund_code TEXT UNIQUE NOT NULL,
      fund_name TEXT NOT NULL,
      fund_type TEXT NOT NULL,
      nav REAL NOT NULL DEFAULT 1.0,
      accumulated_nav REAL NOT NULL DEFAULT 1.0,
      total_assets REAL DEFAULT 0,
      total_shares REAL DEFAULT 0,
      management_fee_rate REAL DEFAULT 0.015,
      subscription_fee_rate REAL DEFAULT 0.015,
      redemption_fee_rate REAL DEFAULT 0.005,
      min_subscription_amount REAL DEFAULT 1000,
      status TEXT DEFAULT 'ACTIVE',
      inception_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 投资者表
  db.exec(`
    CREATE TABLE IF NOT EXISTS investors (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      name TEXT NOT NULL,
      id_number TEXT,
      phone TEXT,
      risk_level TEXT DEFAULT 'MODERATE',
      total_investment REAL DEFAULT 0,
      total_market_value REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
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
      total_cost REAL DEFAULT 0,
      market_value REAL DEFAULT 0,
      unrealized_profit REAL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (investor_id) REFERENCES investors(id),
      FOREIGN KEY (fund_id) REFERENCES funds(id),
      UNIQUE(investor_id, fund_id)
    );
  `);

  // 申购记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,
      subscription_amount REAL NOT NULL,
      subscription_fee REAL,
      net_amount REAL,
      confirmed_shares REAL,
      nav REAL,
      status TEXT DEFAULT 'PENDING',
      apply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirm_date DATETIME,
      FOREIGN KEY (investor_id) REFERENCES investors(id),
      FOREIGN KEY (fund_id) REFERENCES funds(id)
    );
  `);

  // 赎回记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS redemptions (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      investor_id TEXT NOT NULL,
      fund_id TEXT NOT NULL,
      redemption_shares REAL NOT NULL,
      redemption_amount REAL,
      redemption_fee REAL,
      net_amount REAL,
      nav REAL,
      status TEXT DEFAULT 'PENDING',
      apply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirm_date DATETIME,
      FOREIGN KEY (investor_id) REFERENCES investors(id),
      FOREIGN KEY (fund_id) REFERENCES funds(id)
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fund_id) REFERENCES funds(id),
      UNIQUE(fund_id, nav_date)
    );
  `);

  console.log('Database initialized successfully!');
}

// 如果直接运行此文件
if (require.main === module) {
  initDatabase();
  db.close();
}
