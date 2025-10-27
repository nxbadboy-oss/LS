# 天汇基金 OFC 平台 - 技术规范文档

## API 设计规范

### RESTful API 设计原则

#### 1. 基础路径
```
https://api.tianhuifund.com/v1
```

#### 2. 资源命名规范
- 使用名词复数形式
- 使用小写字母和连字符
- 避免深层嵌套（最多3层）

#### 3. HTTP 方法语义
```
GET     /funds              # 获取基金列表
GET     /funds/:id          # 获取单个基金详情
POST    /funds              # 创建新基金
PUT     /funds/:id          # 更新基金（全量）
PATCH   /funds/:id          # 更新基金（部分）
DELETE  /funds/:id          # 删除基金
```

---

### 核心 API 端点

#### 1. 认证相关

```typescript
// 登录
POST /auth/login
Request: {
  username: string;
  password: string;
  mfaCode?: string;
}
Response: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDTO;
}

// 刷新令牌
POST /auth/refresh
Request: {
  refreshToken: string;
}
Response: {
  accessToken: string;
  expiresIn: number;
}

// 登出
POST /auth/logout
Request: {
  refreshToken: string;
}
Response: {
  message: string;
}

// 修改密码
POST /auth/change-password
Request: {
  oldPassword: string;
  newPassword: string;
}
Response: {
  message: string;
}
```

#### 2. 基金管理

```typescript
// 获取基金列表
GET /funds?page=1&limit=20&status=ACTIVE&type=EQUITY
Response: {
  data: Fund[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 获取基金详情
GET /funds/:fundId
Response: {
  id: string;
  fundCode: string;
  fundName: string;
  fundType: string;
  inceptionDate: string;
  managementFeeRate: number;
  status: string;
  currentNav: number;
  totalAssets: number;
  totalShares: number;
  // ... 其他字段
}

// 创建基金
POST /funds
Request: {
  fundCode: string;
  fundName: string;
  fundType: string;
  investmentStrategy: string;
  managementFeeRate: number;
  // ... 其他字段
}
Response: {
  id: string;
  message: string;
}

// 获取基金净值历史
GET /funds/:fundId/nav?startDate=2024-01-01&endDate=2024-12-31
Response: {
  data: [{
    navDate: string;
    nav: number;
    accumulatedNav: number;
    dailyReturn: number;
  }];
}

// 更新基金净值
POST /funds/:fundId/nav
Request: {
  navDate: string;
  nav: number;
  totalAssets: number;
  totalLiabilities: number;
}
Response: {
  message: string;
}
```

#### 3. 投资者管理

```typescript
// 获取投资者列表
GET /investors?page=1&limit=20&type=INDIVIDUAL&kycStatus=APPROVED
Response: {
  data: Investor[];
  pagination: PaginationDTO;
}

// 获取投资者详情
GET /investors/:investorId
Response: {
  id: string;
  name: string;
  investorType: string;
  idNumber: string;
  riskLevel: string;
  kycStatus: string;
  totalInvestment: number;
  totalMarketValue: number;
  totalReturn: number;
  holdings: [{
    fundId: string;
    fundName: string;
    shares: number;
    marketValue: number;
    return: number;
  }];
}

// 创建投资者
POST /investors
Request: {
  userId: string;
  name: string;
  investorType: string;
  idType: string;
  idNumber: string;
  bankAccount: string;
  bankName: string;
}
Response: {
  id: string;
  message: string;
}

// 更新 KYC 状态
PATCH /investors/:investorId/kyc
Request: {
  kycStatus: 'APPROVED' | 'REJECTED';
  remark?: string;
}
Response: {
  message: string;
}
```

#### 4. 申购赎回

```typescript
// 提交申购申请
POST /transactions/subscriptions
Request: {
  investorId: string;
  fundId: string;
  subscriptionAmount: number;
  paymentMethod: string;
}
Response: {
  orderNumber: string;
  estimatedShares: number;
  estimatedFee: number;
  message: string;
}

// 获取申购记录
GET /transactions/subscriptions?investorId=xxx&status=PENDING
Response: {
  data: [{
    id: string;
    orderNumber: string;
    fundName: string;
    subscriptionAmount: number;
    subscriptionFee: number;
    confirmedShares: number;
    status: string;
    applyDate: string;
    confirmDate: string;
  }];
  pagination: PaginationDTO;
}

// 确认申购
PATCH /transactions/subscriptions/:orderId/confirm
Request: {
  confirmedShares: number;
  nav: number;
  navDate: string;
}
Response: {
  message: string;
}

// 提交赎回申请
POST /transactions/redemptions
Request: {
  investorId: string;
  fundId: string;
  redemptionShares: number;
}
Response: {
  orderNumber: string;
  estimatedAmount: number;
  estimatedFee: number;
  message: string;
}

// 获取赎回记录
GET /transactions/redemptions?investorId=xxx&status=CONFIRMED
Response: {
  data: RedemptionDTO[];
  pagination: PaginationDTO;
}

// 确认赎回
PATCH /transactions/redemptions/:orderId/confirm
Request: {
  redemptionAmount: number;
  nav: number;
  navDate: string;
}
Response: {
  message: string;
}
```

