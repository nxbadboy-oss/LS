import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Descriptions,
  message,
  Tabs,
  Statistic,
  Row,
  Col,
  Select,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import { formatAmount, formatDate } from '../../utils/format';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface Approval {
  id: string;
  transaction_id: string;
  transaction_type: 'SUBSCRIPTION' | 'REDEMPTION';
  investor_id: string;
  investor_name: string;
  investor_code: string;
  fund_id: string;
  fund_name: string;
  fund_code: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  submitted_at: string;
  submitted_by_name: string;
  processed_at?: string;
  approved_by?: string;
  approval_notes?: string;
  rejection_reason?: string;
}

interface ApprovalStats {
  byStatus: Array<{ status: string; count: number }>;
  byType: Array<{ transaction_type: string; count: number }>;
  todayPending: number;
  last7Days: Array<{ date: string; count: number }>;
}

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentApproval, setCurrentApproval] = useState<Approval | null>(null);
  const [transactionDetail, setTransactionDetail] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [filterType, setFilterType] = useState<string>('');

  const [approveForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  useEffect(() => {
    fetchApprovals();
    fetchStats();
  }, [filterStatus, filterType]);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.type = filterType;

      const response: any = await api.get('/approvals', { params });
      setApprovals(response.data);
    } catch (error) {
      message.error('获取审批列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response: any = await api.get('/approvals/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  };

  const showDetail = async (record: Approval) => {
    setCurrentApproval(record);
    try {
      const response: any = await api.get(`/approvals/${record.id}`);
      setTransactionDetail(response.data.transactionDetails);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('获取详情失败');
    }
  };

  const handleApprove = (record: Approval) => {
    setCurrentApproval(record);
    approveForm.resetFields();
    setApproveModalVisible(true);
  };

  const handleReject = (record: Approval) => {
    setCurrentApproval(record);
    rejectForm.resetFields();
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    try {
      const values = await approveForm.validateFields();
      await api.post(`/approvals/${currentApproval!.id}/approve`, {
        approval_notes: values.notes,
      });
      message.success('审批通过');
      setApproveModalVisible(false);
      fetchApprovals();
      fetchStats();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('审批失败');
    }
  };

  const confirmReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      await api.post(`/approvals/${currentApproval!.id}/reject`, {
        rejection_reason: values.reason,
      });
      message.success('已拒绝');
      setRejectModalVisible(false);
      fetchApprovals();
      fetchStats();
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleBatchApprove = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要审批的项目');
      return;
    }

    Modal.confirm({
      title: '批量审批确认',
      content: `确定要批准选中的 ${selectedRowKeys.length} 个申请吗？`,
      onOk: async () => {
        try {
          await api.post('/approvals/batch-approve', {
            approval_ids: selectedRowKeys,
            approval_notes: '批量审批通过',
          });
          message.success('批量审批成功');
          fetchApprovals();
          fetchStats();
          setSelectedRowKeys([]);
        } catch (error) {
          message.error('批量审批失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (text: string) => formatDate(text),
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type: string) => (
        <Tag color={type === 'SUBSCRIPTION' ? 'blue' : 'orange'}>
          {type === 'SUBSCRIPTION' ? '申购' : '赎回'}
        </Tag>
      ),
      width: 80,
    },
    {
      title: '投资者',
      dataIndex: 'investor_name',
      key: 'investor_name',
      render: (text: string, record: Approval) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.investor_code}</div>
        </div>
      ),
      width: 150,
    },
    {
      title: '基金',
      dataIndex: 'fund_name',
      key: 'fund_name',
      render: (text: string, record: Approval) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.fund_code}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>{formatAmount(amount)}</span>
      ),
      width: 120,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const config: any = {
          URGENT: { color: 'red', text: '紧急' },
          HIGH: { color: 'orange', text: '高' },
          NORMAL: { color: 'blue', text: '普通' },
          LOW: { color: 'default', text: '低' },
        };
        return <Tag color={config[priority]?.color}>{config[priority]?.text}</Tag>;
      },
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: any = {
          PENDING: { color: 'gold', icon: <ClockCircleOutlined />, text: '待审批' },
          APPROVED: { color: 'green', icon: <CheckCircleOutlined />, text: '已批准' },
          REJECTED: { color: 'red', icon: <CloseCircleOutlined />, text: '已拒绝' },
        };
        return (
          <Tag color={config[status]?.color} icon={config[status]?.icon}>
            {config[status]?.text}
          </Tag>
        );
      },
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Approval) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                size="small"
                style={{ color: '#52c41a' }}
                onClick={() => handleApprove(record)}
              >
                批准
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => handleReject(record)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
      width: 180,
      fixed: 'right' as const,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record: Approval) => ({
      disabled: record.status !== 'PENDING',
    }),
  };

  const pendingCount = stats?.byStatus?.find((s) => s.status === 'PENDING')?.count || 0;
  const approvedCount = stats?.byStatus?.find((s) => s.status === 'APPROVED')?.count || 0;
  const rejectedCount = stats?.byStatus?.find((s) => s.status === 'REJECTED')?.count || 0;

  return (
    <div style={{ padding: 24 }}>
      <h2>审批中心</h2>

      {/* 统计面板 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日待审批"
              value={stats?.todayPending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审批总数"
              value={pendingCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已批准"
              value={approvedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已拒绝"
              value={rejectedCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 审批列表 */}
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <span>状态:</span>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 120 }}
          >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="PENDING">待审批</Select.Option>
            <Select.Option value="APPROVED">已批准</Select.Option>
            <Select.Option value="REJECTED">已拒绝</Select.Option>
          </Select>

          <span>类型:</span>
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 120 }}
          >
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="SUBSCRIPTION">申购</Select.Option>
            <Select.Option value="REDEMPTION">赎回</Select.Option>
          </Select>

          {selectedRowKeys.length > 0 && (
            <Button type="primary" onClick={handleBatchApprove}>
              批量审批 ({selectedRowKeys.length})
            </Button>
          )}
        </Space>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={approvals}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情对话框 */}
      <Modal
        title="审批详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentApproval && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="交易信息" key="1">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="交易类型">
                  {currentApproval.transaction_type === 'SUBSCRIPTION' ? '申购' : '赎回'}
                </Descriptions.Item>
                <Descriptions.Item label="交易金额">
                  {formatAmount(currentApproval.amount)}
                </Descriptions.Item>
                <Descriptions.Item label="投资者">
                  {currentApproval.investor_name}
                </Descriptions.Item>
                <Descriptions.Item label="投资者代码">
                  {currentApproval.investor_code}
                </Descriptions.Item>
                <Descriptions.Item label="基金名称" span={2}>
                  {currentApproval.fund_name}
                </Descriptions.Item>
                <Descriptions.Item label="基金代码">
                  {currentApproval.fund_code}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {formatDate(currentApproval.submitted_at)}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={currentApproval.status === 'PENDING' ? 'gold' : 'green'}>
                    {currentApproval.status === 'PENDING' ? '待审批' : '已处理'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="优先级">
                  <Tag>{currentApproval.priority}</Tag>
                </Descriptions.Item>
                {transactionDetail && (
                  <>
                    <Descriptions.Item label="手续费">
                      {formatAmount(
                        transactionDetail.subscription_fee || transactionDetail.redemption_fee || 0
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="净金额">
                      {formatAmount(transactionDetail.net_amount || 0)}
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </TabPane>
            <TabPane tab="审批记录" key="2">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="提交人">
                  {currentApproval.submitted_by_name}
                </Descriptions.Item>
                <Descriptions.Item label="提交时间">
                  {formatDate(currentApproval.submitted_at)}
                </Descriptions.Item>
                {currentApproval.processed_at && (
                  <>
                    <Descriptions.Item label="处理时间">
                      {formatDate(currentApproval.processed_at)}
                    </Descriptions.Item>
                    <Descriptions.Item label="处理人">
                      {currentApproval.approved_by || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="审批备注">
                      {currentApproval.approval_notes || '-'}
                    </Descriptions.Item>
                    {currentApproval.rejection_reason && (
                      <Descriptions.Item label="拒绝原因">
                        <span style={{ color: 'red' }}>
                          {currentApproval.rejection_reason}
                        </span>
                      </Descriptions.Item>
                    )}
                  </>
                )}
              </Descriptions>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* 批准对话框 */}
      <Modal
        title="批准审批"
        open={approveModalVisible}
        onOk={confirmApprove}
        onCancel={() => setApproveModalVisible(false)}
        okText="确认批准"
        cancelText="取消"
      >
        <Form form={approveForm} layout="vertical">
          <Form.Item label="审批备注" name="notes">
            <TextArea rows={4} placeholder="可选填写审批备注" />
          </Form.Item>
        </Form>
        <p style={{ color: '#999', marginTop: 16 }}>
          批准后，交易将进入确认阶段，等待份额确认。
        </p>
      </Modal>

      {/* 拒绝对话框 */}
      <Modal
        title="拒绝审批"
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="确认拒绝"
        okButtonProps={{ danger: true }}
        cancelText="取消"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            label="拒绝原因"
            name="reason"
            rules={[{ required: true, message: '请填写拒绝原因' }]}
          >
            <TextArea rows={4} placeholder="请说明拒绝原因（必填）" />
          </Form.Item>
        </Form>
        <p style={{ color: '#ff4d4f', marginTop: 16 }}>
          拒绝后，投资者将收到通知，交易将被取消。
        </p>
      </Modal>
    </div>
  );
};

export default Approvals;
