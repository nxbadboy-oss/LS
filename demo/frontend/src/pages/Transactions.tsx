import { useEffect, useState } from 'react';
import { Card, Table, Tag, Tabs, message, Spin } from 'antd';
import api from '../services/api';
import { formatAmount, formatDateTime, getStatusText } from '../utils/format';
import type { Subscription, Redemption } from '../types';

export default function Transactions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const [subRes, redRes]: any = await Promise.all([
        api.get('/transactions/subscriptions'),
        api.get('/transactions/redemptions'),
      ]);
      setSubscriptions(subRes.data);
      setRedemptions(redRes.data);
    } catch (error) {
      message.error('加载交易记录失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'orange',
      CONFIRMED: 'green',
      REJECTED: 'red',
      CANCELLED: 'default',
    };
    return colorMap[status] || 'default';
  };

  const subscriptionColumns = [
    {
      title: '订单号',
      dataIndex: 'order_number',
      key: 'order_number',
      width: 180,
    },
    {
      title: '基金名称',
      dataIndex: 'fund_name',
      key: 'fund_name',
      render: (text: string, record: Subscription) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.fund_code}</div>
        </div>
      ),
    },
    {
      title: '申购金额',
      dataIndex: 'subscription_amount',
      key: 'subscription_amount',
      align: 'right' as const,
      render: (v: number) => formatAmount(v),
    },
    {
      title: '申购费用',
      dataIndex: 'subscription_fee',
      key: 'subscription_fee',
      align: 'right' as const,
      render: (v: number) => formatAmount(v),
    },
    {
      title: '确认份额',
      dataIndex: 'confirmed_shares',
      key: 'confirmed_shares',
      align: 'right' as const,
      render: (v: number) => v ? v.toFixed(2) : '-',
    },
    {
      title: '确认净值',
      dataIndex: 'nav',
      key: 'nav',
      align: 'right' as const,
      render: (v: number) => v ? v.toFixed(4) : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'apply_date',
      key: 'apply_date',
      render: (date: string) => formatDateTime(date),
    },
  ];

  const redemptionColumns = [
    {
      title: '订单号',
      dataIndex: 'order_number',
      key: 'order_number',
      width: 180,
    },
    {
      title: '基金名称',
      dataIndex: 'fund_name',
      key: 'fund_name',
      render: (text: string, record: Redemption) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.fund_code}</div>
        </div>
      ),
    },
    {
      title: '赎回份额',
      dataIndex: 'redemption_shares',
      key: 'redemption_shares',
      align: 'right' as const,
      render: (v: number) => v.toFixed(2),
    },
    {
      title: '赎回金额',
      dataIndex: 'redemption_amount',
      key: 'redemption_amount',
      align: 'right' as const,
      render: (v: number) => v ? formatAmount(v) : '-',
    },
    {
      title: '赎回费用',
      dataIndex: 'redemption_fee',
      key: 'redemption_fee',
      align: 'right' as const,
      render: (v: number) => v ? formatAmount(v) : '-',
    },
    {
      title: '到账金额',
      dataIndex: 'net_amount',
      key: 'net_amount',
      align: 'right' as const,
      render: (v: number) => v ? formatAmount(v) : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'apply_date',
      key: 'apply_date',
      render: (date: string) => formatDateTime(date),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>交易记录</h2>

      <Card>
        <Tabs
          defaultActiveKey="subscriptions"
          items={[
            {
              key: 'subscriptions',
              label: `申购记录 (${subscriptions.length})`,
              children: (
                <Table
                  dataSource={subscriptions}
                  columns={subscriptionColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              ),
            },
            {
              key: 'redemptions',
              label: `赎回记录 (${redemptions.length})`,
              children: (
                <Table
                  dataSource={redemptions}
                  columns={redemptionColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