#### 5. 持仓账户

```typescript
// 获取持仓列表
GET /holdings/accounts?investorId=xxx
Response: {
  data: [{
    id: string;
    accountNumber: string;
    fundId: string;
    fundName: string;
    totalShares: number;
    availableShares: number;
    frozenShares: number;
    marketValue: number;
    totalCost: number;
    unrealizedProfit: number;
    returnRate: number;
  }];
}

// 获取持仓详情
GET /holdings/accounts/:accountId
Response: {
  account: HoldingsAccountDTO;
  transactions: TransactionDTO[];
  performance: {
    dailyReturn: number;
    weeklyReturn: number;
    monthlyReturn: number;
    yearlyReturn: number;
    sinceInception: number;
  };
}

// 获取交易流水
GET /holdings/accounts/:accountId/transactions
Response: {
  data: [{
    transactionNumber: string;
    transactionType: string;
    amount: number;
    shares: number;
    fee: number;
    nav: number;
    transactionDate: string;
    status: string;
  }];
  pagination: PaginationDTO;
}
```

#### 6. 报表生成

```typescript
// 生成持仓报表
POST /reports/holdings
Request: {
  investorId: string;
  reportDate: string;
  format: 'PDF' | 'EXCEL';
}
Response: {
  reportId: string;
  downloadUrl: string;
  expiresAt: string;
}

// 生成收益报表
POST /reports/performance
Request: {
  investorId?: string;
  fundId?: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'EXCEL';
}
Response: {
  reportId: string;
  downloadUrl: string;
}

// 生成交易对账单
POST /reports/statements
Request: {
  investorId: string;
  year: number;
  quarter: number;
  format: 'PDF' | 'EXCEL';
}
Response: {
  reportId: string;
  downloadUrl: string;
}

// 获取报表列表
GET /reports?type=HOLDINGS&status=COMPLETED
Response: {
  data: [{
    reportId: string;
    reportType: string;
    fileName: string;
    downloadUrl: string;
    createdAt: string;
    expiresAt: string;
  }];
}
```

#### 7. 通知消息

```typescript
// 获取通知列表
GET /notifications?isRead=false&page=1&limit=20
Response: {
  data: [{
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    isRead: boolean;
    createdAt: string;
  }];
  pagination: PaginationDTO;
  unreadCount: number;
}

// 标记为已读
PATCH /notifications/:notificationId/read
Response: {
  message: string;
}

// 批量标记已读
POST /notifications/mark-all-read
Response: {
  count: number;
  message: string;
}
```

#### 8. Dashboard 数据

```typescript
// GP Dashboard
GET /dashboard/gp
Response: {
  totalFunds: number;
  totalInvestors: number;
  totalAUM: number; // 管理资产规模
  pendingSubscriptions: number;
  pendingRedemptions: number;
  recentTransactions: TransactionDTO[];
  performanceSummary: {
    avgReturn: number;
    bestPerformer: FundDTO;
    worstPerformer: FundDTO;
  };
  aumTrend: {
    date: string;
    amount: number;
  }[];
}

// LP Dashboard
GET /dashboard/lp/:investorId
Response: {
  totalInvestment: number;
  currentMarketValue: number;
  totalReturn: number;
  returnRate: number;
  holdings: HoldingsAccountDTO[];
  assetAllocation: {
    fundType: string;
    value: number;
    percentage: number;
  }[];
  performanceTrend: {
    date: string;
    value: number;
  }[];
  recentTransactions: TransactionDTO[];
}
```

---

## 数据传输对象（DTO）

### 通用响应格式

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// 分页响应
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
```

### 核心 DTO 定义

```typescript
// 用户 DTO
interface UserDTO {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'GP_ADMIN' | 'GP_OPERATOR' | 'LP_INVESTOR';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  mfaEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
}

