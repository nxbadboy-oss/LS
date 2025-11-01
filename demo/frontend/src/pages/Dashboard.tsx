import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, message, Spin } from 'antd';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatAmount, formatPercent, getStatusText } from '../utils/format';
import type { DashboardGP, DashboardLP } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardGP | DashboardLP | null>(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLP = user.role === 'LP_INVESTOR';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const endpoint = isLP ? '/dashboard/lp' : '/dashboard/gp';
      const response: any = await api.get(endpoint);
      setData(response.data);
    } catch (error: any) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>暂无数据</div>;
  }

  // LP Dashboard
  if (isLP) {
    const lpData = data as DashboardLP;

    return (
      <div>
        <h2 style={{ marginBottom: 24 }}>我的资产</h2>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总资产"
                value={lpData.summary.totalMarketValue}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总投资"
                value={lpData.summary.totalInvestment}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="总收益"
                value={lpData.summary.totalProfit}
                precision={2}
                prefix={lpData.summary.totalProfit >= 0 ? '¥+' : '¥'}
                valueStyle={{ color: lpData.summary.totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="收益率"
                value={lpData.summary.returnRate}
                precision={2}
                suffix="%"
                valueStyle={{ color: lpData.summary.returnRate >= 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="收益曲线">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lpData.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatAmount(value)} />
                  <Line type="monotone" dataKey="value" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="资产配置">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lpData.assetAllocation}
                    dataKey="value"
                    nameKey="fundName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.percentage.toFixed(1)}%`}
                  >
                    {lpData.assetAllocation.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatAmount(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card title="持仓明细" style={{ marginTop: 24 }}>
          <Table
            dataSource={lpData.holdings}
            columns={[
              { title: '基金名称', dataIndex: 'fund_name', key: 'fund_name' },
              {
                title: '份额',
                dataIndex: 'total_shares',
                key: 'total_shares',
                render: (v) => v.toFixed(2),
              },
              {
                title: '市值',
                dataIndex: 'market_value',
                key: 'market_value',
                render: (v) => formatAmount(v),
              },
              {
                title: '收益',
                dataIndex: 'unrealized_profit',
                key: 'unrealized_profit',
                render: (v) => (
                  <span style={{ color: v >= 0 ? '#3f8600' : '#cf1322' }}>
                    {formatAmount(v)}
                  </span>
                ),
              },
              {
                title: '收益率',
                key: 'return_rate',
                render: (_, record) => {
                  const rate = (record.unrealized_profit / record.total_cost) * 100;
                  return (
                    <span style={{ color: rate >= 0 ? '#3f8600' : '#cf1322' }}>
                      {formatPercent(rate)}
                    </span>
                  );
                },
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    );
  }

  // GP Dashboard
  const gpData = data as DashboardGP;

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>管理概览</h2>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="基金数量"
              value={gpData.summary.totalFunds}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="投资者数量"
              value={gpData.summary.totalInvestors}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="管理规模 (AUM)"
              value={gpData.summary.totalAUM}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待处理申购"
              value={gpData.summary.pendingSubscriptions}
              suffix="笔"
              valueStyle={{ color: gpData.summary.pendingSubscriptions > 0 ? '#cf1322' : '#666' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="基金业绩">
            <Table
              dataSource={gpData.fundPerformance}
              columns={[
                { title: '基金代码', dataIndex: 'fund_code', key: 'fund_code', width: 100 },
                { title: '基金名称', dataIndex: 'fund_name', key: 'fund_name' },
                {
                  title: '净值',
                  dataIndex: 'nav',
                  key: 'nav',
                  render: (v) => v.toFixed(4),
                  width: 100,
                },
                {
                  title: '规模',
                  dataIndex: 'total_assets',
                  key: 'total_assets',
                  render: (v) => formatAmount(v, 0),
                  width: 120,
                },
                {
                  title: '累计收益',
                  dataIndex: 'total_return',
                  key: 'total_return',
                  render: (v) => (
                    <span style={{ color: v >= 0 ? '#3f8600' : '#cf1322' }}>
                      {formatPercent(v)}
                    </span>
                  ),
                  width: 100,
                },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="最近交易">
            <Table
              dataSource={gpData.recentTransactions}
              columns={[
                { title: '订单号', dataIndex: 'order_number', key: 'order_number', width: 150 },
                { title: '投资者', dataIndex: 'investor_name', key: 'investor_name', width: 100 },
                {
                  title: '金额',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (v) => formatAmount(v),
                  width: 120,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (v) => getStatusText(v),
                  width: 80,
                },
              ]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
