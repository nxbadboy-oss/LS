#!/bin/bash

# 天汇基金 OFC 平台部署验证脚本

echo "========================================="
echo "  天汇基金 OFC 平台部署验证工具"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 已安装"
        return 0
    else
        echo -e "${RED}✗${NC} $1 未安装"
        return 1
    fi
}

# 测试 URL
test_url() {
    local url=$1
    local name=$2

    echo -n "测试 $name ($url)... "

    if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ 成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        return 1
    fi
}

echo "1. 检查依赖工具"
echo "-------------------"
check_command "node"
check_command "npm"
check_command "docker"
check_command "docker-compose"
check_command "curl"
echo ""

echo "2. 检查本地服务"
echo "-------------------"
test_url "http://localhost:3000/health" "后端健康检查"
test_url "http://localhost:5173" "前端页面"
echo ""

echo "3. 测试后端 API"
echo "-------------------"

# 测试登录
echo -n "测试登录 API... "
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gp-admin","password":"123456"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ 成功${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  获得 Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  响应: $LOGIN_RESPONSE"
fi

# 测试基金列表
if [ ! -z "$TOKEN" ]; then
    echo -n "测试基金列表 API... "
    FUNDS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:3000/api/funds)

    if echo "$FUNDS_RESPONSE" | grep -q "fund_name"; then
        echo -e "${GREEN}✓ 成功${NC}"
        FUND_COUNT=$(echo "$FUNDS_RESPONSE" | grep -o "fund_name" | wc -l)
        echo "  找到 $FUND_COUNT 个基金"
    else
        echo -e "${RED}✗ 失败${NC}"
    fi
fi
echo ""

echo "4. 检查 Docker 容器（如果使用 Docker）"
echo "-------------------"
if docker-compose ps 2>/dev/null | grep -q "Up"; then
    docker-compose ps
else
    echo -e "${YELLOW}未使用 Docker 部署${NC}"
fi
echo ""

echo "========================================="
echo "  验证完成"
echo "========================================="
echo ""
echo "测试账号："
echo "  GP 管理员: gp-admin / 123456"
echo "  LP 投资者: lp-001 / 123456"
echo ""
echo "访问地址："
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3000"
echo ""