// 基金 DTO
interface FundDTO {
  id: string;
  fundCode: string;
  fundName: string;
  fundType: string;
  investmentStrategy: string;
  benchmark: string;
  inceptionDate: string;
  managementFeeRate: number;
  currentNav: number;
  accumulatedNav: number;
  totalAssets: number;
  totalShares: number;
  status: string;
  createdAt: string;
}

// 投资者 DTO
interface InvestorDTO {
  id: string;
  name: string;
  investorType: 'INDIVIDUAL' | 'INSTITUTIONAL';
  idNumber: string;
  riskLevel: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalInvestment: number;
  totalMarketValue: number;
  totalReturn: number;
  returnRate: number;
  createdAt: string;
}

// 持仓账户 DTO
interface HoldingsAccountDTO {
  id: string;
  accountNumber: string;
  investorId: string;
  investorName: string;
  fundId: string;
  fundName: string;
  totalShares: number;
  availableShares: number;
  frozenShares: number;
  totalCost: number;
  marketValue: number;
  unrealizedProfit: number;
  realizedProfit: number;
  returnRate: number;
  updatedAt: string;
}

// 交易 DTO
interface TransactionDTO {
  id: string;
  transactionNumber: string;
  transactionType: 'SUBSCRIPTION' | 'REDEMPTION' | 'DIVIDEND';
  investorName: string;
  fundName: string;
  amount: number;
  shares: number;
  fee: number;
  nav: number;
  status: string;
  transactionDate: string;
  createdAt: string;
}
```

---

## 安全规范

### 1. 认证与授权

#### JWT 令牌结构
```typescript
interface JWTPayload {
  sub: string;        // 用户 ID
  username: string;
  role: string;
  orgId?: string;     // GP 机构 ID
  investorId?: string; // LP 投资者 ID
  iat: number;        // 签发时间
  exp: number;        // 过期时间
}
```

#### 令牌配置
```yaml
Access Token:
  有效期: 15 分钟
  用途: API 调用
  存储: 内存 (不存 localStorage)

Refresh Token:
  有效期: 7 天
  用途: 刷新 Access Token
  存储: HttpOnly Cookie

MFA:
  方式: TOTP (Time-based One-Time Password)
  有效期: 30 秒
  强制启用: GP 管理员
```

### 2. 权限控制

#### 角色权限矩阵

| 功能模块 | Super Admin | GP Admin | GP Operator | LP Investor |
|---------|------------|----------|-------------|-------------|
| 用户管理 | ✓ | ✓ | - | - |
| 基金创建 | ✓ | ✓ | - | - |
| 基金编辑 | ✓ | ✓ | ✓ | - |
| 净值录入 | ✓ | ✓ | ✓ | - |
| 投资者管理 | ✓ | ✓ | ✓ | - |
| 申购审核 | ✓ | ✓ | ✓ | - |
| 赎回审核 | ✓ | ✓ | ✓ | - |
| 报表生成 | ✓ | ✓ | ✓ | - |
| 查看个人持仓 | - | - | - | ✓ |
| 提交申赎 | - | - | - | ✓ |
| 下载报表 | - | - | - | ✓ |
| 系统配置 | ✓ | - | - | - |
| 审计日志 | ✓ | ✓ | - | - |

#### 数据权限
```typescript
// GP 只能访问自己机构的数据
@UseGuards(JwtAuthGuard, OrgDataGuard)
@Get('/funds')
async getFunds(@CurrentUser() user: User) {
  // 自动过滤 orgId = user.orgId
}

// LP 只能访问自己的数据
@UseGuards(JwtAuthGuard, InvestorDataGuard)
@Get('/holdings')
async getHoldings(@CurrentUser() user: User) {
  // 自动过滤 investorId = user.investorId
}
```

### 3. 数据加密

```yaml
传输加密:
  协议: TLS 1.3
  证书: Let's Encrypt / 商业证书
  强制 HTTPS: 是

存储加密:
  数据库: AES-256 (敏感字段)
  备份: AES-256-GCM
  密钥管理: AWS KMS / Azure Key Vault

敏感字段加密:
  - 身份证号
  - 银行账户
  - 手机号（部分加密）
  - 邮箱（部分加密）
```

### 4. API 安全

```typescript
// 请求限流
@Throttle(100, 60) // 每分钟 100 次
@Controller('api')
export class ApiController {}

// 签名验证（关键操作）
@Post('/transactions/subscriptions')
@ValidateSignature()
async createSubscription(@Body() dto: CreateSubscriptionDto) {
  // 验证请求签名
}

