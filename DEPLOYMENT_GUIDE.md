# 天汇基金 OFC 平台部署指南

## 📋 部署方案对比

| 方案 | 难度 | 成本 | 优点 | 缺点 | 推荐指数 |
|------|------|------|------|------|----------|
| **GitHub Codespaces** | ⭐ | 免费(60h/月) | 无需配置，一键启动 | 每月时长限制 | ⭐⭐⭐⭐ |
| **Railway** | ⭐⭐ | 免费额度 | 简单，支持全栈 | 免费额度有限 | ⭐⭐⭐⭐⭐ |
| **Render** | ⭐⭐ | 免费额度 | 稳定，自动部署 | 冷启动较慢 | ⭐⭐⭐⭐ |
| **Vercel + Railway** | ⭐⭐⭐ | 免费 | 前端快速，分离部署 | 配置较复杂 | ⭐⭐⭐⭐ |
| **Docker + VPS** | ⭐⭐⭐⭐ | $5+/月 | 完全控制，稳定 | 需要维护 | ⭐⭐⭐ |

---

## 🚀 推荐方案：Railway 全栈部署（最简单）

Railway 是一个现代化的云平台，支持全栈应用一键部署，**强烈推荐！**

### 优势
- ✅ **免费额度**：每月 $5 免费额度（足够小型应用）
- ✅ **自动部署**：连接 GitHub 自动部署
- ✅ **支持 SQLite**：无需额外配置数据库
- ✅ **自动 HTTPS**：自动提供域名和证书
- ✅ **环境变量管理**：可视化配置
- ✅ **日志查看**：实时查看应用日志

### 部署步骤

#### 第一步：准备代码
确保您的代码已推送到 GitHub（✅ 已完成）

