import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, InputNumber, Button, Descriptions, message, Result, Steps, Spin } from 'antd';
import api from '../services/api';
import { formatAmount } from '../utils/format';
import type { Fund } from '../types';

const { Step } = Steps;

export default function Subscribe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    loadFund();
  }, [id]);

  const loadFund = async () => {
    try {
      const response: any = await api.get(`/funds/${id}`);
      setFund(response.data);
    } catch (error) {
      message.error('加载基金信息失败');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = (amount: number) => {
    if (!fund) return { fee: 0, netAmount: 0, estimatedShares: 0 };

    const fee = amount * fund.subscription_fee_rate;
    const netAmount = amount - fee;
    const estimatedShares = netAmount / fund.nav;

    return { fee, netAmount, estimatedShares };
  };

  const handleStepOne = (values: any) => {
    const { fee, netAmount, estimatedShares } = calculateFee(values.amount);
    setFormData({
      amount: values.amount,
      fee,
      netAmount,
      estimatedShares,
    });
    setCurrentStep(1);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const response: any = await api.post('/transactions/subscriptions', {
        fundId: id,
        amount: formData.amount,
      });

      setOrderInfo(response.data);
      setCurrentStep(2);
      message.success(response.message || '申购申请提交成功');
    } catch (error: any) {
      message.error(error.response?.data?.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!fund) {
    return <div>基金不存在</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>基金申购</h2>

      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        <Step title="填写申购信息" />
        <Step title="确认信息" />
        <Step title="完成" />
      </Steps>

      {currentStep === 0 && (
        <Card title="第一步：填写申购信息">
          <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="基金名称">{fund.fund_name}</Descriptions.Item>
            <Descriptions.Item label="基金代码">{fund.fund_code}</Descriptions.Item>
            <Descriptions.Item label="单位净值">{fund.nav.toFixed(4)}</Descriptions.Item>
            <Descriptions.Item label="申购费率">
              {(fund.subscription_fee_rate * 100).toFixed(2)}%
            </Descriptions.Item>
            <Descriptions.Item label="最低申购金额">
              {formatAmount(fund.min_subscription_amount)}
            </Descriptions.Item>
          </Descriptions>

          <Form
            layout="vertical"
            initialValues={{ amount: fund.min_subscription_amount }}
            onFinish={handleStepOne}
          >
            <Form.Item
              label="申购金额"
              name="amount"
              rules={[
                { required: true, message: '请输入申购金额' },
                {
                  type: 'number',
                  min: fund.min_subscription_amount,
                  message: `最低申购金额为 ${formatAmount(fund.min_subscription_amount)}`,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={fund.min_subscription_amount}
                step={1000}
                precision={2}
                prefix="¥"
                placeholder="请输入申购金额"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                下一步
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {currentStep === 1 && (
        <Card title="第二步：确认申购信息">
          <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="基金名称">{fund.fund_name}</Descriptions.Item>
            <Descriptions.Item label="申购金额">
              {formatAmount(formData.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="申购费用">
              {formatAmount(formData.fee)}
            </Descriptions.Item>
            <Descriptions.Item label="净申购金额">
              {formatAmount(formData.netAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="预计份额">
              {formData.estimatedShares.toFixed(2)} 份
            </Descriptions.Item>
            <Descriptions.Item label="参考净值">
              {fund.nav.toFixed(4)} (以实际确认净值为准)
            </Descriptions.Item>
          </Descriptions>

          <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', padding: 16, marginBottom: 24, borderRadius: 4 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>重要提示：</div>
            <div>1. 申购申请提交后不可撤销</div>
            <div>2. 份额确认以 T 日净值为准（T 为申请日）</div>
            <div>3. 预计 T+1 日确认份额，请注意查看</div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Button onClick={() => setCurrentStep(0)} size="large">
              上一步
            </Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={submitting}
              size="large"
            >
              确认提交
            </Button>
          </div>
        </Card>
      )}

      {currentStep === 2 && orderInfo && (
        <Result
          status="success"
          title="申购申请提交成功！"
          subTitle={`订单号: ${orderInfo.orderNumber}`}
          extra={[
            <Card key="info" style={{ textAlign: 'left', marginBottom: 16 }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="订单号">{orderInfo.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="申购金额">
                  {formatAmount(orderInfo.subscriptionAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="申购费用">
                  {formatAmount(orderInfo.subscriptionFee)}
                </Descriptions.Item>
                <Descriptions.Item label="净申购金额">
                  {formatAmount(orderInfo.netAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="预计份额">
                  {orderInfo.estimatedShares.toFixed(2)} 份
                </Descriptions.Item>
              </Descriptions>
            </Card>,
            <Button type="primary" key="holdings" onClick={() => navigate('/holdings')}>
              查看我的持仓
            </Button>,
            <Button key="continue" onClick={() => navigate('/funds')}>
              继续申购
            </Button>,
          ]}
        />
      )}
    </div>
  );
}
