# 天汇基金 OFC 平台 - 演示版本

## 项目简介

这是天汇基金 OFC 投资人管理平台的演示版本，包含核心功能的基本实现，用于快速验证概念和用户体验。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios
- Recharts (图表)

### 后端
- Node.js
- Express
- TypeScript
- SQLite (演示数据库)
- JWT 认证

## 功能清单

### ✅ 已实现功能

#### GP 管理端
- [x] 登录认证
- [x] Dashboard（数据概览）
- [x] 基金列表与详情
- [x] 投资者列表
- [x] 交易审核（申购/赎回）
- [x] 净值管理

#### LP 投资端
- [x] 登录认证
- [x] 个人 Dashboard
- [x] 持仓查询
- [x] 申购流程
- [x] 赎回流程
- [x] 交易记录

### 🚧 演示数据

系统预置了以下演示数据：
- 3 个基金产品
- 10 个投资者账户
- 50+ 条历史交易记录
- 完整的净值历史数据

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
cd demo
```

2. **安装后端依赖**
```bash
cd backend
npm install
```

3. **安装前端依赖**
```bash
cd ../frontend
npm install
```

4. **初始化数据库（首次运行）**
```bash
cd ../backend
npm run db:init
```

### 启动服务

#### 方式一：分别启动（推荐开发）

```bash
# 终端 1 - 启动后端服务
cd backend
npm run dev

# 终端 2 - 启动前端服务
cd frontend
npm run dev
```

#### 方式二：一键启动

```bash
# 在 demo 根目录
npm run start
```

### 访问地址

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000
- API 文档：http://localhost:3000/api-docs

## 演示账号

### GP 管理员
- 用户名：`gp-admin`
- 密码：`123456`

### GP 操作员
- 用户名：`gp-operator`
- 密码：`123456`

### LP 投资者
- 用户名：`lp-001` (张三)
- 密码：`123456`

- 用户名：`lp-002` (李四)
- 密码：`123456`

## 项目结构

```
demo/
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/   # 通用组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 服务
│   │   ├── store/        # 状态管理
│   │   ├── types/        # 类型定义
│   │   └── utils/        # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # 后端服务
│   ├── src/
│   │   ├── routes/       # 路由
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── models/       # 数据模型
│   │   ├── middleware/   # 中间件
│   │   └── utils/        # 工具函数
│   ├── database/         # 数据库文件
│   └── package.json
│
└── README.md             # 本文档
```

## API 文档

### 认证相关

```
POST /api/auth/login      # 登录
POST /api/auth/logout     # 登出
GET  /api/auth/me         # 获取当前用户信息
```

### 基金相关

```
GET  /api/funds           # 获取基金列表
GET  /api/funds/:id       # 获取基金详情
POST /api/funds           # 创建基金（GP）
GET  /api/funds/:id/nav   # 获取净值历史
```

### 交易相关

```
POST /api/transactions/subscriptions      # 提交申购
POST /api/transactions/redemptions        # 提交赎回
GET  /api/transactions/subscriptions      # 获取申购记录
GET  /api/transactions/redemptions        # 获取赎回记录
```

### 持仓相关

```
GET  /api/holdings        # 获取持仓列表
GET  /api/holdings/:id    # 获取持仓详情
```

## 功能演示流程

### 1. LP 投资者申购流程

1. 使用 LP 账号登录 (`lp-001` / `123456`)
2. 进入"基金列表"页面
3. 选择基金，点击"立即申购"
4. 填写申购金额（如：¥100,000）
5. 确认费用明细
6. 提交申购申请
7. 等待 GP 确认

### 2. GP 管理员审核流程

1. 使用 GP 管理员账号登录 (`gp-admin` / `123456`)
2. 在 Dashboard 看到"待处理申购"
3. 进入"交易管理"页面
4. 查看申购详情
5. 确认申购（输入确认净值）
6. 查看更新后的持仓

### 3. LP 查看持仓收益

1. LP 登录后进入"我的持仓"
2. 查看总资产、总收益、收益率
3. 查看持仓详情和收益曲线
4. 下载持仓报表

## 技术特点

### 前端特性
- ✅ TypeScript 类型安全
- ✅ React Hooks
- ✅ Ant Design 企业级 UI
- ✅ 响应式布局
- ✅ 路由权限控制
- ✅ Axios 请求拦截
- ✅ 数据可视化图表

### 后端特性
- ✅ RESTful API 设计
- ✅ JWT 认证
- ✅ 角色权限控制
- ✅ 请求日志
- ✅ 错误处理
- ✅ 数据验证
- ✅ SQLite 轻量数据库

## 限制说明

这是演示版本，存在以下限制：

1. **数据库**：使用 SQLite，不适合生产环境
2. **认证**：简化的 JWT 实现，无 MFA
3. **文件存储**：无对象存储，文件保存在本地
4. **性能优化**：无缓存、无队列
5. **测试**：未包含完整测试
6. **部署**：仅支持本地开发环境

## 下一步开发建议

### 优先级 1（核心功能完善）
- [ ] 添加完整的净值计算逻辑
- [ ] 实现审批工作流
- [ ] 添加报表生成功能
- [ ] 完善数据验证

### 优先级 2（体验优化）
- [ ] 添加更多图表和可视化
- [ ] 实现通知系统
- [ ] 优化移动端适配
- [ ] 添加搜索和筛选

### 优先级 3（生产就绪）
- [ ] 切换到 PostgreSQL
- [ ] 添加 Redis 缓存
- [ ] 实现完整的安全机制
- [ ] 添加单元测试和集成测试
- [ ] Docker 容器化
- [ ] CI/CD 配置

## 常见问题

### Q: 如何重置数据库？
```bash
cd backend
npm run db:reset
```

### Q: 如何修改端口？
编辑 `backend/.env` 和 `frontend/.env` 文件

### Q: 如何添加新的演示数据？
编辑 `backend/src/database/seed.ts` 文件

### Q: 如何部署到生产环境？
演示版不建议直接部署生产环境，请参考主文档中的生产部署方案

## 联系方式

如有问题或建议，请提交 Issue 或联系项目负责人。

---

**演示版本**: v0.1.0
**最后更新**: 2025-10-27
