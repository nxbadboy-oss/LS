# 天汇基金 OFC 投资人管理平台

## 项目概述

天汇基金 OFC（开放式基金公司）投资人管理平台是一个为 GP（普通合伙人）和 LP（有限合伙人）提供全方位基金管理服务的 Web 平台。平台支持投资组合管理、市值跟踪、申购赎回、报表生成等核心功能。

### 目标用户
- **GP（普通合伙人）**：基金管理者，负责基金运营、投资决策、LP 管理
- **LP（有限合伙人）**：基金投资者,查看投资组合、申购赎回、获取报表
- **基金管理员**：平台管理员，负责系统配置、用户管理、审计

---

## 🚀 快速体验演示版

### 方式一：使用 GitHub Codespaces（推荐，无需本地安装）

1. 点击仓库页面顶部绿色的 **"Code"** 按钮
2. 切换到 **"Codespaces"** 标签
3. 点击 **"Create codespace on claude/fund-investor-platform-011CUX9DsALA1LMqzZoZ3w4u"**
4. 等待 1-2 分钟，Codespaces 会自动：
   - 创建云端开发环境
   - 安装所有依赖
   - 初始化数据库
   - 启动前后端服务
5. 服务启动后，点击弹出的通知或在"端口"面板找到 5173 端口，点击地球图标在浏览器中打开

**演示账号：**
```
LP 投资人：
  用户名: lp-001
  密码: 123456

GP 管理员：
  用户名: gp-admin
  密码: 123456
```

> 详细说明请查看 [CODESPACES.md](demo/CODESPACES.md)

### 方式二：本地运行

详细步骤请查看 [demo/START.md](demo/START.md)

---

## 🌐 部署到生产环境

### 快速部署（一键脚本）

```bash
# 运行快速部署脚本
./quick-deploy.sh
```

### 部署方案选择

| 方案 | 适用场景 | 部署指南 |
|------|----------|----------|
| **Railway** | 推荐！简单快速，免费额度 | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |
| **Docker** | 有自己服务器，完全控制 | [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) |
| **Vercel + Render** | 前后端分离，高性能 | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |

### 部署验证

```bash
# 运行验证脚本检查部署是否成功
./verify-deployment.sh
```

**详细部署指南**：
- 📖 [完整部署指南](DEPLOYMENT_GUIDE.md) - 多种部署方案对比和详细步骤
- 🐳 [Docker 部署指南](DOCKER_DEPLOYMENT.md) - 使用 Docker 容器化部署
- ⚙️ [系统升级说明](UPGRADE_SUMMARY.md) - V2 版本新功能和改进

---

## 核心功能需求

### 1. 用户管理模块

#### 1.1 身份认证与授权
- 多因素认证（MFA）
- 单点登录（SSO）支持
- 基于角色的权限控制（RBAC）
- 操作日志审计

#### 1.2 用户角色
```
- 超级管理员（Super Admin）
  - 系统配置
  - 用户管理
  - 全局数据访问

- GP 管理员（GP Admin）
  - 基金创建与管理
  - LP 账户管理
  - 数据审批

- GP 操作员（GP Operator）
  - 日常运营操作
  - 报表生成
  - 数据录入

- LP 投资人（LP Investor）
  - 查看个人投资
  - 提交申赎请求
  - 下载报表
```

---

### 2. 基金管理模块

#### 2.1 基金产品管理
- 基金创建与配置
  - 基金基本信息（名称、代码、类型）
  - 投资策略与限制
  - 费率结构（管理费、业绩报酬、申赎费用）
  - 开放日设置

- 基金净值管理
  - 净值计算与录入
  - 历史净值查询
  - 净值走势图表

- 基金份额管理
  - 份额类别（A 类、C 类等）
  - 份额拆分与合并
  - 份额转换

#### 2.2 投资组合管理
- 资产配置管理
  - 股票、债券、基金、现金等
  - 行业分布、地域分布
  - 风险敞口分析

- 持仓管理
  - 实时持仓查询
  - 持仓成本与盈亏
  - 持仓变动记录

