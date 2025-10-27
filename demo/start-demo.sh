#!/bin/bash

echo "🚀 天汇基金 OFC 平台演示版启动脚本"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo ""

# 后端设置
echo "📦 步骤 1/4: 安装后端依赖..."
cd backend

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ 后端依赖已安装"
fi

# 初始化数据库
echo ""
echo "🗄️  步骤 2/4: 初始化数据库..."
if [ ! -f "database/demo.db" ]; then
    npm run db:init
    npm run db:seed
    echo "✓ 数据库初始化完成"
else
    echo "✓ 数据库已存在"
    echo "   如需重置数据库，请运行: npm run db:reset"
fi

# 启动后端
echo ""
echo "🔧 步骤 3/4: 启动后端服务..."
npm run dev &
BACKEND_PID=$!

echo "✓ 后端服务已启动 (PID: $BACKEND_PID)"
echo "  API 地址: http://localhost:3000"

# 等待后端启动
echo ""
echo "⏳ 等待后端服务就绪..."
sleep 3

# 检查后端是否启动
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✓ 后端服务就绪"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "======================================"
echo "🎉 演示版本已启动！"
echo ""
echo "📝 演示账号:"
echo "   GP 管理员: gp-admin / 123456"
echo "   LP 投资者: lp-001 / 123456"
echo ""
echo "🌐 API 端点:"
echo "   后端: http://localhost:3000"
echo "   健康检查: http://localhost:3000/health"
echo ""
echo "📚 API 测试示例:"
echo "   curl -X POST http://localhost:3000/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"username\":\"lp-001\",\"password\":\"123456\"}'"
echo ""
echo "⚠️  注意: 前端需要单独安装和启动"
echo "   详见: QUICK_START.md"
echo ""
echo "按 Ctrl+C 停止服务"
echo "======================================"

# 等待用户中断
wait $BACKEND_PID
