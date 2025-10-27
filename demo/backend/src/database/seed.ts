import db from './db';
import { initDatabase } from './init';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

function generateId() {
  return randomUUID();
}

export async function seedDatabase() {
  console.log('Seeding database...');

  // 清空现有数据
  db.exec('DELETE FROM nav_history');
  db.exec('DELETE FROM redemptions');
  db.exec('DELETE FROM subscriptions');
  db.exec('DELETE FROM holdings');
  db.exec('DELETE FROM investors');
  db.exec('DELETE FROM funds');
  db.exec('DELETE FROM users');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 创建用户
  const users = [
    { id: generateId(), username: 'gp-admin', role: 'GP_ADMIN', name: 'GP管理员', email: 'gp-admin@demo.com' },
    { id: generateId(), username: 'gp-operator', role: 'GP_OPERATOR', name: 'GP操作员', email: 'gp-operator@demo.com' },
    { id: generateId(), username: 'lp-001', role: 'LP_INVESTOR', name: '张三', email: 'zhangsan@demo.com' },
    { id: generateId(), username: 'lp-002', role: 'LP_INVESTOR', name: '李四', email: 'lisi@demo.com' },
    { id: generateId(), username: 'lp-003', role: 'LP_INVESTOR', name: '王五', email: 'wangwu@demo.com' },
  ];

  const insertUser = db.prepare('INSERT INTO users (id, username, password, email, role, name) VALUES (?, ?, ?, ?, ?, ?)');
  for (const user of users) {
    insertUser.run(user.id, user.username, hashedPassword, user.email, user.role, user.name);
  }

  // 创建基金
  const funds = [
    {
      id: generateId(),
      fund_code: 'TH001',
      fund_name: '天汇价值成长基金',
      fund_type: 'EQUITY',
      nav: 1.2345,
      accumulated_nav: 1.4567,
      total_assets: 52000000,
      total_shares: 42000000,
      inception_date: '2020-01-15',
      management_fee_rate: 0.015,
      subscription_fee_rate: 0.015,
      redemption_fee_rate: 0.005,
      min_subscription_amount: 1000
    },
    {
      id: generateId(),
      fund_code: 'TH002',
      fund_name: '天汇稳健债券基金',
      fund_type: 'BOND',
      nav: 1.0856,
      accumulated_nav: 1.1234,
      total_assets: 35000000,
      total_shares: 32000000,
      inception_date: '2020-06-01',
      management_fee_rate: 0.008,
      subscription_fee_rate: 0.008,
      redemption_fee_rate: 0.003,
      min_subscription_amount: 1000
    },
    {
      id: generateId(),
      fund_code: 'TH003',
      fund_name: '天汇均衡配置基金',
      fund_type: 'HYBRID',
      nav: 1.1523,
      accumulated_nav: 1.2789,
      total_assets: 28000000,
      total_shares: 24000000,
      inception_date: '2021-03-01',
      management_fee_rate: 0.012,
      subscription_fee_rate: 0.012,
      redemption_fee_rate: 0.005,
      min_subscription_amount: 1000
    }
  ];

  const insertFund = db.prepare(`
    INSERT INTO funds (id, fund_code, fund_name, fund_type, nav, accumulated_nav, total_assets, total_shares,
      inception_date, management_fee_rate, subscription_fee_rate, redemption_fee_rate, min_subscription_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const fund of funds) {
    insertFund.run(
      fund.id, fund.fund_code, fund.fund_name, fund.fund_type, fund.nav, fund.accumulated_nav,
      fund.total_assets, fund.total_shares, fund.inception_date, fund.management_fee_rate,
      fund.subscription_fee_rate, fund.redemption_fee_rate, fund.min_subscription_amount
    );
  }

  // 为每个基金生成近90天的净值历史
  const insertNavHistory = db.prepare('INSERT INTO nav_history (id, fund_id, nav_date, nav, accumulated_nav, daily_return) VALUES (?, ?, ?, ?, ?, ?)');
  const today = new Date();

  for (const fund of funds) {
    let currentNav = fund.nav - 0.2; // 从更低的净值开始
    let accumulatedNav = fund.accumulated_nav - 0.2;

    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // 跳过周末
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // 模拟净值波动
      const change = (Math.random() - 0.45) * 0.02; // 略微向上的趋势
      currentNav = currentNav * (1 + change);
      accumulatedNav = accumulatedNav * (1 + change);
      const dailyReturn = change * 100;

      insertNavHistory.run(
        generateId(),
        fund.id,
        dateStr,
        Number(currentNav.toFixed(4)),
        Number(accumulatedNav.toFixed(4)),
        Number(dailyReturn.toFixed(2))
      );
    }
  }

  // 创建投资者
  const lpUsers = users.filter(u => u.role === 'LP_INVESTOR');
  const investors = [];

  const insertInvestor = db.prepare('INSERT INTO investors (id, user_id, name, id_number, phone, total_investment, total_market_value) VALUES (?, ?, ?, ?, ?, ?, ?)');

  for (let i = 0; i < lpUsers.length; i++) {
    const user = lpUsers[i];
    const investor = {
      id: generateId(),
      user_id: user.id,
      name: user.name,
      id_number: `3101${String(19800101 + i * 100).padStart(8, '0')}${String(1234 + i).padStart(4, '0')}`,
      phone: `138${String(10000000 + i * 1111111).slice(0, 8)}`,
      total_investment: 0,
      total_market_value: 0
    };
    investors.push(investor);
    insertInvestor.run(investor.id, investor.user_id, investor.name, investor.id_number, investor.phone, 0, 0);
  }

  // 创建持仓和交易记录
  const insertHolding = db.prepare('INSERT INTO holdings (id, investor_id, fund_id, total_shares, available_shares, total_cost, market_value, unrealized_profit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertSubscription = db.prepare('INSERT INTO subscriptions (id, order_number, investor_id, fund_id, subscription_amount, subscription_fee, net_amount, confirmed_shares, nav, status, confirm_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

  let orderCounter = 1;

  // 为每个投资者创建1-2个持仓
  for (const investor of investors) {
    const numHoldings = Math.floor(Math.random() * 2) + 1;
    const selectedFunds = funds.sort(() => 0.5 - Math.random()).slice(0, numHoldings);

    for (const fund of selectedFunds) {
      const investmentAmount = Math.floor(Math.random() * 400000) + 100000; // 10万-50万
      const subscriptionFee = investmentAmount * fund.subscription_fee_rate;
      const netAmount = investmentAmount - subscriptionFee;
      const shares = netAmount / fund.nav;
      const marketValue = shares * fund.nav;
      const profit = marketValue - investmentAmount;

      // 创建持仓
      insertHolding.run(
        generateId(),
        investor.id,
        fund.id,
        Number(shares.toFixed(2)),
        Number(shares.toFixed(2)),
        investmentAmount,
        Number(marketValue.toFixed(2)),
        Number(profit.toFixed(2))
      );

      // 创建已确认的申购记录
      const daysAgo = Math.floor(Math.random() * 60) + 30;
      const applyDate = new Date(today);
      applyDate.setDate(applyDate.getDate() - daysAgo);

      insertSubscription.run(
        generateId(),
        `SUB${String(orderCounter++).padStart(8, '0')}`,
        investor.id,
        fund.id,
        investmentAmount,
        subscriptionFee,
        netAmount,
        Number(shares.toFixed(2)),
        fund.nav,
        'CONFIRMED',
        applyDate.toISOString()
      );

      // 更新投资者统计
      db.prepare('UPDATE investors SET total_investment = total_investment + ?, total_market_value = total_market_value + ? WHERE id = ?')
        .run(investmentAmount, marketValue, investor.id);
    }
  }

  // 创建一些待处理的申购
  const pendingSubscription = db.prepare('INSERT INTO subscriptions (id, order_number, investor_id, fund_id, subscription_amount, subscription_fee, net_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

  for (let i = 0; i < 3; i++) {
    const investor = investors[Math.floor(Math.random() * investors.length)];
    const fund = funds[Math.floor(Math.random() * funds.length)];
    const amount = Math.floor(Math.random() * 100000) + 50000;
    const fee = amount * fund.subscription_fee_rate;

    pendingSubscription.run(
      generateId(),
      `SUB${String(orderCounter++).padStart(8, '0')}`,
      investor.id,
      fund.id,
      amount,
      fee,
      amount - fee,
      'PENDING'
    );
  }

  console.log('Database seeded successfully!');
  console.log(`- Created ${users.length} users`);
  console.log(`- Created ${funds.length} funds`);
  console.log(`- Created ${investors.length} investors`);
  console.log('- Created holdings and transactions');
}

// 如果直接运行此文件
if (require.main === module) {
  initDatabase();
  seedDatabase().then(() => {
    console.log('Done!');
    db.close();
  });
}
