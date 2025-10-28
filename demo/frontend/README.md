# 天汇基金 OFC 平台 - 前端应用

## 快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 3. 构建生产版本

```bash
npm run build
```

## 演示账号

### GP 管理员
- 用户名: `gp-admin`
- 密码: `123456`

### LP 投资者
- 用户名: `lp-001`
- 密码: `123456`

## 功能页面

### LP 投资者功能
- ✅ **首页 Dashboard** - 资产概览、收益曲线、资产配置
- ✅ **基金列表** - 浏览所有基金、查看详情
- ✅ **申购流程** - 三步申购流程（填写信息 → 确认 → 完成）
- ✅ **我的持仓** - 持仓明细、浮动盈亏、收益率
- ✅ **交易记录** - 申购/赎回记录查询

### GP 管理员功能
- ✅ **管理 Dashboard** - 管理规模、基金数量、待处理事项
- ✅ **基金列表** - 查看所有基金
- ✅ **交易记录** - 查看所有投资者交易

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5
- **路由**: React Router v6
- **HTTP 客户端**: Axios
- **图表库**: Recharts
- **日期处理**: Day.js

## 项目结构

```
src/
├── main.tsx              # 应用入口
├── App.tsx               # 主应用组件
├── index.css             # 全局样式
├── components/           # 通用组件
│   └── PrivateRoute.tsx # 路由守卫
├── pages/                # 页面组件
│   ├── Login.tsx        # 登录页
│   ├── Dashboard.tsx    # 仪表盘
│   ├── FundList.tsx     # 基金列表
│   ├── Subscribe.tsx    # 申购页面
│   ├── Holdings.tsx     # 持仓页面
│   └── Transactions.tsx # 交易记录
├── services/             # 服务层
│   └── api.ts           # API 客户端
├── types/                # 类型定义
│   └── index.ts         # 全局类型
└── utils/                # 工具函数
    └── format.ts        # 格式化函数
```

## API 配置

API 请求通过 Vite 代理转发到后端服务：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 路由说明

| 路径 | 组件 | 权限 | 说明 |
|------|------|------|------|
| `/login` | Login | 公开 | 登录页面 |
| `/dashboard` | Dashboard | 需登录 | 首页仪表盘 |
| `/funds` | FundList | 需登录 | 基金列表 |
| `/subscribe/:id` | Subscribe | LP | 申购页面 |
| `/holdings` | Holdings | LP | 持仓查询 |
| `/transactions` | Transactions | 需登录 | 交易记录 |

## 开发说明

### 添加新页面

1. 在 `src/pages/` 创建新组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/PrivateRoute.tsx` 添加菜单项（可选）

### API 调用

所有 API 调用使用 `src/services/api.ts`：

```typescript
import api from '../services/api';

// GET 请求
const response = await api.get('/funds');

// POST 请求
const response = await api.post('/transactions/subscriptions', {
  fundId: 'xxx',
  amount: 100000
});
```

### 状态管理

当前使用 React Hooks (useState, useEffect) 进行状态管理。
如需全局状态管理，可以集成 Redux Toolkit 或 Zustand。

## 常见问题

### Q: 启动后看不到数据？
A: 确保后端服务已启动（http://localhost:3000）

### Q: 登录后跳转到 404？
A: 检查路由配置，确保 BrowserRouter 正确配置

### Q: API 请求失败？
A: 检查 vite.config.ts 中的代理配置

### Q: 样式不生效？
A: 确保已安装 Ant Design 并在 main.tsx 中导入样式

## 待优化项

- [ ] 添加 Loading 骨架屏
- [ ] 优化移动端适配
- [ ] 添加错误边界
- [ ] 实现请求缓存
- [ ] 添加单元测试
- [ ] 优化打包体积

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## License

MIT
