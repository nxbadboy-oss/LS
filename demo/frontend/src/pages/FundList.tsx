import { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Button, Spin, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatAmount, formatPercent, getFundTypeText } from '../utils/format';
import type { Fund } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FundList() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [navHistory, setNavHistory] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLP = user.role === 'LP_INVESTOR';

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      const response: any = await api.get('/funds');
      setFunds(response.data);
    } catch (error) {
      message.error('加载基金列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (fund: Fund) => {
    setSelectedFund(fund);
    setModalVisible(true);

    try {
      const response: any = await api.get(`/funds/${fund.id}/nav?limit=30`);
      setNavHistory(response.data);
    } catch (error) {
      message.error('加载净值历史失败');
    }
  };

  const handleSubscribe = (fundId: string) => {
    navigate(`/subscribe/${fundId}`);
  };

  const getFundTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      EQUITY: 'red',
      BOND: 'blue',
      HYBRID: 'purple',
      MONEY_MARKET: 'green',
    };
    return colorMap[type] || 'default';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>基金列表</h2>
        <span style={{ color: '#666' }}>共 {funds.length} 只基金</span>
      </div>

      <Row gutter={[16, 16]}>
        {funds.map((fund) => (
          <Col xs={24} sm={12} lg={8} key={fund.id}>
            <Card
              hoverable
              title={
                <div>
                  <div>{fund.fund_name}</div>
                  <div style={{ fontSize: 12, fontWeight: 'normal', color: '#666' }}>
                    {fund.fund_code}
                  </div>
                </div>
              }
              extra={
                <Tag color={getFundTypeColor(fund.fund_type)}>
                  {getFundTypeText(fund.fund_type)}
                </Tag>
              }
            >
              <div style={{ marginBottom: 16 }}>
                <Row>
                  <Col span={12}>
                    <div style={{ color: '#666', fontSize: 12 }}>单位净值</div>
                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                      {fund.nav.toFixed(4)}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#666', fontSize: 12 }}>累计净值</div>
                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {fund.accumulated_nav.toFixed(4)}
                    </div>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Row>
                  <Col span={12}>
                    <div style={{ color: '#666', fontSize: 12 }}>基金规模</div>
                    <div style={{ fontSize: 14 }}>
                      {formatAmount(fund.total_assets, 0)}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#666', fontSize: 12 }}>成立日期</div>
                    <div style={{ fontSize: 14 }}>
                      {fund.inception_date}
                    </div>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 16, fontSize: 12, color: '#999' }}>
                <div>管理费率: {formatPercent(fund.management_fee_rate * 100, 2)}</div>
                <div>申购费率: {formatPercent(fund.subscription_fee_rate * 100, 2)}</div>
                <div>最低申购: {formatAmount(fund.min_subscription_amount)}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => handleViewDetail(fund)} block>
                  查看详情
                </Button>
                {isLP && (
                  <Button
                    type="primary"
                    onClick={() => handleSubscribe(fund.id)}
                    block
                  >
                    立即申购
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={selectedFund?.fund_name}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          isLP && selectedFund && (
            <Button
              key="subscribe"
              type="primary"
              onClick={() => {
                setModalVisible(false);
                handleSubscribe(selectedFund.id);
              }}
            >
              立即申购
            </Button>
          ),
        ]}
      >
        {selectedFund && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <div><strong>基金代码:</strong> {selectedFund.fund_code}</div>
                <div><strong>基金类型:</strong> {getFundTypeText(selectedFund.fund_type)}</div>
                <div><strong>成立日期:</strong> {selectedFund.inception_date}</div>
              </Col>
              <Col span={12}>
                <div><strong>单位净值:</strong> {selectedFund.nav.toFixed(4)}</div>
                <div><strong>累计净值:</strong> {selectedFund.accumulated_nav.toFixed(4)}</div>
                <div><strong>基金规模:</strong> {formatAmount(selectedFund.total_assets, 0)}</div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>费率信息:</strong>
              <div>管理费率: {formatPercent(selectedFund.management_fee_rate * 100)}</div>
              <div>申购费率: {formatPercent(selectedFund.subscription_fee_rate * 100)}</div>
              <div>赎回费率: {formatPercent(selectedFund.redemption_fee_rate * 100)}</div>
              <div>最低申购金额: {formatAmount(selectedFund.min_subscription_amount)}</div>
            </div>

            <div>
              <strong>近30日净值走势:</strong>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={navHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nav_date" />
                  <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="nav" stroke="#1890ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
