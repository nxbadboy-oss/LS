# 天汇基金 OFC 平台 - 项目结构

## 推荐的单体仓库结构（Monorepo）

```
tianhuifund-platform/
├── packages/
│   ├── web/                    # 前端 Web 应用
│   ├── mobile/                 # 移动端 H5（可选）
│   ├── api/                    # 后端 API 服务
│   ├── shared/                 # 共享代码
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数
│   │   └── constants/         # 常量定义
│   └── database/              # 数据库相关
│       ├── migrations/        # 数据库迁移
│       ├── seeds/             # 种子数据
│       └── schema/            # Schema 定义
├── docs/                      # 文档
│   ├── api/                  # API 文档
│   ├── architecture/         # 架构文档
│   └── deployment/           # 部署文档
├── scripts/                   # 脚本
│   ├── setup.sh              # 环境设置
│   ├── deploy.sh             # 部署脚本
│   └── backup.sh             # 备份脚本
├── docker/                    # Docker 相关
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── Dockerfile.*
├── .github/                   # GitHub 配置
│   └── workflows/            # CI/CD 配置
├── package.json              # 根 package.json
├── pnpm-workspace.yaml       # pnpm workspace 配置
├── turbo.json               # Turborepo 配置
├── .env.example             # 环境变量示例
└── README.md                # 项目说明
```

---

## 前端项目结构（React + TypeScript）

