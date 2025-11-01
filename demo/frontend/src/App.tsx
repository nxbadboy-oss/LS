import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FundList from './pages/FundList';
import Subscribe from './pages/Subscribe';
import Redeem from './pages/Redeem';
import Holdings from './pages/Holdings';
import Transactions from './pages/Transactions';
import Approvals from './pages/gp/Approvals';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/funds"
            element={
              <PrivateRoute>
                <FundList />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscribe/:id"
            element={
              <PrivateRoute>
                <Subscribe />
              </PrivateRoute>
            }
          />
          <Route
            path="/holdings"
            element={
              <PrivateRoute>
                <Holdings />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path="/redeem/:id"
            element={
              <PrivateRoute>
                <Redeem />
              </PrivateRoute>
            }
          />
          <Route
            path="/gp/approvals"
            element={
              <PrivateRoute>
                <Approvals />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
