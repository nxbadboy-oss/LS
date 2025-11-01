# 天汇基金 OFC 平台 - GitHub Codespaces 快速启动

## 🚀 使用 GitHub Codespaces 在线运行

### 步骤 1: 打开 Codespaces

1. 访问您的 GitHub 仓库页面
2. 点击绿色的 **"Code"** 按钮
3. 切换到 **"Codespaces"** 标签
4. 点击 **"Create codespace on claude/fund-investor-platform-011CUX9DsALA1LMqzZoZ3w4u"**

### 步骤 2: 等待环境启动（约 1-2 分钟）

Codespace 会自动：
- ✅ 创建云端开发环境
- ✅ 克隆代码
- ✅ 安装 Node.js

### 步骤 3: 启动服务

在 Codespace 的终端中运行：

```bash
# 启动后端
cd demo/backend
npm install
npm run db:init
npm run db:seed
npm run dev &

# 启动前端（新终端）
cd demo/frontend
npm install
npm run dev
```

### 步骤 4: 访问应用

- Codespaces 会自动转发端口 5173
- 在右下角会弹出通知，点击 **"在浏览器中打开"**
- 或者在 "端口" 面板找到 5173，点击地球图标

### 登录信息

```
用户名: lp-001
密码: 123456
```

## 优势

✅ 无需本地安装任何东西
✅ 可以在任何电脑上访问
✅ 自动配置和端口转发
✅ 免费使用（每月 60 小时）

## 注意

⚠️ 记得使用完后停止或删除 Codespace，以免占用免费额度