```
packages/web/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── app/                          # 应用入口
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── store.ts                 # Redux store
│   │
│   ├── features/                     # 功能模块（按业务划分）
│   │   ├── auth/                    # 认证模块
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── MFAVerification.tsx
│   │   │   │   └── ChangePassword.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── services/
│   │   │   │   └── authService.ts
│   │   │   ├── store/
│   │   │   │   └── authSlice.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── utils/
│   │   │       └── token.ts
│   │   │
│   │   ├── funds/                   # 基金管理
│   │   │   ├── components/
│   │   │   │   ├── FundList.tsx
│   │   │   │   ├── FundDetail.tsx
│   │   │   │   ├── FundForm.tsx
│   │   │   │   ├── NavChart.tsx
│   │   │   │   └── NavHistory.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useFunds.ts
│   │   │   │   └── useNav.ts
│   │   │   ├── services/
│   │   │   │   └── fundService.ts
│   │   │   └── pages/
│   │   │       ├── FundsPage.tsx
│   │   │       └── FundDetailPage.tsx
│   │   │
│   │   ├── investors/               # 投资者管理
│   │   │   ├── components/
│   │   │   │   ├── InvestorList.tsx
│   │   │   │   ├── InvestorDetail.tsx
│   │   │   │   ├── InvestorForm.tsx
│   │   │   │   └── KYCReview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useInvestors.ts
│   │   │   └── services/
│   │   │       └── investorService.ts
│   │   │
│   │   ├── transactions/            # 交易管理
│   │   │   ├── components/
│   │   │   │   ├── SubscriptionForm.tsx
│   │   │   │   ├── RedemptionForm.tsx
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionDetail.tsx
│   │   │   │   └── ApprovalFlow.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSubscription.ts
│   │   │   │   └── useRedemption.ts
│   │   │   └── services/
│   │   │       └── transactionService.ts
│   │   │
│   │   ├── holdings/                # 持仓管理
│   │   │   ├── components/
│   │   │   │   ├── HoldingsList.tsx
│   │   │   │   ├── HoldingsDetail.tsx
│   │   │   │   ├── PerformanceChart.tsx
│   │   │   │   └── AssetAllocation.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useHoldings.ts
│   │   │   └── services/
│   │   │       └── holdingsService.ts
│   │   │
│   │   ├── reports/                 # 报表模块
│   │   │   ├── components/
│   │   │   │   ├── ReportGenerator.tsx
│   │   │   │   ├── ReportList.tsx
│   │   │   │   └── ReportPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useReports.ts
│   │   │   └── services/
│   │   │       └── reportService.ts
│   │   │
│   │   ├── dashboard/               # 仪表盘
│   │   │   ├── components/
│   │   │   │   ├── GPDashboard.tsx
│   │   │   │   ├── LPDashboard.tsx
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── TrendChart.tsx
│   │   │   │   └── RecentTransactions.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboard.ts
│   │   │
│   │   └── notifications/           # 通知消息
│   │       ├── components/
│   │       │   ├── NotificationList.tsx
│   │       │   ├── NotificationItem.tsx
│   │       │   └── NotificationBadge.tsx
│   │       └── hooks/
│   │           └── useNotifications.ts
│   │
│   ├── components/                  # 共享组件
│   │   ├── ui/                     # UI 基础组件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Card/
│   │   │   └── Loading/
│   │   ├── layout/                 # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   └── business/               # 业务组件
│   │       ├── AmountInput.tsx
│   │       ├── DateRangePicker.tsx
│   │       ├── FundSelector.tsx
│   │       └── StatusBadge.tsx
│   │
│   ├── hooks/                       # 全局 Hooks
│   │   ├── useApi.ts
│   │   ├── usePermission.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── services/                    # API 服务
│   │   ├── api.ts                  # Axios 实例配置
│   │   ├── interceptors.ts         # 请求/响应拦截器
│   │   └── endpoints.ts            # API 端点定义
│   │
│   ├── store/                       # Redux Store
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   └── middleware.ts
│   │
│   ├── types/                       # 类型定义
│   │   ├── models.ts               # 数据模型
│   │   ├── api.ts                  # API 响应类型
│   │   └── common.ts               # 通用类型
│   │
│   ├── utils/                       # 工具函数
│   │   ├── format.ts               # 格式化函数
│   │   ├── validation.ts           # 验证函数
│   │   ├── calculation.ts          # 计算函数
│   │   └── date.ts                 # 日期处理
│   │
│   ├── constants/                   # 常量
│   │   ├── routes.ts               # 路由常量
│   │   ├── status.ts               # 状态常量
│   │   └── config.ts               # 配置常量
│   │
│   ├── styles/                      # 全局样式
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── theme.ts                # 主题配置
│   │
│   └── assets/                      # 静态资源
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── .env.development                 # 开发环境变量
├── .env.production                  # 生产环境变量
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 后端项目结构（NestJS）

```
packages/api/
├── src/
│   ├── main.ts                      # 应用入口
│   │
│   ├── modules/                     # 功能模块
│   │   ├── auth/                   # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── mfa.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── change-password.dto.ts
│   │   │
│   │   ├── users/                  # 用户模块
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── funds/                  # 基金模块
│   │   │   ├── funds.module.ts
│   │   │   ├── funds.controller.ts
│   │   │   ├── funds.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── fund.entity.ts
│   │   │   │   └── fund-nav.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-fund.dto.ts
│   │   │   │   ├── update-fund.dto.ts
│   │   │   │   └── update-nav.dto.ts
│   │   │   └── services/
│   │   │       ├── nav-calculation.service.ts
│   │   │       └── fund-performance.service.ts
│   │   │
│   │   ├── investors/              # 投资者模块
│   │   │   ├── investors.module.ts
│   │   │   ├── investors.controller.ts
│   │   │   ├── investors.service.ts
│   │   │   ├── entities/
│   │   │   │   └── investor.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-investor.dto.ts
│   │   │       └── update-kyc.dto.ts
│   │   │
│   │   ├── transactions/           # 交易模块
│   │   │   ├── transactions.module.ts
│   │   │   ├── controllers/
│   │   │   │   ├── subscriptions.controller.ts
│   │   │   │   └── redemptions.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── subscription.service.ts
│   │   │   │   ├── redemption.service.ts
│   │   │   │   └── fee-calculation.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── subscription.entity.ts
│   │   │   │   └── redemption.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-subscription.dto.ts
│   │   │       ├── confirm-subscription.dto.ts
│   │   │       ├── create-redemption.dto.ts
│   │   │       └── confirm-redemption.dto.ts
│   │   │
│   │   ├── holdings/               # 持仓模块
│   │   │   ├── holdings.module.ts
│   │   │   ├── holdings.controller.ts
│   │   │   ├── holdings.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── holdings-account.entity.ts
│   │   │   │   └── transaction.entity.ts
│   │   │   └── services/
│   │   │       └── performance.service.ts
│   │   │
│   │   ├── reports/                # 报表模块
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── entities/
│   │   │   │   └── report.entity.ts
│   │   │   ├── generators/
│   │   │   │   ├── holdings-report.generator.ts
│   │   │   │   ├── performance-report.generator.ts
│   │   │   │   └── statement-report.generator.ts
│   │   │   └── processors/
│   │   │       └── report.processor.ts
│   │   │
│   │   ├── notifications/          # 通知模块
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── entities/
│   │   │   │   └── notification.entity.ts
│   │   │   └── channels/
│   │   │       ├── email.channel.ts
│   │   │       ├── sms.channel.ts
│   │   │       └── wechat.channel.ts
│   │   │
│   │   ├── audit/                  # 审计模块
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.service.ts
│   │   │   ├── interceptors/
│   │   │   │   └── audit.interceptor.ts
│   │   │   └── entities/
│   │   │       └── audit-log.entity.ts
│   │   │
│   │   └── dashboard/              # 仪表盘模块
│   │       ├── dashboard.module.ts
│   │       ├── dashboard.controller.ts
│   │       └── dashboard.service.ts
│   │
│   ├── common/                      # 通用模块
│   │   ├── filters/                # 异常过滤器
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── interceptors/           # 拦截器
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── pipes/                  # 管道
│   │   │   └── validation.pipe.ts
│   │   ├── decorators/             # 装饰器
│   │   │   ├── api-paginated-response.decorator.ts
│   │   │   └── audit.decorator.ts
│   │   ├── guards/                 # 守卫
│   │   │   ├── throttle.guard.ts
│   │   │   └── org-data.guard.ts
│   │   └── dto/                    # 通用 DTO
│   │       ├── pagination.dto.ts
│   │       └── response.dto.ts
│   │
│   ├── config/                      # 配置
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── queue.config.ts
│   │   └── jwt.config.ts
│   │
│   └── database/                    # 数据库
│       ├── migrations/             # 迁移文件
│       ├── seeds/                  # 种子数据
│       └── database.module.ts
│
├── test/                            # 测试
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Dockerfile
```

---

## 数据库迁移文件示例

```typescript
// packages/database/migrations/001_initial_schema.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 创建用户表
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username', 50).unique().notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('phone', 20);
    table.string('password_hash', 255).notNullable();
    table.string('role', 20).notNullable();
    table.string('status', 20).defaultTo('ACTIVE');
    table.boolean('mfa_enabled').defaultTo(false);
    table.timestamps(true, true);
    table.timestamp('last_login_at');
  });

  // 创建基金表
  await knex.schema.createTable('funds', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('gp_org_id').references('id').inTable('gp_organizations');
    table.string('fund_code', 50).unique().notNullable();
    table.string('fund_name', 100).notNullable();
    table.string('fund_type', 50);
    table.text('investment_strategy');
    table.date('inception_date');
    table.decimal('management_fee_rate', 5, 4);
    table.decimal('min_subscription_amount', 20, 2);
    table.string('status', 20).defaultTo('ACTIVE');
    table.timestamps(true, true);

    table.index(['fund_code']);
    table.index(['status']);
  });

  // 创建净值表
  await knex.schema.createTable('fund_nav', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('fund_id').references('id').inTable('funds').onDelete('CASCADE');
    table.date('nav_date').notNullable();
    table.decimal('nav', 10, 6).notNullable();
    table.decimal('accumulated_nav', 10, 6);
    table.decimal('total_shares', 20, 6);
    table.decimal('total_assets', 20, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['fund_id', 'nav_date']);
    table.index(['fund_id', 'nav_date']);
  });

  // ... 其他表
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('fund_nav');
  await knex.schema.dropTableIfExists('funds');
  await knex.schema.dropTableIfExists('users');
  // ... 其他表
}
```

---

## 环境变量配置

```bash
# .env.example

