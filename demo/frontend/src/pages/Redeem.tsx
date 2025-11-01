import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Steps,
  Form,
  InputNumber,
  Button,
  Descriptions,
  Result,
  message,
  Spin,
  Alert,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  DollarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import api from '../services/api';
import { formatAmount } from '../utils/format';

const { Step } = Steps;

interface Fund {
  id: string;
  fund_code: string;
  fund_name: string;
  nav: number;
  redemption_fee_rate: number;
}

interface Holding {
  id: string;
  fund_id: string;
  fund_name: string;
  fund_code: string;
  total_shares: number;
  available_shares: number;
  locked_shares: number;
  market_value: number;
}

const Redeem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fund, setFund] = useState<Fund | null>(null);
  const [holding, setHolding] = useState<Holding | null>(null);
  const [shares, setShares] = useState<number>(0);
  const [orderResult, setOrderResult] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchFundAndHolding();
    }
  }, [id]);

  const fetchFundAndHolding = async () => {
    setLoading(true);
    try {
      // 获取基金信息
      const fundResponse: any = await api.get(`/funds/${id}`);
      setFund(fundResponse.data);

      // 获取持仓信息
      const holdingResponse: any = await api.get('/holdings');
      const userHolding = holdingResponse.data.find((h: Holding) => h.fund_id === id);

      if (!userHolding || userHolding.available_shares <= 0) {
        message.error('您没有该基金的可赎回份额');
        navigate('/holdings');
        return;
      }

      setHolding(userHolding);
    } catch (error) {
      message.error('获取基金信息失败');
      navigate('/holdings');
    } finally {
      setLoading(false);
    }
  };

  const calculateRedemption = () => {
    if (!fund || !shares) {
      return {
        redemptionAmount: 0,
        redemptionFee: 0,
        netAmount: 0,
      };
    }

    const redemptionAmount = shares * fund.nav;
    const redemptionFee = redemptionAmount * fund.redemption_fee_rate;
    const netAmount = redemptionAmount - redemptionFee;

    return {
      redemptionAmount,
      redemptionFee,
      netAmount,
    };
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        setShares(values.shares);
        setCurrentStep(1);
      } catch (error) {
        // 表单验证失败
      }
    } else if (currentStep === 1) {
      await submitRedemption();
    }
  };

  const submitRedemption = async () => {
    setLoading(true);
    try {
      const response: any = await api.post('/transactions/redemptions', {
        fundId: id,
        shares: shares,
      });

      setOrderResult(response.data);
      setCurrentStep(2);
      message.success('赎回申请已提交');
    } catch (error: any) {
      message.error(error.response?.data?.message || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReturnHome = () => {
    navigate('/dashboard');
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };

  const calculation = calculateRedemption();

  if (loading && !fund) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card>
        <h2>基金赎回</h2>

        {fund && (
          <Alert
            message={
              <div>
                <strong>{fund.fund_name}</strong> ({fund.fund_code})
                <div style={{ marginTop: 8 }}>
                  当前净值: <strong>{fund.nav.toFixed(4)}</strong> | 赎回费率:{' '}
                  <strong>{(fund.redemption_fee_rate * 100).toFixed(2)}%</strong>
                </div>
              </div>
            }
            type="info"
            style={{ marginBottom: 24 }}
          />
        )}

        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          <Step title="输入赎回份额" icon={<DollarOutlined />} />
          <Step title="确认赎回信息" icon={<InfoCircleOutlined />} />
          <Step title="完成" icon={<CheckCircleOutlined />} />
        </Steps>

        {/* 步骤1: 输入赎回份额 */}
        {currentStep === 0 && holding && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="持有份额"
                    value={holding.total_shares}
                    precision={2}
                    suffix="份"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="可赎回份额"
                    value={holding.available_shares}
                    precision={2}
                    suffix="份"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="锁定份额"
                    value={holding.locked_shares}
                    precision={2}
                    suffix="份"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            <Form form={form} layout="vertical">
              <Form.Item
                label="赎回份额"
                name="shares"
                rules={[
                  { required: true, message: '请输入赎回份额' },
                  {
                    type: 'number',
                    min: 0.01,
                    message: '赎回份额必须大于0',
                  },
                  {
                    validator: (_, value) => {
                      if (value > holding.available_shares) {
                        return Promise.reject('赎回份额不能超过可用份额');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入赎回份额"
                  precision={2}
                  min={0}
                  max={holding.available_shares}
                  onChange={(value) => {
                    if (value) {
                      form.setFieldsValue({ shares: value });
                      setShares(value);
                    }
                  }}
                  addonAfter="份"
                />
              </Form.Item>

              {shares > 0 && fund && (
                <Card title="预估赎回金额" style={{ marginTop: 16 }}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="赎回份额">
                      {shares.toLocaleString()} 份
                    </Descriptions.Item>
                    <Descriptions.Item label="单位净值">
                      {fund.nav.toFixed(4)}
                    </Descriptions.Item>
                    <Descriptions.Item label="赎回金额">
                      {formatAmount(calculation.redemptionAmount)}
                    </Descriptions.Item>
                    <Descriptions.Item label="赎回费用">
                      -{formatAmount(calculation.redemptionFee)}
                    </Descriptions.Item>
                    <Descriptions.Item label="预计到账">
                      <strong style={{ fontSize: 18, color: '#52c41a' }}>
                        {formatAmount(calculation.netAmount)}
                      </strong>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              )}

              <Alert
                message="赎回说明"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    <li>赎回申请提交后需要GP审批</li>
                    <li>审批通过后，赎回款项将在T+3个工作日内到账</li>
                    <li>赎回费率为{((fund?.redemption_fee_rate || 0) * 100).toFixed(2)}%</li>
                    <li>赎回提交后，对应份额将被锁定，无法再次赎回</li>
                  </ul>
                }
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Form>
          </div>
        )}

        {/* 步骤2: 确认赎回信息 */}
        {currentStep === 1 && fund && (
          <div>
            <Card title="请确认以下赎回信息">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="基金名称">{fund.fund_name}</Descriptions.Item>
                <Descriptions.Item label="基金代码">{fund.fund_code}</Descriptions.Item>
                <Descriptions.Item label="赎回份额">
                  <strong>{shares.toLocaleString()} 份</strong>
                </Descriptions.Item>
                <Descriptions.Item label="单位净值">{fund.nav.toFixed(4)}</Descriptions.Item>
                <Descriptions.Item label="赎回金额">
                  {formatAmount(calculation.redemptionAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="赎回费用 ({(fund.redemption_fee_rate * 100).toFixed(2)}%)">
                  {formatAmount(calculation.redemptionFee)}
                </Descriptions.Item>
                <Descriptions.Item label="预计到账金额">
                  <strong style={{ fontSize: 18, color: '#52c41a' }}>
                    {formatAmount(calculation.netAmount)}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="预计到账时间">审批通过后 T+3 工作日</Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              message="风险提示"
              description="请确认以上赎回信息无误。提交后，赎回申请将进入审批流程，审批期间份额将被锁定。"
              type="error"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        )}

        {/* 步骤3: 完成 */}
        {currentStep === 2 && orderResult && (
          <Result
            status="success"
            title="赎回申请已提交！"
            subTitle={
              <div>
                <p>订单编号: {orderResult.orderNumber}</p>
                <p>您的赎回申请已成功提交，等待GP审批</p>
              </div>
            }
            extra={[
              <Button type="primary" key="home" onClick={handleReturnHome}>
                返回首页
              </Button>,
              <Button key="transactions" onClick={handleViewTransactions}>
                查看交易记录
              </Button>,
            ]}
          >
            <Card>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="赎回份额">
                  {orderResult.redemptionShares?.toLocaleString()} 份
                </Descriptions.Item>
                <Descriptions.Item label="预估赎回金额">
                  {formatAmount(orderResult.estimatedAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="赎回费用">
                  {formatAmount(orderResult.redemptionFee)}
                </Descriptions.Item>
                <Descriptions.Item label="预计到账金额">
                  <strong style={{ fontSize: 18, color: '#52c41a' }}>
                    {formatAmount(orderResult.netAmount)}
                  </strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              message="后续流程"
              description={
                <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>GP将在1-2个工作日内审批您的赎回申请</li>
                  <li>审批通过后，您将收到通知</li>
                  <li>赎回款项将在审批通过后T+3个工作日内到账</li>
                  <li>您可以在"交易记录"中查看赎回进度</li>
                </ol>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Result>
        )}

        {/* 操作按钮 */}
        {currentStep < 2 && (
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 8 }} onClick={handlePrev}>
                上一步
              </Button>
            )}
            {currentStep === 0 && (
              <Button onClick={() => navigate('/holdings')}>取消</Button>
            )}
            <Button
              type="primary"
              onClick={handleNext}
              loading={loading}
              disabled={currentStep === 0 && shares <= 0}
            >
              {currentStep === 0 ? '下一步' : '确认赎回'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Redeem;
