# 天汇基金 OFC 平台改进方案

## 一、当前系统分析

### 现有功能
✅ **已实现（基础版）**：
- LP 端：登录、仪表盘、基金列表、申购、持仓查看、交易记录
- GP 端：基础仪表盘（统计数据）
- 后端：基础 API、JWT 认证、SQLite 数据库

### 主要不足
❌ **功能缺失**：
1. **GP 管理端严重不足**：
   - 无投资者管理功能
   - 无审批流程（申购/赎回需要人工审批）
   - 无基金管理功能（创建、编辑、净值管理）
   - 无报表生成和导出
   - 无系统配置和用户管理

2. **LP 端功能不完善**：
   - 缺少赎回功能
   - 无文档中心（合同、报告下载）
   - 无消息通知
   - 无个人信息管理
   - 报表展示不够详细

3. **业务逻辑缺失**：
   - **没有母子基金架构支持**（这是核心问题！）
   - 无审批工作流
   - 无多级权限管理
   - 无操作日志和审计

4. **技术架构问题**：
   - SQLite 不适合生产环境（需要切换到 PostgreSQL/MySQL）
   - 缺少环境配置管理
   - 无错误处理和日志系统
   - 无数据备份方案
   - 未考虑部署方案

---

## 二、业务需求分析

### 实际业务场景：母子基金架构

**母基金**：Eminence Global MasterFund OFC (BUB855)

**5个子基金**：
1. Eminence Opportunity Fund 1 (BUB856)
2. Eminence Digital Technology Fund (BWH895)
3. Eminence Global M&A Fund (BWH893)
4. Eminence Global Trade Development Fund (BWH894)
5. Eminence Greater BayArea Technology Innovation Fund (BWH896)

**关键业务逻辑**：
- 投资者可以投资母基金或子基金
- 母基金需要展示所有子基金的合并数据
- 子基金有独立的净值、持仓、业绩
- GP 需要分别管理母基金和子基金
- 报表需要支持独立报表和合并报表

---

## 三、改进方案

### 阶段一：数据模型改进（核心基础）

#### 1. 新增母子基金关联表
```sql
CREATE TABLE fund_relationships (
  id TEXT PRIMARY KEY,
  master_fund_id TEXT NOT NULL,  -- 母基金ID
  sub_fund_id TEXT NOT NULL,     -- 子基金ID
  allocation_ratio REAL,         -- 配置比例
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (master_fund_id) REFERENCES funds(id),
  FOREIGN KEY (sub_fund_id) REFERENCES funds(id),
  UNIQUE(master_fund_id, sub_fund_id)
);
```

#### 2. 基金表增强
```sql
ALTER TABLE funds ADD COLUMN fund_category TEXT DEFAULT 'SUB';  -- MASTER/SUB
ALTER TABLE funds ADD COLUMN manager_name TEXT;
ALTER TABLE funds ADD COLUMN custodian TEXT;
ALTER TABLE funds ADD COLUMN investment_strategy TEXT;
ALTER TABLE funds ADD COLUMN benchmark TEXT;
ALTER TABLE funds ADD COLUMN risk_level TEXT;
```

#### 3. 新增审批流程表
```sql
CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,     -- 关联的交易ID
  transaction_type TEXT NOT NULL,   -- SUBSCRIPTION/REDEMPTION
  investor_id TEXT NOT NULL,
  fund_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'PENDING',    -- PENDING/APPROVED/REJECTED
  submitted_by TEXT,
  approved_by TEXT,
  approval_notes TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME,
  FOREIGN KEY (investor_id) REFERENCES investors(id),
  FOREIGN KEY (fund_id) REFERENCES funds(id)
);
```

#### 4. 新增文档管理表
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  doc_type TEXT NOT NULL,          -- CONTRACT/STATEMENT/REPORT/NOTICE
  fund_id TEXT,
  investor_id TEXT,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  uploaded_by TEXT,
  is_public BOOLEAN DEFAULT 0,
  FOREIGN KEY (fund_id) REFERENCES funds(id),
  FOREIGN KEY (investor_id) REFERENCES investors(id)
);
```

#### 5. 新增操作日志表
```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 6. 新增通知表
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'INFO',        -- INFO/WARNING/SUCCESS/ERROR
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### 阶段二：GP 管理端完善

#### GP 端新增页面

1. **投资者管理** (`/gp/investors`)
   - 投资者列表（搜索、筛选）
   - 投资者详情（基本信息、持仓、交易历史）
   - 添加/编辑投资者
   - KYC 资料管理

2. **审批中心** (`/gp/approvals`)
   - 待审批列表（申购/赎回）
   - 审批详情
   - 批量审批
   - 审批历史

3. **基金管理** (`/gp/funds`)
   - 母基金总览（含所有子基金）
   - 子基金列表
   - 添加/编辑基金
   - 基金配置（费率、限额等）
   - 母子基金关联设置

4. **净值管理** (`/gp/nav`)
   - 净值录入（批量导入）
   - 净值历史查询
   - 净值图表分析
   - 净值审核

5. **报表中心** (`/gp/reports`)
   - 持仓报表
   - 交易报表
   - 业绩报表
   - 费用报表
   - 合并报表（母基金+子基金）
   - 导出功能（Excel/PDF）

