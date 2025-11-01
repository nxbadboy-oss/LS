import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import db from './db';

/**
 * 种子数据 V2 - 真实业务场景
 * Eminence Global MasterFund OFC + 5个子基金
 */

async function seedDatabaseV2() {
  console.log('Seeding database with production-like data...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // ==================== 用户数据 ====================
  const users = [
    {
      id: 'user-gp-admin',
      username: 'gp-admin',
      password: hashedPassword,
      email: 'admin@eminencefund.com',
      role: 'GP_ADMIN',
      name: 'Fund Administrator',
      phone: '+852-1234-5678',
      status: 'ACTIVE',
    },
    {
      id: 'user-gp-operator',
      username: 'gp-operator',
      password: hashedPassword,
      email: 'operator@eminencefund.com',
      role: 'GP_OPERATOR',
      name: 'Fund Operator',
      phone: '+852-1234-5679',
      status: 'ACTIVE',
    },
    {
      id: 'user-lp-001',
      username: 'lp-001',
      password: hashedPassword,
      email: 'investor1@example.com',
      role: 'LP_INVESTOR',
      name: 'Zhang Wei',
      phone: '+86-138-0000-0001',
      status: 'ACTIVE',
    },
    {
      id: 'user-lp-002',
      username: 'lp-002',
      password: hashedPassword,
      email: 'investor2@example.com',
      role: 'LP_INVESTOR',
      name: 'Li Ming',
      phone: '+86-138-0000-0002',
      status: 'ACTIVE',
    },
    {
      id: 'user-lp-003',
      username: 'lp-003',
      password: hashedPassword,
      email: 'investor3@example.com',
      role: 'LP_INVESTOR',
      name: 'Wang Fang',
      phone: '+86-138-0000-0003',
      status: 'ACTIVE',
    },
  ];

  const userStmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, username, password, email, role, name, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  users.forEach(user => {
    userStmt.run(
      user.id,
      user.username,
      user.password,
      user.email,
      user.role,
      user.name,
      user.phone,
      user.status
    );
  });

  console.log(`✓ Created ${users.length} users`);

  // ==================== 基金数据 ====================

  // 母基金
  const masterFund = {
    id: 'fund-master-001',
    fund_code: 'BUB855',
    fund_name: 'Eminence Global MasterFund OFC',
    fund_name_en: 'Eminence Global MasterFund OFC',
    fund_type: 'MIXED',
    fund_category: 'MASTER',
    nav: 1.2458,
    accumulated_nav: 1.2458,
    total_assets: 125800000,
    total_shares: 101000000,
    management_fee_rate: 0.02,
    subscription_fee_rate: 0.01,
    redemption_fee_rate: 0.005,
    performance_fee_rate: 0.20,
    min_subscription_amount: 100000,
    manager_name: 'Eminence Asset Management Ltd',
    custodian: 'HSBC Institutional Trust Services',
    administrator: 'Citco Fund Services',
    investment_strategy: 'Multi-strategy approach investing across various sub-funds with focus on technology, M&A opportunities, and emerging markets',
    investment_objective: 'Long-term capital appreciation through diversified investments in high-growth sectors',
    benchmark: 'MSCI World Index',
    risk_level: 'MODERATE_HIGH',
    currency: 'USD',
    status: 'ACTIVE',
    inception_date: '2020-01-15',
    fiscal_year_end: '12-31',
  };

  // 5个子基金
  const subFunds = [
    {
      id: 'fund-sub-001',
      fund_code: 'BUB856',
      fund_name: 'Eminence Opportunity Fund 1',
      fund_name_en: 'Eminence Opportunity Fund 1',
      fund_type: 'EQUITY',
      fund_category: 'SUB',
      nav: 1.3245,
      accumulated_nav: 1.3245,
      total_assets: 28500000,
      total_shares: 21520000,
      management_fee_rate: 0.02,
      subscription_fee_rate: 0.01,
      redemption_fee_rate: 0.005,
      performance_fee_rate: 0.20,
      min_subscription_amount: 50000,
      manager_name: 'Eminence Asset Management Ltd',
      custodian: 'HSBC Institutional Trust Services',
      administrator: 'Citco Fund Services',
      investment_strategy: 'Opportunistic investments in undervalued companies with strong growth potential',
      investment_objective: 'Capital appreciation through value investing',
      benchmark: 'S&P 500',
      risk_level: 'HIGH',
      currency: 'USD',
      status: 'ACTIVE',
      inception_date: '2020-03-01',
      fiscal_year_end: '12-31',
    },
    {
      id: 'fund-sub-002',
      fund_code: 'BWH895',
      fund_name: 'Eminence Digital Technology Fund',
      fund_name_en: 'Eminence Digital Technology Fund',
      fund_type: 'EQUITY',
      fund_category: 'SUB',
      nav: 1.5680,
      accumulated_nav: 1.5680,
      total_assets: 42300000,
      total_shares: 26980000,
      management_fee_rate: 0.02,
      subscription_fee_rate: 0.015,
      redemption_fee_rate: 0.005,
      performance_fee_rate: 0.20,
      min_subscription_amount: 50000,
      manager_name: 'Eminence Asset Management Ltd',
      custodian: 'HSBC Institutional Trust Services',
      administrator: 'Citco Fund Services',
      investment_strategy: 'Focus on digital transformation, AI, cloud computing, and fintech companies',
      investment_objective: 'Capital appreciation through technology sector investments',
      benchmark: 'NASDAQ Composite',
      risk_level: 'HIGH',
      currency: 'USD',
      status: 'ACTIVE',
      inception_date: '2020-06-01',
      fiscal_year_end: '12-31',
    },
    {
      id: 'fund-sub-003',
      fund_code: 'BWH893',
      fund_name: 'Eminence Global M&A Fund',
      fund_name_en: 'Eminence Global M&A Fund',
      fund_type: 'MIXED',
      fund_category: 'SUB',
      nav: 1.1890,
      accumulated_nav: 1.1890,
      total_assets: 22100000,
      total_shares: 18590000,
      management_fee_rate: 0.02,
      subscription_fee_rate: 0.01,
      redemption_fee_rate: 0.005,
      performance_fee_rate: 0.20,
      min_subscription_amount: 100000,
      manager_name: 'Eminence Asset Management Ltd',
      custodian: 'HSBC Institutional Trust Services',
      administrator: 'Citco Fund Services',
      investment_strategy: 'Event-driven strategy focusing on merger arbitrage and corporate restructuring',
      investment_objective: 'Absolute returns through M&A opportunities',
      benchmark: 'HFRI Event-Driven Index',
      risk_level: 'MODERATE_HIGH',
      currency: 'USD',
      status: 'ACTIVE',
      inception_date: '2020-09-01',
      fiscal_year_end: '12-31',
    },
    {
      id: 'fund-sub-004',
      fund_code: 'BWH894',
      fund_name: 'Eminence Global Trade Development Fund',
      fund_name_en: 'Eminence Global Trade Development Fund',
      fund_type: 'BOND',
      fund_category: 'SUB',
      nav: 1.0920,
      accumulated_nav: 1.0920,
      total_assets: 18600000,
      total_shares: 17030000,
      management_fee_rate: 0.015,
      subscription_fee_rate: 0.01,
      redemption_fee_rate: 0.005,
      performance_fee_rate: 0.15,
      min_subscription_amount: 50000,
      manager_name: 'Eminence Asset Management Ltd',
      custodian: 'HSBC Institutional Trust Services',
      administrator: 'Citco Fund Services',
      investment_strategy: 'Trade finance and supply chain financing in emerging markets',
      investment_objective: 'Stable income through trade-related investments',
      benchmark: 'Bloomberg Barclays Global Aggregate',
      risk_level: 'MODERATE',
      currency: 'USD',
      status: 'ACTIVE',
      inception_date: '2021-01-15',
      fiscal_year_end: '12-31',
    },
    {
      id: 'fund-sub-005',
      fund_code: 'BWH896',
      fund_name: 'Eminence Greater BayArea Technology Innovation Fund',
      fund_name_en: 'Eminence Greater BayArea Technology Innovation Fund',
      fund_type: 'EQUITY',
      fund_category: 'SUB',
      nav: 1.4210,
      accumulated_nav: 1.4210,
      total_assets: 14300000,
      total_shares: 10062000,
      management_fee_rate: 0.02,
      subscription_fee_rate: 0.015,
      redemption_fee_rate: 0.005,
      performance_fee_rate: 0.20,
      min_subscription_amount: 50000,
      manager_name: 'Eminence Asset Management Ltd',
      custodian: 'HSBC Institutional Trust Services',
      administrator: 'Citco Fund Services',
      investment_strategy: 'Focus on technology innovation in Greater Bay Area including Shenzhen, Hong Kong, and Guangzhou',
      investment_objective: 'Capital appreciation through regional tech ecosystem',
      benchmark: 'Hang Seng Tech Index',
      risk_level: 'HIGH',
      currency: 'USD',
      status: 'ACTIVE',
      inception_date: '2021-06-01',
      fiscal_year_end: '12-31',
    },
  ];

  const fundStmt = db.prepare(`
    INSERT OR REPLACE INTO funds (
      id, fund_code, fund_name, fund_name_en, fund_type, fund_category,
      nav, accumulated_nav, total_assets, total_shares,
      management_fee_rate, subscription_fee_rate, redemption_fee_rate, performance_fee_rate,
      min_subscription_amount, manager_name, custodian, administrator,
      investment_strategy, investment_objective, benchmark, risk_level,
      currency, status, inception_date, fiscal_year_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  fundStmt.run(
    masterFund.id,
    masterFund.fund_code,
    masterFund.fund_name,
    masterFund.fund_name_en,
    masterFund.fund_type,
    masterFund.fund_category,
    masterFund.nav,
    masterFund.accumulated_nav,
    masterFund.total_assets,
    masterFund.total_shares,
    masterFund.management_fee_rate,
    masterFund.subscription_fee_rate,
    masterFund.redemption_fee_rate,
    masterFund.performance_fee_rate,
    masterFund.min_subscription_amount,
    masterFund.manager_name,
    masterFund.custodian,
    masterFund.administrator,
    masterFund.investment_strategy,
    masterFund.investment_objective,
    masterFund.benchmark,
    masterFund.risk_level,
    masterFund.currency,
    masterFund.status,
    masterFund.inception_date,
    masterFund.fiscal_year_end
  );

  subFunds.forEach(fund => {
    fundStmt.run(
      fund.id,
      fund.fund_code,
      fund.fund_name,
      fund.fund_name_en,
      fund.fund_type,
      fund.fund_category,
      fund.nav,
      fund.accumulated_nav,
      fund.total_assets,
      fund.total_shares,
      fund.management_fee_rate,
      fund.subscription_fee_rate,
      fund.redemption_fee_rate,
      fund.performance_fee_rate,
      fund.min_subscription_amount,
      fund.manager_name,
      fund.custodian,
      fund.administrator,
      fund.investment_strategy,
      fund.investment_objective,
      fund.benchmark,
      fund.risk_level,
      fund.currency,
      fund.status,
      fund.inception_date,
      fund.fiscal_year_end
    );
  });

  console.log(`✓ Created 1 master fund and ${subFunds.length} sub-funds`);

  // ==================== 母子基金关联 ====================
  const relationships = [
    {
      id: randomUUID(),
      master_fund_id: 'fund-master-001',
      sub_fund_id: 'fund-sub-001',
      allocation_ratio: 0.22,
      target_allocation: 0.20,
      min_allocation: 0.15,
      max_allocation: 0.25,
    },
    {
      id: randomUUID(),
      master_fund_id: 'fund-master-001',
      sub_fund_id: 'fund-sub-002',
      allocation_ratio: 0.34,
      target_allocation: 0.35,
      min_allocation: 0.30,
      max_allocation: 0.40,
    },
    {
      id: randomUUID(),
      master_fund_id: 'fund-master-001',
      sub_fund_id: 'fund-sub-003',
      allocation_ratio: 0.18,
      target_allocation: 0.20,
      min_allocation: 0.15,
      max_allocation: 0.25,
    },
    {
      id: randomUUID(),
      master_fund_id: 'fund-master-001',
      sub_fund_id: 'fund-sub-004',
      allocation_ratio: 0.15,
      target_allocation: 0.15,
      min_allocation: 0.10,
      max_allocation: 0.20,
    },
    {
      id: randomUUID(),
      master_fund_id: 'fund-master-001',
      sub_fund_id: 'fund-sub-005',
      allocation_ratio: 0.11,
      target_allocation: 0.10,
      min_allocation: 0.05,
      max_allocation: 0.15,
    },
  ];

  const relationshipStmt = db.prepare(`
    INSERT OR REPLACE INTO fund_relationships (
      id, master_fund_id, sub_fund_id, allocation_ratio,
      target_allocation, min_allocation, max_allocation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  relationships.forEach(rel => {
    relationshipStmt.run(
      rel.id,
      rel.master_fund_id,
      rel.sub_fund_id,
      rel.allocation_ratio,
      rel.target_allocation,
      rel.min_allocation,
      rel.max_allocation
    );
  });

  console.log(`✓ Created ${relationships.length} master-sub fund relationships`);

  // ==================== 投资者数据 ====================
  const investors = [
    {
      id: 'investor-001',
      user_id: 'user-lp-001',
      investor_code: 'INV001',
      name: 'Zhang Wei',
      name_en: 'Zhang Wei',
      investor_type: 'INDIVIDUAL',
      id_number: '110101199001011234',
      email: 'investor1@example.com',
      phone: '+86-138-0000-0001',
      country: 'China',
      risk_level: 'MODERATE_HIGH',
      kyc_status: 'VERIFIED',
      total_investment: 500000,
      total_market_value: 585000,
      status: 'ACTIVE',
    },
    {
      id: 'investor-002',
      user_id: 'user-lp-002',
      investor_code: 'INV002',
      name: 'Li Ming',
      name_en: 'Li Ming',
      investor_type: 'INDIVIDUAL',
      id_number: '110101198505055678',
      email: 'investor2@example.com',
      phone: '+86-138-0000-0002',
      country: 'China',
      risk_level: 'HIGH',
      kyc_status: 'VERIFIED',
      total_investment: 1000000,
      total_market_value: 1245000,
      status: 'ACTIVE',
    },
    {
      id: 'investor-003',
      user_id: 'user-lp-003',
      investor_code: 'INV003',
      name: 'Wang Fang',
      name_en: 'Wang Fang',
      investor_type: 'INSTITUTIONAL',
      email: 'investor3@example.com',
      phone: '+86-138-0000-0003',
      country: 'China',
      risk_level: 'MODERATE',
      kyc_status: 'VERIFIED',
      total_investment: 2000000,
      total_market_value: 2356000,
      status: 'ACTIVE',
    },
  ];

  const investorStmt = db.prepare(`
    INSERT OR REPLACE INTO investors (
      id, user_id, investor_code, name, name_en, investor_type,
      id_number, email, phone, country, risk_level, kyc_status,
      total_investment, total_market_value, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  investors.forEach(inv => {
    investorStmt.run(
      inv.id,
      inv.user_id,
      inv.investor_code,
      inv.name,
      inv.name_en,
      inv.investor_type,
      inv.id_number || null,
      inv.email,
      inv.phone,
      inv.country,
      inv.risk_level,
      inv.kyc_status,
      inv.total_investment,
      inv.total_market_value,
      inv.status
    );
  });

  console.log(`✓ Created ${investors.length} investors`);

  // ==================== 持仓数据 ====================
  const holdings = [
    // Investor 1 - 母基金投资者
    {
      id: randomUUID(),
      investor_id: 'investor-001',
      fund_id: 'fund-master-001',
      total_shares: 400000,
      available_shares: 400000,
      total_cost: 500000,
      market_value: 498320, // 400000 * 1.2458
      unrealized_profit: -1680,
    },
    // Investor 2 - 子基金投资者
    {
      id: randomUUID(),
      investor_id: 'investor-002',
      fund_id: 'fund-sub-002', // Digital Tech Fund
      total_shares: 600000,
      available_shares: 600000,
      total_cost: 1000000,
      market_value: 940800, // 600000 * 1.5680
      unrealized_profit: -59200,
    },
    {
      id: randomUUID(),
      investor_id: 'investor-002',
      fund_id: 'fund-sub-005', // Bay Area Fund
      total_shares: 200000,
      available_shares: 200000,
      total_cost: 250000,
      market_value: 284200, // 200000 * 1.4210
      unrealized_profit: 34200,
    },
    // Investor 3 - 多元化投资
    {
      id: randomUUID(),
      investor_id: 'investor-003',
      fund_id: 'fund-sub-001', // Opportunity Fund
      total_shares: 500000,
      available_shares: 500000,
      total_cost: 650000,
      market_value: 662250, // 500000 * 1.3245
      unrealized_profit: 12250,
    },
    {
      id: randomUUID(),
      investor_id: 'investor-003',
      fund_id: 'fund-sub-003', // M&A Fund
      total_shares: 800000,
      available_shares: 800000,
      total_cost: 950000,
      market_value: 951200, // 800000 * 1.1890
      unrealized_profit: 1200,
    },
    {
      id: randomUUID(),
      investor_id: 'investor-003',
      fund_id: 'fund-sub-004', // Trade Fund
      total_shares: 350000,
      available_shares: 350000,
      total_cost: 400000,
      market_value: 382200, // 350000 * 1.0920
      unrealized_profit: -17800,
    },
  ];

  const holdingStmt = db.prepare(`
    INSERT OR REPLACE INTO holdings (
      id, investor_id, fund_id, total_shares, available_shares,
      total_cost, market_value, unrealized_profit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  holdings.forEach(h => {
    holdingStmt.run(
      h.id,
      h.investor_id,
      h.fund_id,
      h.total_shares,
      h.available_shares,
      h.total_cost,
      h.market_value,
      h.unrealized_profit
    );
  });

  console.log(`✓ Created ${holdings.length} holdings`);

  // ==================== 净值历史（过去180天）====================
  const navHistoryStmt = db.prepare(`
    INSERT OR REPLACE INTO nav_history (id, fund_id, nav_date, nav, accumulated_nav, daily_return)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const allFunds = [masterFund, ...subFunds];
  let navHistoryCount = 0;

  allFunds.forEach(fund => {
    const baseNav = fund.nav;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 180);

    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // 跳过周末
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      // 模拟净值波动 (±0.5%)
      const volatility = (Math.random() - 0.5) * 0.01;
      const progress = i / 180;
      const trendFactor = (baseNav - 1.0) * progress;
      const nav = 1.0 + trendFactor + volatility;

      const dailyReturn = i > 0 ? volatility : 0;

      navHistoryStmt.run(
        randomUUID(),
        fund.id,
        currentDate.toISOString().split('T')[0],
        parseFloat(nav.toFixed(4)),
        parseFloat(nav.toFixed(4)),
        parseFloat(dailyReturn.toFixed(6))
      );

      navHistoryCount++;
    }
  });

  console.log(`✓ Created ${navHistoryCount} NAV history records`);

  // ==================== 交易记录 ====================
  const subscriptions = [
    {
      id: randomUUID(),
      order_number: 'SUB20241001001',
      investor_id: 'investor-001',
      fund_id: 'fund-master-001',
      subscription_amount: 500000,
      subscription_fee: 5000,
      net_amount: 495000,
      confirmed_shares: 400000,
      nav: 1.2375,
      status: 'CONFIRMED',
      apply_date: '2024-10-01',
      confirm_date: '2024-10-03',
    },
    {
      id: randomUUID(),
      order_number: 'SUB20241015001',
      investor_id: 'investor-002',
      fund_id: 'fund-sub-002',
      subscription_amount: 1000000,
      subscription_fee: 15000,
      net_amount: 985000,
      confirmed_shares: 600000,
      nav: 1.6417,
      status: 'CONFIRMED',
      apply_date: '2024-10-15',
      confirm_date: '2024-10-17',
    },
  ];

  const subStmt = db.prepare(`
    INSERT OR REPLACE INTO subscriptions (
      id, order_number, investor_id, fund_id,
      subscription_amount, subscription_fee, net_amount,
      confirmed_shares, nav, status, apply_date, confirm_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  subscriptions.forEach(s => {
    subStmt.run(
      s.id,
      s.order_number,
      s.investor_id,
      s.fund_id,
      s.subscription_amount,
      s.subscription_fee,
      s.net_amount,
      s.confirmed_shares,
      s.nav,
      s.status,
      s.apply_date,
      s.confirm_date || null
    );
  });

  console.log(`✓ Created ${subscriptions.length} subscription records`);

  console.log('\n========================================');
  console.log('Database seeding completed successfully!');
  console.log('========================================\n');
  console.log('Test Accounts:');
  console.log('  GP Admin:    gp-admin / 123456');
  console.log('  GP Operator: gp-operator / 123456');
  console.log('  LP 001:      lp-001 / 123456');
  console.log('  LP 002:      lp-002 / 123456');
  console.log('  LP 003:      lp-003 / 123456');
  console.log('\nFund Structure:');
  console.log('  Master Fund: Eminence Global MasterFund OFC (BUB855)');
  console.log('  └─ Sub Funds:');
  console.log('     1. Eminence Opportunity Fund 1 (BUB856)');
  console.log('     2. Eminence Digital Technology Fund (BWH895)');
  console.log('     3. Eminence Global M&A Fund (BWH893)');
  console.log('     4. Eminence Global Trade Development Fund (BWH894)');
  console.log('     5. Eminence Greater BayArea Technology Innovation Fund (BWH896)');
}

// 如果直接运行此文件
if (require.main === module) {
  seedDatabaseV2()
    .then(() => {
      console.log('\nClosing database connection...');
      db.close();
      process.exit(0);
    })
    .catch(err => {
      console.error('Error seeding database:', err);
      db.close();
      process.exit(1);
    });
}

export { seedDatabaseV2 };
