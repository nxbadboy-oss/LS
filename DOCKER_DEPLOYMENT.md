# Docker 部署指南

使用 Docker 可以在任何支持 Docker 的服务器上快速部署天汇基金 OFC 平台。

## 🐳 快速开始

### 前提条件
- 已安装 Docker (>= 20.10)
- 已安装 Docker Compose (>= 2.0)

### 一键启动

```bash
# 1. 克隆代码（如果还没有）
git clone <your-repo-url>
cd LS

# 2. 设置 JWT 密钥（重要！）
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 3. 启动所有服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 访问应用
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

就这么简单！🎉

---

## 📋 详细步骤

### 1. 环境准备

**创建环境变量文件**（可选）：
```bash
# 在项目根目录创建 .env 文件
cat > .env << EOF
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
CORS_ORIGIN=http://localhost:5173
EOF
```

**生成强随机 JWT 密钥**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. 构建和启动

**构建镜像**：
```bash
docker-compose build
```

**启动服务**：
```bash
# 后台运行
docker-compose up -d

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. 验证部署

**检查服务状态**：
```bash
docker-compose ps
```

应该看到两个服务都是 `Up` 状态：
```
NAME                        STATUS
tianhuifund-backend         Up (healthy)
tianhuifund-frontend        Up (healthy)
```

**测试后端**：
```bash
curl http://localhost:3000/health
# 应返回: {"status":"ok","timestamp":"..."}
```

**测试前端**：
打开浏览器访问 http://localhost:5173

### 4. 登录测试

使用测试账号登录：
```
GP管理员: gp-admin / 123456
LP投资者: lp-001 / 123456
```

---

## 🔧 常用命令

### 服务管理
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f [service-name]

# 查看服务状态
docker-compose ps

# 进入容器
docker-compose exec backend sh
docker-compose exec frontend sh
```

### 数据管理
```bash
# 备份数据库
docker-compose exec backend cat /app/database/demo.db > backup.db

# 恢复数据库
cat backup.db | docker-compose exec -T backend tee /app/database/demo.db

# 重置数据库
docker-compose exec backend npm run db:upgrade
```

### 清理
```bash
# 停止并删除容器
docker-compose down

# 停止并删除容器、网络、卷
docker-compose down -v

# 删除镜像
docker-compose down --rmi all
```

---

## 🚀 生产环境部署

### 1. 修改配置

**编辑 docker-compose.yml**：
```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=https://your-domain.com  # 改为您的域名
      - JWT_SECRET=${JWT_SECRET}
    # 添加重启策略
    restart: always

  frontend:
    build:
      args:
        - VITE_API_URL=https://api.your-domain.com  # 改为您的后端域名
    restart: always
```

### 2. 配置反向代理（Nginx）

如果您有域名，建议在前面加一层 Nginx 反向代理：

```nginx
# /etc/nginx/sites-available/tianhuifund

# 后端 API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# 前端
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 配置 HTTPS（Let's Encrypt）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 4. 启动服务

```bash
# 设置 JWT 密钥
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 启动
docker-compose up -d

# 检查日志
docker-compose logs -f
```

---

## 🔒 安全建议

1. **更改默认密码**
   ```bash
   # 进入容器
   docker-compose exec backend sh

   # 连接数据库修改密码
   # 或者通过 API 修改
   ```

2. **使用强随机 JWT 密钥**
   ```bash
   # 至少 32 位随机字符
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **配置防火墙**
   ```bash
   # 只允许 80 和 443 端口
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **定期备份数据库**
   ```bash
   # 添加到 crontab
   0 2 * * * docker-compose exec backend cat /app/database/demo.db > /backup/tianhuifund-$(date +\%Y\%m\%d).db
   ```

---

## 📊 监控和日志

### 查看资源使用情况
```bash
docker stats tianhuifund-backend tianhuifund-frontend
```

### 日志管理
```bash
# 查看最新 100 行日志
docker-compose logs --tail=100 backend

# 持续查看日志
docker-compose logs -f backend

# 导出日志
docker-compose logs backend > backend.log
```

### 健康检查
```bash
# 检查容器健康状态
docker-compose ps

# 手动触发健康检查
docker-compose exec backend wget -qO- http://localhost:3000/health
```

---

## ⚡ 性能优化

### 1. 启用数据库持久化卷
```yaml
volumes:
  - backend-data:/app/database  # 已配置
```

### 2. 添加 Redis 缓存（可选）
```yaml
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
```

### 3. 使用生产优化的 Node.js 镜像
```dockerfile
FROM node:18-alpine
ENV NODE_ENV=production
```

---

## 🐛 故障排查

### 服务无法启动
```bash
# 查看详细日志
docker-compose logs backend

# 检查端口占用
netstat -tuln | grep 3000
netstat -tuln | grep 5173

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 数据库初始化失败
```bash
# 进入容器手动初始化
docker-compose exec backend sh
npm run db:upgrade

# 查看数据库文件
ls -la /app/database/
```

### CORS 错误
检查后端的 `CORS_ORIGIN` 环境变量是否正确设置为前端 URL。

---

## 📦 部署到云服务器

### AWS EC2
```bash
# 1. 连接到 EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. 安装 Docker
sudo apt update
sudo apt install docker.io docker-compose

# 3. 克隆代码并部署
git clone <your-repo>
cd LS
export JWT_SECRET=$(openssl rand -hex 32)
docker-compose up -d
```

### DigitalOcean Droplet
```bash
# 1. 创建 Droplet（选择 Docker 镜像）
# 2. SSH 连接
ssh root@your-droplet-ip

# 3. 部署
git clone <your-repo>
cd LS
docker-compose up -d
```

### 阿里云 ECS
```bash
# 1. 连接到 ECS
ssh root@your-ecs-ip

# 2. 安装 Docker
wget -qO- https://get.docker.com/ | sh

# 3. 部署
git clone <your-repo>
cd LS
docker-compose up -d
```

---

## ✅ 部署检查清单

部署前确认：
- [ ] 已生成强随机 JWT 密钥
- [ ] 已修改默认密码
- [ ] 已配置正确的 CORS_ORIGIN
- [ ] 已配置 HTTPS（生产环境）
- [ ] 已设置数据库备份
- [ ] 已配置防火墙
- [ ] 已测试所有核心功能

---

## 🆘 获取帮助

如果遇到问题：
1. 查看日志：`docker-compose logs -f`
2. 检查健康状态：`docker-compose ps`
3. 查看本文档的故障排查部分
4. 查看 DEPLOYMENT_GUIDE.md 了解其他部署方案

---

**部署愉快！** 🚀