#### 第二步：注册 Railway
1. 访问 [https://railway.app](https://railway.app)
2. 点击 "Start a New Project"
3. 使用 GitHub 账号登录授权

#### 第三步：部署后端
1. 在 Railway Dashboard 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择您的仓库 `LS`
4. 选择分支 `claude/fund-investor-platform-011CUX9DsALA1LMqzZoZ3w4u`
5. **重要**：设置 Root Directory 为 `demo/backend`
6. Railway 会自动检测到 Node.js 项目

#### 第四步：配置后端环境变量
在 Railway 项目设置中添加环境变量：
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
JWT_SECRET=your-super-secret-key-change-this-in-production
```

#### 第五步：配置启动命令
在 Railway 项目设置中：
- **Build Command**: `npm install && npm run db:upgrade`
- **Start Command**: `npm start`

或者创建 `railway.json` 文件（我会帮您创建）

#### 第六步：部署前端
**选项 A：也在 Railway 部署前端**
1. 创建另一个 Railway 服务
2. Root Directory 设为 `demo/frontend`
3. 添加环境变量 `VITE_API_URL=https://your-backend.railway.app`

**选项 B：在 Vercel 部署前端（推荐，速度更快）**
1. 访问 [https://vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. Root Directory 设为 `demo/frontend`
4. 添加环境变量 `VITE_API_URL=https://your-backend.railway.app`
5. 自动部署

#### 第七步：更新 CORS 配置
部署后端成功后，获取后端 URL（如 `https://your-app.railway.app`），然后：
1. 在 Railway 后端项目中更新 `CORS_ORIGIN` 环境变量为前端 URL
2. 重新部署

---

## 🐳 方案二：Docker 容器化部署

适合有自己服务器的用户，可以部署到 VPS、云服务器等。

### 优势
- 完全控制
- 可以扩展到多服务器
- 适合长期运营

### 部署步骤
详见下方 Docker 配置文件和说明。

---

## 🌐 方案三：分离部署（Vercel + Render）

前端部署到 Vercel（速度快），后端部署到 Render（稳定）。

### 后端部署到 Render
1. 访问 [https://render.com](https://render.com)
2. 点击 "New +" → "Web Service"
3. 连接 GitHub 仓库
4. 配置：
   - **Name**: tianhuifund-backend
   - **Root Directory**: `demo/backend`
   - **Build Command**: `npm install && npm run db:upgrade`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend.vercel.app
     JWT_SECRET=your-secret-key
     ```

### 前端部署到 Vercel
1. 访问 [https://vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置：
   - **Root Directory**: `demo/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

---

## 📝 部署前检查清单

- [ ] 代码已推送到 GitHub
- [ ] 已运行 `npm run db:upgrade` 初始化数据库
- [ ] 已测试本地运行正常
- [ ] 已准备好环境变量（JWT_SECRET 等）
- [ ] 了解所选平台的免费额度限制

---

## ⚙️ 环境变量说明

### 后端环境变量
```bash
# 必需
NODE_ENV=production              # 生产环境
PORT=3000                        # 端口号
CORS_ORIGIN=https://your-frontend-url  # 前端地址（允许跨域）
JWT_SECRET=your-very-secret-key  # JWT密钥（至少32位随机字符）

# 可选
DATABASE_PATH=./database/demo.db # 数据库路径（默认）
LOG_LEVEL=info                   # 日志级别
```

### 前端环境变量
```bash
# 必需
VITE_API_URL=https://your-backend-url  # 后端API地址
```

---

## 🔒 生产环境安全建议

1. **更改默认密码**：部署后立即更改所有测试账号密码
2. **JWT密钥**：使用强随机密钥（至少32位）
   ```bash
   # 生成随机密钥
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **HTTPS**：确保使用 HTTPS（Railway/Vercel 自动提供）
4. **CORS**：只允许您的前端域名跨域访问
5. **数据库备份**：定期备份 SQLite 数据库文件

---

## 📊 部署后测试

### 1. 测试后端健康检查
```bash
curl https://your-backend-url/health
# 应返回: {"status":"ok","timestamp":"..."}
```

### 2. 测试登录
```bash
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gp-admin","password":"123456"}'
```

### 3. 测试前端访问
在浏览器访问您的前端 URL，测试：
- ✅ 登录功能
- ✅ 仪表盘数据加载
- ✅ 基金列表显示
- ✅ 申购功能

---

## 🐛 常见问题

### Q1: 部署后提示 "CORS error"？
**A**: 检查后端的 `CORS_ORIGIN` 环境变量是否设置为前端的完整 URL（包括 https://）

### Q2: Railway 提示 "Out of memory"？
**A**: SQLite 数据库文件可能过大，或者净值历史数据太多。可以：
- 减少种子数据的净值历史天数（从180天改为30天）
- 升级 Railway 计划

### Q3: 前端能访问但看不到数据？
**A**:
1. 检查浏览器控制台是否有 CORS 错误
2. 检查前端的 `VITE_API_URL` 是否正确
3. 检查后端是否成功启动（访问 /health 端点）

### Q4: 数据库初始化失败？
**A**:
- Railway: 确保 Build Command 包含 `npm run db:upgrade`
- 检查日志查看具体错误信息

### Q5: 免费额度够用吗？
**A**:
- Railway: 每月 $5 免费额度，约500小时运行时间
- Render: 免费版有限制，服务闲置15分钟后休眠
- Vercel: 前端免费额度很充足

---

## 📈 扩展建议

### 短期（部署后）
- [ ] 更改所有默认密码
- [ ] 配置自定义域名
- [ ] 设置监控告警

### 中期（1-2个月后）
- [ ] 迁移到 PostgreSQL（更适合生产环境）
- [ ] 添加 Redis 缓存
- [ ] 配置 CDN 加速前端

### 长期（生产运营）
- [ ] 配置数据库自动备份
- [ ] 添加应用监控（Sentry）
- [ ] 配置日志聚合（LogDNA）
- [ ] 负载均衡和多实例部署

---

## 💡 我的推荐

**如果您是第一次部署，我推荐：**

1. **最快体验**：使用 GitHub Codespaces（已配置好）
2. **长期使用**：Railway 全栈部署（一个平台搞定前后端）
3. **最优性能**：Vercel（前端）+ Railway（后端）

**立即开始的步骤**：
1. 注册 Railway 账号
2. 我帮您创建 Railway 配置文件
3. 一键部署！

需要我帮您创建 Railway 配置文件吗？
