# 🚀 天汇基金 OFC 平台 - 完整启动指南

## 📋 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm

## ⚡ 快速启动（推荐）

### 方式一：使用启动脚本

```bash
cd demo
chmod +x start-demo.sh
./start-demo.sh
```

然后在另一个终端启动前端：

```bash
cd demo/frontend
npm install
npm run dev
```

### 方式二：手动启动

#### 第一步：启动后端

```bash
# 进入后端目录
cd demo/backend

# 安装依赖
npm install

# 初始化数据库（首次运行）
npm run db:init

# 添加演示数据（首次运行）
npm run db:seed

# 启动后端服务
npm run dev
```

✅ 后端服务启动成功！
- API 地址: http://localhost:3000
- 健康检查: http://localhost:3000/health

#### 第二步：启动前端

**打开新终端窗口**，执行：

```bash
# 进入前端目录
cd demo/frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

✅ 前端应用启动成功！
- 访问地址: http://localhost:5173

---

## 🔐 演示账号

### GP 管理员
- 用户名: `gp-admin`
- 密码: `123456`
- 权限: 管理基金、审核交易、查看所有数据

### GP 操作员
- 用户名: `gp-operator`
- 密码: `123456`
- 权限: 日常操作、数据录入

### LP 投资者
- 用户名: `lp-001` (张三)
- 密码: `123456`
- 说明: 有持仓、可以申购赎回

- 用户名: `lp-002` (李四)
- 密码: `123456`
- 说明: 有持仓、可以申购赎回

- 用户名: `lp-003` (王五)
- 密码: `123456`
- 说明: 有持仓、可以申购赎回

---

## 🎯 功能演示流程

### LP 投资者申购流程

1. **登录系统**
   - 使用 `lp-001` / `123456` 登录
   - 系统自动跳转到 Dashboard

2. **查看资产概览**
   - 查看总资产、总收益、收益率
   - 查看收益曲线图
   - 查看资产配置饼图

3. **申购基金**
   - 点击左侧菜单 "基金列表"
   - 选择一只基金，点击 "立即申购"
   - 填写申购金额（如：¥50,000）
   - 查看费用明细
   - 确认提交

4. **查看持仓**
   - 点击左侧菜单 "我的持仓"
   - 查看持仓明细、浮动盈亏
   - 查看收益率

5. **查看交易记录**
   - 点击左侧菜单 "交易记录"
   - 查看申购/赎回记录
   - 查看交易状态

### GP 管理员审核流程

1. **登录系统**
   - 使用 `gp-admin` / `123456` 登录

2. **查看管理概览**
   - 查看总基金数、投资者数、管理规模
   - 查看待处理申购（通常有 3 笔）
   - 查看基金业绩排行

3. **审核申购**
   - 点击 "交易记录"
   - 查看待处理的申购申请
   - 确认申购（输入确认净值）
   - 系统自动更新持仓

4. **查看基金详情**
   - 点击 "基金列表"
   - 查看各基金的净值、规模
   - 查看净值走势图

---

## 📊 演示数据说明

### 基金产品（3只）
1. **TH001 - 天汇价值成长基金** (股票型)
   - 单位净值: 1.2345
   - 规模: ¥5,200万
   - 累计收益: +45.67%

2. **TH002 - 天汇稳健债券基金** (债券型)
   - 单位净值: 1.0856
   - 规模: ¥3,500万
   - 累计收益: +12.34%

3. **TH003 - 天汇均衡配置基金** (混合型)
   - 单位净值: 1.1523
   - 规模: ¥2,800万
   - 累计收益: +27.89%

### 净值数据
- 每个基金都有 90 天的历史净值数据
- 可在图表中查看净值走势

### 投资者持仓
- 每个 LP 都有 1-2 个基金的持仓
- 持仓金额在 10万-50万之间
- 有真实的浮动盈亏数据

---

## 🔧 API 测试

### 测试登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"lp-001","password":"123456"}'
```

### 测试获取基金列表

