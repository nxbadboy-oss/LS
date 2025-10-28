import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FundOutlined,
  WalletOutlined,
  TransactionOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 根据当前路径确定选中的菜单项
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'funds',
      icon: <FundOutlined />,
      label: '基金列表',
      onClick: () => navigate('/funds'),
    },
    {
      key: 'holdings',
      icon: <WalletOutlined />,
      label: '我的持仓',
      onClick: () => navigate('/holdings'),
    },
    {
      key: 'transactions',
      icon: <TransactionOutlined />,
      label: '交易记录',
      onClick: () => navigate('/transactions'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#001529',
        padding: '0 24px'
      }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          天汇基金 OFC 平台
        </div>
        <div style={{ color: 'white' }}>
          <span style={{ marginRight: '20px' }}>
            {user.name || user.username} ({user.role === 'LP_INVESTOR' ? 'LP' : 'GP'})
          </span>
          <LogoutOutlined
            onClick={handleLogout}
            style={{ cursor: 'pointer', fontSize: '16px' }}
          />
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
