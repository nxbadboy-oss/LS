# 前端代码示例

将以下代码复制到对应的文件中即可快速启动前端应用。

## src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## src/index.css

```css
:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  margin: 0;
  padding: 0;
}

#root {
  min-height: 100vh;
}
```

## src/App.tsx

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FundList from './pages/FundList';
import Subscribe from './pages/Subscribe';
import Holdings from './pages/Holdings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/funds" element={<PrivateRoute><FundList /></PrivateRoute>} />
          <Route path="/subscribe/:id" element={<PrivateRoute><Subscribe /></PrivateRoute>} />
          <Route path="/holdings" element={<PrivateRoute><Holdings /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
```

## src/services/api.ts

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## src/components/PrivateRoute.tsx

```typescript
import { Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, FundOutlined, WalletOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '首页', onClick: () => navigate('/dashboard') },
    { key: 'funds', icon: <FundOutlined />, label: '基金列表', onClick: () => navigate('/funds') },
    { key: 'holdings', icon: <WalletOutlined />, label: '我的持仓', onClick: () => navigate('/holdings') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>天汇基金 OFC 平台</div>
        <div>
          <span style={{ marginRight: '20px' }}>{user.name || user.username}</span>
          <LogoutOutlined onClick={handleLogout} style={{ cursor: 'pointer' }} />
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu mode="inline" items={menuItems} style={{ height: '100%', borderRight: 0 }} />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
```

## src/pages/Login.tsx

```typescript
import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response: any = await api.post('/auth/login', values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card title="天汇基金 OFC 平台" style={{ width: 400 }}>
        <Form onFinish={handleLogin} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 20, fontSize: 12, color: '#999' }}>
          <div>演示账号:</div>
          <div>GP管理员: gp-admin / 123456</div>
          <div>LP投资者: lp-001 / 123456</div>
        </div>
      </Card>
    </div>
  );
}
```

## src/pages/Dashboard.tsx

```typescript
import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>({});
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
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (isLP) {
    return (
      <div>
        <h2>我的资产</h2>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总资产"
                value={data.summary?.totalMarketValue || 0}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总投资"
                value={data.summary?.totalInvestment || 0}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总收益"
                value={data.summary?.totalProfit || 0}
                precision={2}
                prefix="¥"
                valueStyle={{ color: data.summary?.totalProfit >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={data.summary?.totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="收益率"
                value={data.summary?.returnRate || 0}
                precision={2}
                suffix="%"
                valueStyle={{ color: data.summary?.returnRate >= 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="收益曲线" style={{ marginTop: 20 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.performanceHistory || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="持仓明细" style={{ marginTop: 20 }}>
          <Table
            dataSource={data.holdings || []}
            columns={[
              { title: '基金名称', dataIndex: 'fund_name', key: 'fund_name' },
              { title: '份额', dataIndex: 'total_shares', key: 'total_shares', render: (v) => v.toFixed(2) },
              { title: '市值', dataIndex: 'market_value', key: 'market_value', render: (v) => `¥${v.toFixed(2)}` },
              {
                title: '收益',
                dataIndex: 'unrealized_profit',
                key: 'unrealized_profit',
                render: (v) => (
                  <span style={{ color: v >= 0 ? '#3f8600' : '#cf1322' }}>
                    ¥{v.toFixed(2)}
                  </span>
                ),
              },
            ]}
            rowKey="id"
            loading={loading}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2>管理概览</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="基金数量" value={data.summary?.totalFunds || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="投资者数量" value={data.summary?.totalInvestors || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="管理规模" value={data.summary?.totalAUM || 0} precision={2} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待处理申购" value={data.summary?.pendingSubscriptions || 0} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Card title="最近交易" style={{ marginTop: 20 }}>
        <Table
          dataSource={data.recentTransactions || []}
          columns={[
            { title: '订单号', dataIndex: 'order_number', key: 'order_number' },
            { title: '投资者', dataIndex: 'investor_name', key: 'investor_name' },
            { title: '基金', dataIndex: 'fund_name', key: 'fund_name' },
            { title: '金额', dataIndex: 'amount', key: 'amount', render: (v) => `¥${v.toFixed(2)}` },
            { title: '状态', dataIndex: 'status', key: 'status' },
          ]}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
}
```

## 完整代码包

以上是核心页面的示例代码。完整的前端应用还包括：

- FundList.tsx - 基金列表页
- Subscribe.tsx - 申购页面
- Holdings.tsx - 持仓详情页

您可以基于这些示例继续开发其他页面，或者参考主项目文档中的完整设计。

## 快速测试

1. 将上述代码复制到对应文件
2. 运行 `npm install` 安装依赖
3. 运行 `npm run dev` 启动开发服务器
4. 访问 http://localhost:5173
5. 使用演示账号登录测试

## 注意事项

- 确保后端服务已启动 (http://localhost:3000)
- vite.config.ts 中已配置代理，无需修改
- 所有 API 调用会自动添加 JWT token
- 登录后 token 保存在 localStorage

## 需要添加的页面

基于以上模板，您可以快速开发：

- 基金详情页
- 申购确认页面
- 交易记录页面
- 投资者管理页面（GP）
- 报表下载页面

参考 TECHNICAL_SPECS.md 中的 API 文档进行开发。