---

### 3. 申购赎回模块

#### 3.1 申购功能
- 在线申购申请
  - 金额申购 / 份额申购
  - 申购费用计算
  - 定期定额申购

- 申购审核流程
  - 多级审批
  - 合规检查
  - 资金确认

- 申购确认
  - 份额确认
  - 确认通知

#### 3.2 赎回功能
- 在线赎回申请
  - 份额赎回 / 金额赎回
  - 赎回费用计算
  - 赎回到账预估

- 赎回审核流程
  - 流动性检查
  - 赎回限制验证
  - 多级审批

- 赎回确认
  - 赎回款项计算
  - 到账通知

#### 3.3 交易限制
- 最低申购/赎回金额
- 单日限额
- 锁定期管理
- 冷静期设置

---

### 4. 市值管理模块

#### 4.1 资产估值
- 实时市值计算
  - 资产市价获取
  - 估值方法配置
  - 汇率处理

- 估值调整
  - 手动调整
  - 审批流程
  - 调整记录

#### 4.2 收益分析
- 投资收益统计
  - 绝对收益
  - 相对收益（vs 基准）
  - 年化收益率

- 收益归因分析
  - 资产配置贡献
  - 个股选择贡献
  - 市场时机贡献

#### 4.3 风险指标
- 波动率（标准差）
- 最大回撤
- 夏普比率
- VaR（风险价值）

---

### 5. 账户管理模块

#### 5.1 LP 账户
- 账户信息管理
  - 基本信息
  - KYC/AML 资料
  - 银行账户

- 持仓明细
  - 各基金持有份额
  - 成本与市值
  - 累计收益

- 交易历史
  - 申购记录
  - 赎回记录
  - 分红记录

#### 5.2 资金管理
- 资金账户
  - 可用余额
  - 冻结资金
  - 资金流水

- 资金划转
  - 入金
  - 出金
  - 内部划转

---

### 6. 报表与分析模块

#### 6.1 投资报表（LP 端）
- 持仓报表
  - 当前持仓详情
  - 资产配置饼图

- 收益报表
  - 月度/季度/年度收益
  - 收益曲线图

- 交易对账单
  - 申赎明细
  - 费用明细
  - 分红明细

#### 6.2 管理报表（GP 端）
- 基金运营报表
  - 净值变动表
  - 申赎统计
  - 规模变化

- 投资管理报表
  - 持仓明细表
  - 行业配置表
  - 交易统计

- 监管报表
  - 投资比例监控
  - 关联交易报告
  - 流动性报告

#### 6.3 数据分析
- 可视化图表
  - Dashboard 仪表盘
  - 趋势分析图
  - 对比分析图

- 自定义报表
  - 报表模板配置
  - 数据筛选
  - 导出功能（Excel、PDF）

---

### 7. 通知与消息模块

#### 7.1 消息中心
- 站内消息
- 邮件通知
- 短信通知
- 微信/企业微信通知

#### 7.2 通知类型
- 交易通知（申赎确认）
- 净值更新通知
- 分红通知
- 重要公告
- 系统维护通知

---

### 8. 合规与风控模块

#### 8.1 合规检查
- 投资者适当性管理
- 反洗钱（AML）检查
- 投资限制监控
- 关联交易审查

#### 8.2 审计功能
- 操作日志
- 数据变更记录
- 审计报告生成
- 合规报告

---

## 系统架构设计

### 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端层（Web）                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │  GP 管理端   │  │  LP 投资端   │  │  移动端 H5   │   │
│  └─────────────┘  └─────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴────────┐
                    │   API Gateway   │
                    │  (认证/限流/路由) │
                    └───────┬────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      应用服务层                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │用户服务  │ │基金服务  │ │交易服务  │ │报表服务  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │估值服务  │ │通知服务  │ │风控服务  │ │审计服务  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      数据层                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │主数据库  │ │缓存层    │ │消息队列  │ │对象存储  │ │
