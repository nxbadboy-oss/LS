# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 编译 TypeScript（如果需要）
# RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 复制依赖和代码
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# 创建数据库目录
RUN mkdir -p database

# 初始化数据库
RUN npm run db:upgrade

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
CMD ["npm", "start"]