```bash
# 先从上面的登录响应中获取 token
TOKEN="your_token_here"

curl http://localhost:3000/api/funds \
  -H "Authorization: Bearer $TOKEN"
```

### 查看健康状态

```bash
curl http://localhost:3000/health
```

---

## 🗄️ 数据库管理

### 查看数据库

```bash
cd demo/backend
sqlite3 database/demo.db

# 在 SQLite 命令行中：
.tables                    # 查看所有表
SELECT * FROM users;       # 查看用户
SELECT * FROM funds;       # 查看基金
SELECT * FROM holdings;    # 查看持仓
.quit                      # 退出
```

### 重置数据库

```bash
cd demo/backend
npm run db:reset
```

这将删除现有数据库，重新初始化并添加演示数据。

---

## 🐛 常见问题

### Q1: 后端启动失败？
**A**: 检查 Node.js 版本（需要 >= 18）
```bash
node --version
```

### Q2: 前端无法访问 API？
**A**:
1. 确保后端已启动（http://localhost:3000/health 应该返回 OK）
2. 检查 vite.config.ts 中的代理配置

### Q3: 数据库不存在？
**A**: 运行初始化命令
```bash
cd demo/backend
npm run db:init
npm run db:seed
```

### Q4: 端口被占用？
**A**: 修改端口配置
- 后端: 编辑 `backend/.env` 中的 `PORT`
- 前端: 编辑 `frontend/vite.config.ts` 中的 `server.port`

### Q5: 依赖安装失败？
**A**: 尝试清除缓存
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q6: 登录后没有数据？
**A**: 确认数据库已正确初始化
```bash
cd demo/backend
npm run db:seed
```

---

## 📂 项目结构

```
demo/
├── README.md              # 项目说明
├── START.md              # 本文件 - 启动指南
├── QUICK_START.md        # 快速启动
├── start-demo.sh         # 启动脚本
├── backend/              # 后端服务
│   ├── src/
│   │   ├── database/     # 数据库初始化
│   │   ├── routes/       # API 路由
│   │   ├── middleware/   # 中间件
│   │   └── index.ts      # 入口文件
│   ├── database/         # 数据库文件
│   │   └── demo.db       # SQLite 数据库
│   └── package.json
└── frontend/             # 前端应用
    ├── src/
    │   ├── pages/        # 页面组件
    │   ├── components/   # 通用组件
    │   ├── services/     # API 服务
    │   ├── types/        # 类型定义
    │   └── utils/        # 工具函数
    └── package.json
```

---

## 🚦 系统要求

### 最低配置
- CPU: 双核
- 内存: 4GB
- 硬盘: 500MB

### 推荐配置
- CPU: 四核或更高
- 内存: 8GB 或更高
- 硬盘: 1GB 或更高

---

## 📞 获取帮助

### 查看文档
- 主项目文档: `../README.md`
- 技术规范: `../TECHNICAL_SPECS.md`
- 开发路线图: `../ROADMAP.md`
- UI 设计指南: `../UI_UX_GUIDE.md`

### 常用命令

```bash
# 后端
npm run dev          # 启动开发服务器
npm run db:init      # 初始化数据库
npm run db:seed      # 添加演示数据
npm run db:reset     # 重置数据库

# 前端
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

---

## ✅ 验证清单

启动完成后，请验证以下功能：

- [ ] 后端服务正常运行 (http://localhost:3000/health 返回 OK)
- [ ] 前端应用可访问 (http://localhost:5173)
- [ ] 可以使用演示账号登录
- [ ] Dashboard 显示数据
- [ ] 基金列表可正常查看
- [ ] 申购流程可以走通
- [ ] 持仓数据正确显示
- [ ] 交易记录可以查询

---

## 🎉 开始使用

一切就绪！现在您可以：

1. 🖥️ 访问 http://localhost:5173
2. 🔐 使用演示账号登录
3. 🎯 体验完整的申购流程
4. 📊 查看各种数据和图表
5. 🛠️ 根据需求定制开发

祝您使用愉快！如有问题，请查看上面的常见问题部分。