│  │(PostgreSQL)│(Redis)  │(RabbitMQ) │ (MinIO)   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    外部服务集成                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │行情数据  │ │银行接口  │ │短信/邮件 │ │监管报送  │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 推荐技术栈

### 前端技术栈

#### 选项 1：React 生态（推荐）
```javascript
{
  "框架": "React 18+",
  "状态管理": "Redux Toolkit / Zustand",
  "路由": "React Router v6",
  "UI 组件库": "Ant Design Pro / Material-UI",
  "图表库": "ECharts / Recharts",
  "表格": "AG-Grid / React Table",
  "表单": "React Hook Form + Yup",
  "HTTP 客户端": "Axios / React Query",
  "CSS 方案": "Tailwind CSS / Styled Components",
  "构建工具": "Vite / Create React App",
  "类型检查": "TypeScript",
  "测试": "Vitest + React Testing Library"
}
```

#### 选项 2：Vue 生态
```javascript
{
  "框架": "Vue 3 + Composition API",
  "状态管理": "Pinia",
  "路由": "Vue Router 4",
  "UI 组件库": "Element Plus / Ant Design Vue",
  "构建工具": "Vite",
  "类型检查": "TypeScript"
}
```

### 后端技术栈

#### 选项 1：Node.js（推荐用于全栈 TS）
```javascript
{
  "运行时": "Node.js 20 LTS",
  "框架": "NestJS / Express + TypeScript",
  "ORM": "Prisma / TypeORM",
  "认证": "Passport.js + JWT",
  "验证": "class-validator / Joi",
  "文档": "Swagger / OpenAPI",
  "测试": "Jest / Vitest"
}
```

#### 选项 2：Java（企业级选择）
```java
{
  "语言": "Java 17+",
  "框架": "Spring Boot 3.x",
  "ORM": "MyBatis-Plus / JPA",
  "安全": "Spring Security + OAuth2",
  "文档": "Knife4j / Swagger",
  "测试": "JUnit 5 + Mockito"
}
```

#### 选项 3：Python（数据密集型）
```python
{
  "语言": "Python 3.11+",
  "框架": "FastAPI / Django",
  "ORM": "SQLAlchemy / Django ORM",
  "任务队列": "Celery",
  "数据分析": "Pandas / NumPy"
}
```

### 数据库

```yaml
主数据库: PostgreSQL 15+
  - 事务支持
  - 复杂查询
  - JSON 支持
  - 时序数据扩展 (TimescaleDB)

缓存层: Redis 7+
  - 会话管理
  - 热点数据缓存
  - 分布式锁
  - 实时排行榜

搜索引擎: Elasticsearch（可选）
  - 全文搜索
  - 日志分析
  - 审计查询

时序数据库: InfluxDB / TimescaleDB（可选）
  - 净值历史
  - 市值变化
  - 性能指标
```

### 基础设施

```yaml
容器化: Docker + Docker Compose
编排: Kubernetes（生产环境）
CI/CD: GitHub Actions / GitLab CI
监控: Prometheus + Grafana
日志: ELK Stack (Elasticsearch + Logstash + Kibana)
对象存储: MinIO / AWS S3
负载均衡: Nginx / Traefik
```

---

## 数据模型设计

### 核心实体关系

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- GP_ADMIN, GP_OPERATOR, LP_INVESTOR
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, INACTIVE
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- GP 机构表
CREATE TABLE gp_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    license_number VARCHAR(100),
    registered_capital DECIMAL(20, 2),
    contact_person VARCHAR(50),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LP 投资者表