// SQL 注入防护
// 使用 ORM 参数化查询，禁止拼接 SQL

// XSS 防护
// 输入验证 + 输出转义

// CSRF 防护
// SameSite Cookie + CSRF Token
```

### 5. 审计日志

```typescript
// 记录所有敏感操作
interface AuditLog {
  userId: string;
  action: string;        // CREATE_FUND, CONFIRM_SUBSCRIPTION 等
  entityType: string;    // FUND, TRANSACTION 等
  entityId: string;
  oldValue: any;         // 变更前
  newValue: any;         // 变更后
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// 关键操作自动记录
@Audit('UPDATE_NAV')
async updateNav(@Body() dto: UpdateNavDto) {
  // 自动记录审计日志
}
```

---

## 性能优化策略

### 1. 数据库优化

```sql
-- 索引策略
CREATE INDEX idx_funds_code ON funds(fund_code);
CREATE INDEX idx_fund_nav_date ON fund_nav(fund_id, nav_date DESC);
CREATE INDEX idx_holdings_investor_fund ON holdings_accounts(investor_id, fund_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status, apply_date DESC);
CREATE INDEX idx_transactions_account_date ON transactions(account_id, transaction_date DESC);

-- 分区表（历史数据）
CREATE TABLE fund_nav_2024 PARTITION OF fund_nav
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 物化视图（Dashboard 数据）
CREATE MATERIALIZED VIEW mv_investor_summary AS
SELECT
  i.id,
  i.name,
  COUNT(ha.id) as holdings_count,
  SUM(ha.market_value) as total_market_value,
  SUM(ha.unrealized_profit) as total_return
FROM lp_investors i
LEFT JOIN holdings_accounts ha ON ha.investor_id = i.id
GROUP BY i.id, i.name;

-- 定期刷新物化视图
REFRESH MATERIALIZED VIEW mv_investor_summary;
```

### 2. 缓存策略

```typescript
// Redis 缓存层次
const cacheConfig = {
  // 热点数据（TTL: 5分钟）
  'fund:nav:latest': {
    ttl: 300,
    key: (fundId) => `fund:${fundId}:nav:latest`
  },

  // 用户会话（TTL: 15分钟）
  'user:session': {
    ttl: 900,
    key: (userId) => `user:${userId}:session`
  },

  // 持仓数据（TTL: 1分钟）
  'holdings:account': {
    ttl: 60,
    key: (accountId) => `holdings:${accountId}`
  },

  // 静态数据（TTL: 1天）
  'fund:info': {
    ttl: 86400,
    key: (fundId) => `fund:${fundId}:info`
  }
};

// 缓存穿透防护
async getFundNav(fundId: string, date: string) {
  const cacheKey = `fund:${fundId}:nav:${date}`;

  // 尝试从缓存获取
  let nav = await redis.get(cacheKey);
  if (nav === null) {
    // 查询数据库
    nav = await db.fundNav.findOne({ fundId, date });

    if (nav) {
      // 缓存结果
      await redis.set(cacheKey, JSON.stringify(nav), 'EX', 300);
    } else {
      // 缓存空结果，防止穿透
      await redis.set(cacheKey, 'NULL', 'EX', 60);
    }
  }

  return nav === 'NULL' ? null : JSON.parse(nav);
}
```

### 3. 异步处理

```typescript
// 使用消息队列处理耗时任务
import { Queue } from 'bull';

// 报表生成队列
const reportQueue = new Queue('report-generation', {
  redis: redisConfig
});

// 添加任务
reportQueue.add('generate-holdings-report', {
  investorId: 'xxx',
  reportDate: '2024-12-31',
  format: 'PDF'
});

// 处理任务
reportQueue.process('generate-holdings-report', async (job) => {
  const { investorId, reportDate, format } = job.data;

  // 生成报表
  const report = await generateHoldingsReport(investorId, reportDate);

  // 上传到对象存储
  const url = await uploadToS3(report, format);

  // 发送通知
  await notificationService.send(investorId, {
    title: '持仓报表已生成',
    content: `您的 ${reportDate} 持仓报表已生成，点击下载`,
    downloadUrl: url
  });

  return { url };
});

// 净值计算队列
const navQueue = new Queue('nav-calculation', {
  redis: redisConfig
});

// 每日定时任务触发净值计算
navQueue.add('calculate-daily-nav',
  { fundId: 'all' },
  { repeat: { cron: '0 18 * * 1-5' } } // 工作日 18:00
);
```

### 4. 前端优化

```typescript
// 虚拟滚动（大列表）
import { FixedSizeList } from 'react-window';

function TransactionList({ transactions }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={transactions.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {transactions[index].transactionNumber}
        </div>
      )}
    </FixedSizeList>
  );
}

