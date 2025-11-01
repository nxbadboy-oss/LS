#!/bin/bash

# 天汇基金 OFC 平台快速部署脚本

set -e  # 遇到错误立即退出

echo "========================================="
echo "  天汇基金 OFC 平台快速部署工具"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}选择部署方式：${NC}"
echo "1. Docker 部署（推荐，一键部署前后端）"
echo "2. 本地开发模式（需要手动启动前后端）"
echo ""
read -p "请选择 (1 或 2): " choice

case $choice in
  1)
    echo ""
    echo "=== Docker 部署 ==="
    echo ""

    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        echo "错误: 未安装 Docker"
        echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "错误: 未安装 Docker Compose"
        exit 1
    fi

    # 生成 JWT 密钥
    echo "生成 JWT 密钥..."
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    export JWT_SECRET

    echo -e "${GREEN}✓ JWT 密钥已生成${NC}"
    echo ""

    # 构建镜像
    echo "构建 Docker 镜像..."
    docker-compose build

    echo -e "${GREEN}✓ 镜像构建完成${NC}"
    echo ""

    # 启动服务
    echo "启动服务..."
    docker-compose up -d

    echo -e "${GREEN}✓ 服务已启动${NC}"
    echo ""

    # 等待服务就绪
    echo "等待服务就绪（约30秒）..."
    sleep 30

    # 检查状态
    echo ""
    echo "服务状态："
    docker-compose ps

    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  部署成功！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "访问地址："
    echo "  前端: http://localhost:5173"
    echo "  后端: http://localhost:3000"
    echo ""
    echo "测试账号："
    echo "  GP 管理员: gp-admin / 123456"
    echo "  LP 投资者: lp-001 / 123456"
    echo ""
    echo "常用命令："
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
    echo ""
    ;;

  2)
    echo ""
    echo "=== 本地开发模式 ==="
    echo ""

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo "错误: 未安装 Node.js"
        echo "请访问 https://nodejs.org 安装 Node.js"
        exit 1
    fi

    # 后端设置
    echo "1. 设置后端..."
    cd demo/backend

    if [ ! -d "node_modules" ]; then
        echo "  安装后端依赖..."
        npm install
    fi

    echo "  初始化数据库..."
    npm run db:upgrade

    echo -e "${GREEN}✓ 后端设置完成${NC}"
    cd ../..

    # 前端设置
    echo ""
    echo "2. 设置前端..."
    cd demo/frontend

    if [ ! -d "node_modules" ]; then
        echo "  安装前端依赖..."
        npm install
    fi

    echo -e "${GREEN}✓ 前端设置完成${NC}"
    cd ../..

    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  设置完成！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "请在两个终端窗口中分别运行："
    echo ""
    echo "终端1 - 启动后端："
    echo "  cd demo/backend"
    echo "  npm run dev"
    echo ""
    echo "终端2 - 启动前端："
    echo "  cd demo/frontend"
    echo "  npm run dev"
    echo ""
    echo "然后访问 http://localhost:5173"
    echo ""
    ;;

  *)
    echo "无效的选择"
    exit 1
    ;;
esac
