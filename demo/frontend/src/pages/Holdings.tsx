import { useEffect, useState } from 'react';
import { Card, Table, Tag, message, Spin, Button, Empty } from 'antd';
import api from '../services/api';
import { formatAmount, formatPercent, getFundTypeText } from '../utils/format';
import type { Holding } from '../types';

export default function Holdings() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHoldings();
  }, []);

  const loadHoldings = async () => {
    try {
      const response: any = await api.get('/holdings');
      setHoldings(response.data);
    } catch (error) {
      message.error('加载持仓失败');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const totalCost = holdings.reduce((sum, h) => sum + h.total_cost, 0);
    const totalMarketValue = holdings.reduce((sum, h) => sum + h.market_value, 0);
    const totalProfit = holdings.reduce((sum, h) => sum + h.unrealized_profit, 0);
    const returnRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return { totalCost, totalMarketValue, totalProfit, returnRate };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const totals = calculateTotal();

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>我的持仓</h2>

      {holdings.length === 0 ? (
        <Card>
          <Empty
            description="暂无持仓"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" href="#/funds">
              去申购基金
            </Button>
          </Empty>
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ color: '#666', marginBottom: 8 }}>总成本</div>
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {formatAmount(totals.totalCost)}
                </div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: 8 }}>总市值</div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {formatAmount(totals.totalMarketValue)}
                </div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: 8 }}>浮动盈亏</div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: totals.totalProfit >= 0 ? '#3f8600' : '#cf1322',
                  }}
                >
                  {formatAmount(totals.totalProfit)}
                </div>
              </div>
              <div>
                <div style={{ color: '#666', marginBottom: 8 }}>收益率</div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: totals.returnRate >= 0 ? '#3f8600' : '#cf1322',
                  }}
                >
                  {formatPercent(totals.returnRate)}
                </div>
              </div>
            </div>
          </Card>

          <Card title="持仓明细">
            <Table
              dataSource={holdings}
              columns={[
                {
                  title: '基金名称',
                  dataIndex: 'fund_name',
                  key: 'fund_name',
                  render: (text, record) => (
                    <div>
                      <div>{text}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>{record.fund_code}</div>
                    </div>
                  ),
                },
                {
                  title: '类型',
                  dataIndex: 'fund_type',
                  key: 'fund_type',
                  render: (type) => (
                    <Tag color="blue">{getFundTypeText(type)}</Tag>
                  ),
                },
                {
                  title: '持有份额',
                  dataIndex: 'total_shares',
                  key: 'total_shares',
                  align: 'right',
                  render: (v) => v.toFixed(2),
                },
                {
                  title: '单位净值',
                  dataIndex: 'current_nav',
                  key: 'current_nav',
                  align: 'right',
                  render: (v) => v.toFixed(4),
                },
                {
                  title: '持仓成本',
                  dataIndex: 'total_cost',
                  key: 'total_cost',
                  align: 'right',
                  render: (v) => formatAmount(v),
                },
                {
                  title: '市值',
                  dataIndex: 'market_value',
                  key: 'market_value',
                  align: 'right',
                  render: (v) => formatAmount(v),
                },
                {
                  title: '浮动盈亏',
                  dataIndex: 'unrealized_profit',
                  key: 'unrealized_profit',
                  align: 'right',
                  render: (v) => (
                    <span style={{ color: v >= 0 ? '#3f8600' : '#cf1322' }}>
                      {formatAmount(v)}
                    </span>
                  ),
                },
                {
                  title: '收益率',
                  key: 'return_rate',
                  align: 'right',
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
        </>
      )}
    </div>
  );
}