# 应用配置
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/tianhuifund
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT 配置
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@tianhuifund.com

# 短信配置
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY_ID=
SMS_ACCESS_KEY_SECRET=
SMS_SIGN_NAME=天汇基金

# 对象存储配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=tianhuifund-reports

# 日志配置
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# 监控配置
SENTRY_DSN=

# 外部服务配置
MARKET_DATA_API_KEY=
BANK_GATEWAY_URL=
```

---

## 启动脚本

### 本地开发环境启动

```bash
#!/bin/bash
# scripts/dev.sh

# 启动数据库和 Redis
docker-compose -f docker/docker-compose.dev.yml up -d db redis

# 等待数据库就绪
echo "Waiting for database..."
sleep 5

# 运行数据库迁移
cd packages/database
pnpm migrate:latest

# 运行种子数据（首次启动）
# pnpm seed:run

# 启动后端服务
cd ../api
pnpm dev &

# 启动前端服务
cd ../web
pnpm dev &

echo "Services started!"
echo "API: http://localhost:3000"
echo "Web: http://localhost:5173"
```

### 生产环境部署

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

# 构建前端
cd packages/web
pnpm build

# 构建后端
cd ../api
pnpm build

# 构建 Docker 镜像
docker build -t tianhuifund-api:latest -f ../../docker/Dockerfile.api .
docker build -t tianhuifund-web:latest -f ../../docker/Dockerfile.web ../web

# 推送到镜像仓库
docker tag tianhuifund-api:latest registry.example.com/tianhuifund-api:latest
docker push registry.example.com/tianhuifund-api:latest

docker tag tianhuifund-web:latest registry.example.com/tianhuifund-web:latest
docker push registry.example.com/tianhuifund-web:latest

# 部署到 Kubernetes
kubectl apply -f k8s/
kubectl rollout status deployment/tianhuifund-api
kubectl rollout status deployment/tianhuifund-web

echo "Deployment completed!"
```

---

## Git 工作流

### 分支策略

```
main            # 生产环境分支
├── develop     # 开发环境分支
│   ├── feature/fund-management
│   ├── feature/transaction-flow
│   └── feature/reporting
├── release/v1.0.0
└── hotfix/fix-nav-calculation
```

### Commit 规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关

示例:
feat(funds): add fund creation functionality
fix(transactions): correct fee calculation logic
docs(api): update subscription endpoint documentation
```

---

## 开发规范

### TypeScript 规范

```typescript
// 使用接口定义数据结构
interface Fund {
  id: string;
  fundCode: string;
  fundName: string;
  fundType: FundType;
}

// 使用类型别名定义联合类型
type FundType = 'EQUITY' | 'BOND' | 'HYBRID' | 'MONEY_MARKET';

// 使用枚举定义常量
enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

// 函数参数和返回值类型
function calculateNav(
  totalAssets: number,
  totalLiabilities: number,
  totalShares: number
): number {
  return (totalAssets - totalLiabilities) / totalShares;
}
```

### 代码格式化

```json
// .prettierrc
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### ESLint 配置

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

---

**文档版本**: v1.0
**最后更新**: 2025-10-27