CREATE TABLE lp_investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    investor_type VARCHAR(20), -- INDIVIDUAL, INSTITUTIONAL
    name VARCHAR(100) NOT NULL,
    id_type VARCHAR(20), -- ID_CARD, PASSPORT, BUSINESS_LICENSE
    id_number VARCHAR(50),
    risk_level VARCHAR(20), -- CONSERVATIVE, MODERATE, AGGRESSIVE
    kyc_status VARCHAR(20), -- PENDING, APPROVED, REJECTED
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 基金产品表
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gp_org_id UUID REFERENCES gp_organizations(id),
    fund_code VARCHAR(50) UNIQUE NOT NULL,
    fund_name VARCHAR(100) NOT NULL,
    fund_type VARCHAR(50), -- EQUITY, BOND, HYBRID, MONEY_MARKET
    investment_strategy TEXT,
    benchmark VARCHAR(100),
    inception_date DATE,
    management_fee_rate DECIMAL(5, 4), -- 年化管理费率
    performance_fee_rate DECIMAL(5, 4), -- 业绩报酬比例
    subscription_fee_rate DECIMAL(5, 4), -- 申购费率
    redemption_fee_rate DECIMAL(5, 4), -- 赎回费率
    min_subscription_amount DECIMAL(20, 2), -- 最低申购金额
    min_redemption_shares DECIMAL(20, 6), -- 最低赎回份额
    lock_period_days INTEGER, -- 锁定期（天）
    open_days VARCHAR(50), -- 开放日（如：每周三、每月最后一天）
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 基金净值表
CREATE TABLE fund_nav (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id),
    nav_date DATE NOT NULL,
    nav DECIMAL(10, 6) NOT NULL, -- 单位净值
    accumulated_nav DECIMAL(10, 6), -- 累计净值
    total_shares DECIMAL(20, 6), -- 总份额
    total_assets DECIMAL(20, 2), -- 总资产
    total_liabilities DECIMAL(20, 2), -- 总负债
    daily_return DECIMAL(10, 6), -- 日收益率
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fund_id, nav_date)
);

-- 持仓账户表
CREATE TABLE holdings_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES lp_investors(id),
    fund_id UUID REFERENCES funds(id),
    account_number VARCHAR(50) UNIQUE NOT NULL,
    total_shares DECIMAL(20, 6) DEFAULT 0, -- 总份额
    available_shares DECIMAL(20, 6) DEFAULT 0, -- 可用份额
    frozen_shares DECIMAL(20, 6) DEFAULT 0, -- 冻结份额
    total_cost DECIMAL(20, 2) DEFAULT 0, -- 总成本
    market_value DECIMAL(20, 2) DEFAULT 0, -- 市值
    unrealized_profit DECIMAL(20, 2) DEFAULT 0, -- 浮动盈亏
    realized_profit DECIMAL(20, 2) DEFAULT 0, -- 已实现盈亏
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(investor_id, fund_id)
);

