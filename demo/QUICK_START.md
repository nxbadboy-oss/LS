# 快速启动指南

## 第一步：安装后端依赖并初始化数据库

```bash
cd demo/backend
npm install

# 初始化数据库并添加演示数据
npm run db:init
npm run db:seed
```

## 第二步：启动后端服务

```bash
# 在 demo/backend 目录
npm run dev
```

后端服务将在 http://localhost:3000 启动

## 第三步：安装和启动前端

由于前端代码文件较多，建议使用以下两种方式之一：

### 方式 A：使用 Create React App（推荐）

```bash
cd demo
npx create-react-app frontend --template typescript
cd frontend

# 安装额外依赖
npm install antd axios react-router-dom recharts dayjs @ant-design/icons

# 配置代理 - 编辑 package.json，添加：
# "proxy": "http://localhost:3000"
```

然后将以下代码文件复制到 src 目录...

### 方式 B：使用 Vite（更快）

```bash
cd demo
npm create vite@latest frontend -- --template react-ts
cd frontend

# 安装依赖
npm install
npm install antd axios react-router-dom recharts dayjs @ant-design/icons
```

##  第四步：创建前端核心文件

由于演示版文件较多，我已经创建了后端 API 服务。前端部分您可以：

1. **使用提供的配置快速搭建** - package.json, vite.config.ts, tsconfig.json 已创建
2. **参考以下核心功能实现**：
   - 登录页面
   - Dashboard（GP / LP）
   - 基金列表
   - 申购流程
   - 持仓查询

### 前端目录结构

```
frontend/src/
├── main.tsx              # 入口文件
├── App.tsx               # 主应用组件
├── services/
│   └── api.ts           # API 服务
├── pages/
│   ├── Login.tsx        # 登录页
│   ├── GPDashboard.tsx  # GP 仪表盘
│   ├── LPDashboard.tsx  # LP 仪表盘
│   ├── FundList.tsx     # 基金列表
│   ├── Subscribe.tsx    # 申购页面
│   └── Holdings.tsx     # 持仓页面
└── types/
    └── index.ts         # 类型定义
```

## 测试 API

后端服务启动后，您可以测试 API：

### 登录测试

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "lp-001",
    "password": "123456"
  }'
```

### 获取基金列表

```bash
# 先登录获取 token，然后：
curl http://localhost:3000/api/funds \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 可用的演示账号

### GP 管理员
- 用户名: `gp-admin`
- 密码: `123456`

### GP 操作员
- 用户名: `gp-operator`
- 密码: `123456`

### LP 投资者
- 用户名: `lp-001` (张三)
- 密码: `123456`

- 用户名: `lp-002` (李四)
- 密码: `123456`

## 核心 API 端点

### 认证
- POST `/api/auth/login` - 登录
- GET `/api/auth/me` - 获取当前用户信息

### 基金
- GET `/api/funds` - 获取基金列表
- GET `/api/funds/:id` - 获取基金详情
- GET `/api/funds/:id/nav` - 获取净值历史

### 交易
- POST `/api/transactions/subscriptions` - 提交申购
- GET `/api/transactions/subscriptions` - 获取申购记录
- PATCH `/api/transactions/subscriptions/:id/confirm` - 确认申购(GP)
- POST `/api/transactions/redemptions` - 提交赎回
- GET `/api/transactions/redemptions` - 获取赎回记录

### 持仓
- GET `/api/holdings` - 获取持仓列表
- GET `/api/holdings/:id` - 获取持仓详情

### Dashboard
- GET `/api/dashboard/gp` - GP 仪表盘数据
- GET `/api/dashboard/lp` - LP 仪表盘数据

## 数据库管理

### 重置数据库

```bash
cd demo/backend
npm run db:reset
```

### 查看数据库

```bash
cd demo/backend
sqlite3 database/demo.db

# SQLite 命令
.tables                  # 查看所有表
SELECT * FROM users;     # 查看用户
SELECT * FROM funds;     # 查看基金
.quit                    # 退出
```

## 下一步开发

后端 API 已完整实现，您可以：

1. 根据 API 文档开发前端页面
2. 参考主项目文档中的 UI/UX 设计指南
3. 使用 Ant Design 组件快速搭建界面
4. 集成图表库（Recharts）展示数据

## 需要帮助？

- 查看 `demo/README.md` 了解项目详情
- 查看主项目的 `UI_UX_GUIDE.md` 了解设计规范
- 查看主项目的 `TECHNICAL_SPECS.md` 了解 API 详细说明

## 常见问题

### Q: 端口冲突怎么办？
A: 修改 `backend/.env` 文件中的 PORT 配置

### Q: CORS 错误？
A: 检查 `backend/.env` 中的 CORS_ORIGIN 配置是否正确

### Q: 数据库文件在哪里？
A: `backend/database/demo.db`

### Q: 如何添加新用户？
A: 编辑 `backend/src/database/seed.ts` 并运行 `npm run db:reset`