6. **文档管理** (`/gp/documents`)
   - 文档上传
   - 文档分类管理
   - 投资者文档分发

7. **系统设置** (`/gp/settings`)
   - 用户管理
   - 角色权限配置
   - 系统参数设置
   - 操作日志查询

---

### 阶段三：LP 端功能增强

#### LP 端新增/改进页面

1. **仪表盘优化** (`/dashboard`)
   - 多基金投资概览
   - 母基金+子基金层级展示
   - 资产配置饼图
   - 收益趋势图
   - 近期交易

2. **基金详情优化** (`/funds/:id`)
   - 基金基本信息
   - 净值走势图（可选时间区间）
   - 业绩指标（日/周/月/年收益率）
   - 如果是母基金，展示子基金列表和配置

3. **赎回功能** (`/redeem/:id`)
   - 赎回申请表单
   - 赎回费用计算
   - 到账金额预估
   - 赎回确认

4. **我的文档** (`/documents`)
   - 合同文件
   - 月度/季度报告
   - 交易确认函
   - 文档下载

5. **消息中心** (`/notifications`)
   - 系统通知
   - 交易提醒
   - 公告信息

6. **个人中心** (`/profile`)
   - 基本信息
   - 修改密码
   - 风险评估
   - 银行账户管理

---

### 阶段四：技术改进

#### 1. 数据库升级
- 配置支持 PostgreSQL/MySQL
- 使用环境变量配置连接
- 数据迁移脚本

#### 2. 后端改进
- 统一错误处理中间件
- 日志系统（Winston/Pino）
- API 版本控制
- 数据验证（Joi/Zod）
- 分页和排序
- 文件上传处理（Multer）

#### 3. 前端改进
- 全局状态管理（Zustand/Redux）
- 错误边界
- 加载状态优化
- 表格组件增强（排序、筛选、导出）
- 图表组件丰富
- 响应式设计优化
- 国际化支持

#### 4. 部署方案
- Docker 容器化
- Docker Compose 编排
- Nginx 反向代理
- HTTPS 配置
- 环境变量管理
- CI/CD 流程

---

## 四、实施计划

### 第一周：数据模型和后端核心功能
- [ ] 数据库表结构升级
- [ ] 创建真实业务数据种子脚本（母基金+5个子基金）
- [ ] 母子基金关联 API
- [ ] 审批流程 API
- [ ] 文档管理 API
- [ ] 通知系统 API

### 第二周：GP 管理端开发
- [ ] 投资者管理页面
- [ ] 审批中心页面
- [ ] 基金管理页面
- [ ] 净值管理页面

### 第三周：GP 管理端和 LP 端完善
- [ ] GP 报表中心
- [ ] GP 文档管理
- [ ] LP 赎回功能
- [ ] LP 文档中心
- [ ] LP 消息中心

### 第四周：部署和优化
- [ ] Docker 容器化
- [ ] 生产环境配置
- [ ] 性能优化
- [ ] 安全加固
- [ ] 文档完善

---

## 五、关键技术点

### 1. 母子基金合并计算
```typescript
// 计算母基金的合并净值
function calculateMasterFundNAV(masterFundId: string) {
  // 获取所有子基金
  const subFunds = getSubFunds(masterFundId);

  // 根据配置比例计算加权净值
  let totalWeight = 0;
  let weightedNAV = 0;

  subFunds.forEach(sub => {
    weightedNAV += sub.nav * sub.allocationRatio;
    totalWeight += sub.allocationRatio;
  });

  return weightedNAV / totalWeight;
}
```

### 2. 审批工作流
```typescript
// 审批状态机
PENDING -> APPROVED -> CONFIRMED (份额确认)
       -> REJECTED
```

### 3. 权限控制矩阵
```
角色             | 查看 | 创建 | 编辑 | 删除 | 审批
----------------|-----|------|------|------|------
Super Admin     |  ✓  |  ✓   |  ✓   |  ✓   |  ✓
GP Admin        |  ✓  |  ✓   |  ✓   |  ✓   |  ✓
GP Operator     |  ✓  |  ✓   |  ✓   |  ✗   |  ✗
LP Investor     |  ✓  |  ✓   |  ✗   |  ✗   |  ✗
```

---

## 六、部署架构

### 开发环境
```
SQLite + 本地服务 + Vite 热更新
```

### 生产环境
```
[客户端] -> [Nginx] -> [Node.js Backend] -> [PostgreSQL]
                     -> [静态文件服务]
                     -> [文件存储 (S3/OSS)]
```

### Docker 部署
```yaml
services:
  - postgres (数据库)
  - backend (Node.js API)
  - frontend (Nginx + 静态文件)
  - redis (缓存，可选)
```

---

## 七、下一步行动

**立即开始**：
1. 创建新的数据库迁移脚本（包含所有新表）
2. 创建真实业务数据种子（母基金+5个子基金）
3. 实现母子基金关联 API
4. 开发 GP 投资者管理页面
5. 开发 GP 审批中心

这个方案将使系统从演示版本升级为生产级别，支持您的实际业务需求！
