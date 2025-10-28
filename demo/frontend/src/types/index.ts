export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'GP_ADMIN' | 'GP_OPERATOR' | 'LP_INVESTOR';
}

export interface Investor {
  id: string;
  user_id: string;
  name: string;
  id_number: string;
  phone: string;
  total_investment: number;
  total_market_value: number;
}

export interface Fund {
  id: string;
  fund_code: string;
  fund_name: string;
  fund_type: 'EQUITY' | 'BOND' | 'HYBRID' | 'MONEY_MARKET';
  nav: number;
  accumulated_nav: number;
  total_assets: number;
  total_shares: number;
  management_fee_rate: number;
  subscription_fee_rate: number;
  redemption_fee_rate: number;
  min_subscription_amount: number;
  status: string;
  inception_date: string;
}

export interface NavHistory {
  id: string;
  fund_id: string;
  nav_date: string;
  nav: number;
  accumulated_nav: number;
  daily_return: number;
}

export interface Holding {
  id: string;
  investor_id: string;
  fund_id: string;
  fund_name: string;
  fund_code: string;
  fund_type: string;
  total_shares: number;
  available_shares: number;
  total_cost: number;
  market_value: number;
  unrealized_profit: number;
  current_nav: number;
}

export interface Subscription {
  id: string;
  order_number: string;
  investor_id: string;
  investor_name: string;
  fund_id: string;
  fund_name: string;
  fund_code: string;
  subscription_amount: number;
  subscription_fee: number;
  net_amount: number;
  confirmed_shares: number;
  nav: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  apply_date: string;
  confirm_date?: string;
}

export interface Redemption {
  id: string;
  order_number: string;
  investor_id: string;
  investor_name: string;
  fund_id: string;
  fund_name: string;
  fund_code: string;
  redemption_shares: number;
  redemption_amount: number;
  redemption_fee: number;
  net_amount: number;
  nav: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  apply_date: string;
  confirm_date?: string;
}

export interface DashboardGP {
  summary: {
    totalFunds: number;
    totalInvestors: number;
    totalAUM: number;
    pendingSubscriptions: number;
    pendingRedemptions: number;
  };
  recentTransactions: any[];
  fundPerformance: any[];
}

export interface DashboardLP {
  summary: {
    totalInvestment: number;
    totalMarketValue: number;
    totalProfit: number;
    returnRate: number;
  };
  holdings: Holding[];
  assetAllocation: {
    fundType: string;
    fundName: string;
    value: number;
    percentage: number;
  }[];
  performanceHistory: {
    date: string;
    value: number;
  }[];
  recentTransactions: any[];
}