// 数据预取
const prefetchFundDetail = (fundId: string) => {
  queryClient.prefetchQuery(['fund', fundId], () =>
    api.getFund(fundId)
  );
};

// 懒加载
const HoldingsReport = lazy(() => import('./components/HoldingsReport'));

// 防抖搜索
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    searchFunds(value);
  }, 300),
  []
);
```

---

## 监控与告警

### 1. 应用监控

```yaml
性能指标:
  - API 响应时间（P50, P95, P99）
  - 吞吐量（QPS）
  - 错误率
  - 慢查询

业务指标:
  - 日申购金额
  - 日赎回金额
  - 活跃用户数
  - 交易成功率

告警规则:
  - API 响应时间 > 2s
  - 错误率 > 1%
  - 数据库连接池 > 80%
  - 磁盘使用率 > 85%
  - 交易失败率 > 5%
```

### 2. 日志管理

```typescript
// 结构化日志
logger.info('Subscription created', {
  orderNumber: 'SUB20241027001',
  investorId: 'xxx',
  fundId: 'yyy',
  amount: 100000,
  duration: 150, // ms
  userId: 'admin123'
});

// 日志级别
// ERROR: 系统错误，需要立即处理
// WARN: 警告信息，可能导致问题
// INFO: 重要的业务日志
// DEBUG: 调试信息
```

### 3. 健康检查

```typescript
@Get('/health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      queue: await checkQueue()
    }
  };
}
```

---

## 部署方案

### Docker Compose（开发/测试环境）

```yaml
version: '3.8'

services:
  # 后端服务
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/tianhuifund
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  # 前端服务
  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

  # PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=tianhuifund
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # MinIO (对象存储)
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=password
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### Kubernetes（生产环境）

```yaml
# 部署策略
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tianhuifund-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: tianhuifund-api
  template:
    metadata:
      labels:
        app: tianhuifund-api
    spec:
      containers:
      - name: api
        image: tianhuifund-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# HPA (水平自动扩缩容)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: tianhuifund-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: tianhuifund-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 测试策略

### 1. 单元测试

```typescript
// 净值计算测试
describe('NAV Calculation', () => {
  it('should calculate NAV correctly', () => {
    const totalAssets = 10000000; // 1000万
    const totalLiabilities = 100000; // 10万
    const totalShares = 9000000; // 900万份

    const nav = calculateNAV(totalAssets, totalLiabilities, totalShares);

    expect(nav).toBe(1.1); // (1000万 - 10万) / 900万 = 1.1
  });

  it('should handle fee calculation', () => {
    const amount = 100000;
    const feeRate = 0.015; // 1.5%

    const fee = calculateFee(amount, feeRate);

    expect(fee).toBe(1500);
  });
});
```

### 2. 集成测试

```typescript
// 申购流程测试
describe('Subscription Flow', () => {
  it('should complete subscription process', async () => {
    // 1. 提交申购申请
    const subscription = await request(app)
      .post('/api/transactions/subscriptions')
      .send({
        investorId: testInvestorId,
        fundId: testFundId,
        subscriptionAmount: 100000
      })
      .expect(201);

    // 2. 确认申购
    await request(app)
      .patch(`/api/transactions/subscriptions/${subscription.body.id}/confirm`)
      .send({
        confirmedShares: 90000,
        nav: 1.1,
        navDate: '2024-10-27'
      })
      .expect(200);

    // 3. 验证持仓更新
    const holdings = await request(app)
      .get(`/api/holdings/accounts/${testAccountId}`)
      .expect(200);

    expect(holdings.body.totalShares).toBe(90000);
  });
});
```

### 3. E2E 测试

```typescript
// 使用 Playwright 进行端到端测试
import { test, expect } from '@playwright/test';

test('LP investor can submit subscription', async ({ page }) => {
  // 登录
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'test-lp');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // 导航到申购页面
  await page.click('text=我要申购');

  // 填写申购表单
  await page.selectOption('select[name="fundId"]', testFundId);
  await page.fill('input[name="amount"]', '100000');

  // 提交申购
  await page.click('button:has-text("确认申购")');

  // 验证成功提示
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

**文档版本**: v1.0
**最后更新**: 2025-10-27