-- 申购记录表
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES lp_investors(id),
    fund_id UUID REFERENCES funds(id),
    account_id UUID REFERENCES holdings_accounts(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subscription_amount DECIMAL(20, 2) NOT NULL, -- 申购金额
    subscription_fee DECIMAL(20, 2), -- 申购费用
    net_amount DECIMAL(20, 2), -- 净申购金额
    confirmed_shares DECIMAL(20, 6), -- 确认份额
    nav DECIMAL(10, 6), -- 确认净值
    nav_date DATE, -- 净值日期
    status VARCHAR(20), -- PENDING, CONFIRMED, REJECTED, CANCELLED
    apply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirm_date TIMESTAMP,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 赎回记录表
CREATE TABLE redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES lp_investors(id),
    fund_id UUID REFERENCES funds(id),
    account_id UUID REFERENCES holdings_accounts(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    redemption_shares DECIMAL(20, 6) NOT NULL, -- 赎回份额
    redemption_amount DECIMAL(20, 2), -- 赎回金额
    redemption_fee DECIMAL(20, 2), -- 赎回费用
    net_amount DECIMAL(20, 2), -- 净赎回金额
    nav DECIMAL(10, 6), -- 确认净值
    nav_date DATE,
    status VARCHAR(20), -- PENDING, CONFIRMED, REJECTED, CANCELLED
    apply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirm_date TIMESTAMP,
    payment_date TIMESTAMP, -- 到账日期
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 资产组合表（基金持有的资产）
CREATE TABLE fund_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id),
    asset_type VARCHAR(20), -- STOCK, BOND, FUND, CASH
    asset_code VARCHAR(50),
    asset_name VARCHAR(100),
    quantity DECIMAL(20, 6),
    cost_price DECIMAL(20, 6),
    market_price DECIMAL(20, 6),
    market_value DECIMAL(20, 2),
    weight DECIMAL(5, 4), -- 持仓占比
    position_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 交易流水表
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES holdings_accounts(id),
    transaction_type VARCHAR(20), -- SUBSCRIPTION, REDEMPTION, DIVIDEND
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(20, 2),
    shares DECIMAL(20, 6),
    fee DECIMAL(20, 2),
    nav DECIMAL(10, 6),
    transaction_date TIMESTAMP,
    status VARCHAR(20),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分红记录表
CREATE TABLE dividends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID REFERENCES funds(id),
    dividend_date DATE NOT NULL,
    record_date DATE, -- 权益登记日
    ex_dividend_date DATE, -- 除息日
    dividend_per_share DECIMAL(10, 6), -- 每份分红
    total_dividend DECIMAL(20, 2), -- 总分红金额
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知消息表
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    type VARCHAR(20), -- TRANSACTION, NAV_UPDATE, ANNOUNCEMENT
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 功能模块规划

### Phase 1: 基础框架（2-3周）
- [ ] 项目初始化与架构搭建
- [ ] 用户认证与授权系统
- [ ] 基础 RBAC 权限管理
- [ ] 数据库设计与初始化
- [ ] 基础 UI 框架搭建

### Phase 2: 核心业务（4-6周）
- [ ] 基金产品管理
- [ ] LP 投资者管理
- [ ] 持仓账户管理
- [ ] 基金净值管理
- [ ] 申购赎回流程

### Phase 3: 估值与报表（3-4周）
- [ ] 市值估值系统
- [ ] 收益计算引擎
- [ ] 基础报表功能
- [ ] Dashboard 仪表盘
- [ ] 数据导出功能

### Phase 4: 高级功能（3-4周）
- [ ] 审批工作流
- [ ] 通知系统
- [ ] 风控监控
- [ ] 审计日志
- [ ] 自定义报表

### Phase 5: 优化与上线（2-3周）
- [ ] 性能优化
- [ ] 安全加固
- [ ] 用户测试
- [ ] 文档编写
- [ ] 部署上线

---

## 关键技术挑战

### 1. 净值计算准确性
- 资产估值精度
- 费用计提计算
- 分红再投资处理
- 多币种汇率处理

### 2. 交易并发控制
- 申赎订单并发
- 份额锁定机制
- 分布式事务
- 数据一致性

### 3. 性能优化
- 大数据量报表生成
- 历史数据查询优化
- 实时市值计算
- 缓存策略

### 4. 安全合规
- 数据加密存储
- 操作审计追踪
- 权限细粒度控制
- 监管报送接口

---

## 参考系统

### 国内同类系统
1. **恒生 O45 资管平台**
   - 全业务链覆盖
   - 强大的估值核算能力

2. **金证 KDN 资管系统**
   - 多资产管理
   - 灵活的产品配置

3. **顶点资管系统**
   - 私募基金管理
   - 投资者服务

### 国际参考
1. **BlackRock Aladdin**
   - 投资组合管理
   - 风险分析

2. **SimCorp Dimension**
   - 全生命周期管理
   - 多资产类别支持

---

## 下一步行动

1. **需求确认**
   - 与业务团队确认详细需求
   - 确定 MVP 功能范围
   - 明确监管合规要求

2. **技术选型**
   - 根据团队技术栈选择框架
   - 评估第三方服务（行情、支付等）
   - 确定部署方案

3. **团队组建**
   - 前端开发：2-3人
   - 后端开发：2-3人
   - 测试：1人
   - 产品/UI：1人

4. **原型设计**
   - UI/UX 设计
   - 核心流程原型
   - 用户体验测试

---

## 联系方式

如有任何问题或建议，请联系项目负责人。

---

**文档版本**: v1.0
**最后更新**: 2025-10-27
