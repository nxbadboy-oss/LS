# 天汇基金 OFC 平台 - UI/UX 设计指南

## 设计原则

### 1. 核心设计理念

**专业性**
- 金融级的视觉呈现
- 清晰的信息层级
- 准确的数据展示

**易用性**
- 简化复杂流程
- 清晰的操作引导
- 减少认知负担

**可信赖**
- 一致的交互体验
- 及时的反馈机制
- 安全感的传达

**高效性**
- 快速完成核心任务
- 减少操作步骤
- 智能的默认值

---

## 视觉设计规范

### 1. 色彩系统

#### 主色调
```css
/* 品牌主色 - 专业蓝 */
--primary-50: #E3F2FD;
--primary-100: #BBDEFB;
--primary-200: #90CAF9;
--primary-300: #64B5F6;
--primary-400: #42A5F5;
--primary-500: #2196F3;  /* 主色 */
--primary-600: #1E88E5;
--primary-700: #1976D2;
--primary-800: #1565C0;
--primary-900: #0D47A1;

/* 辅助色 - 信任绿 */
--success-500: #4CAF50;
--success-600: #43A047;

/* 警告色 - 提醒橙 */
--warning-500: #FF9800;
--warning-600: #FB8C00;

/* 错误色 - 警示红 */
--error-500: #F44336;
--error-600: #E53935;

/* 中性色 */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;
```

#### 语义化颜色应用

```css
/* 涨跌颜色（中国大陆习惯：红涨绿跌）*/
--color-rise: #F44336;    /* 上涨红色 */
--color-fall: #4CAF50;    /* 下跌绿色 */
--color-neutral: #9E9E9E; /* 持平灰色 */

/* 状态颜色 */
--status-pending: #FF9800;    /* 待处理 */
--status-success: #4CAF50;    /* 成功 */
--status-rejected: #F44336;   /* 拒绝 */
--status-cancelled: #9E9E9E;  /* 取消 */

/* 背景色 */
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--bg-tertiary: #FAFAFA;
--bg-overlay: rgba(0, 0, 0, 0.5);
```

### 2. 字体系统

```css
/* 字体族 */
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
  'Microsoft YaHei', sans-serif;
--font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
--font-family-number: 'SF Pro Display', 'Segoe UI', 'PingFang SC', sans-serif;

/* 字号 */
--text-xs: 12px;    /* 辅助信息 */
--text-sm: 14px;    /* 正文小号 */
--text-base: 16px;  /* 正文 */
--text-lg: 18px;    /* 小标题 */
--text-xl: 20px;    /* 标题 */
--text-2xl: 24px;   /* 大标题 */
--text-3xl: 30px;   /* 特大标题 */
--text-4xl: 36px;   /* 超大标题 */

/* 行高 */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* 字重 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3. 间距系统

```css
/* 8px 基础间距系统 */
--spacing-1: 4px;    /* 0.5x */
--spacing-2: 8px;    /* 1x - 基础单位 */
--spacing-3: 12px;   /* 1.5x */
--spacing-4: 16px;   /* 2x */
--spacing-5: 20px;   /* 2.5x */
--spacing-6: 24px;   /* 3x */
--spacing-8: 32px;   /* 4x */
--spacing-10: 40px;  /* 5x */
--spacing-12: 48px;  /* 6x */
--spacing-16: 64px;  /* 8x */
```

### 4. 圆角与阴影

```css
/* 圆角 */
--radius-sm: 4px;
--radius-base: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;

/* 阴影 */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
             0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

---

## 组件设计规范

### 1. 按钮（Button）

#### 按钮类型

```tsx
// 主要按钮（Primary）- 主要操作
<Button type="primary" size="large">
  确认申购
</Button>

// 次要按钮（Default）- 次要操作
<Button type="default" size="medium">
  取消
</Button>

// 文本按钮（Text）- 辅助操作
<Button type="text" size="small">
  查看详情
</Button>

// 危险按钮（Danger）- 危险操作
<Button type="danger" size="medium">
  删除
</Button>
```

#### 按钮尺寸

```css
/* 大按钮 */
.btn-large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
}

/* 中等按钮（默认）*/
.btn-medium {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
}

/* 小按钮 */
.btn-small {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}
```

#### 按钮状态

- **Normal**: 正常状态
- **Hover**: 鼠标悬停，背景色加深 10%
- **Active**: 点击时，背景色加深 20%
- **Loading**: 显示加载动画，禁止点击
- **Disabled**: 透明度 40%，禁止交互

### 2. 表单组件

#### 输入框（Input）

```tsx
// 基础输入框
<Input
  label="申购金额"
  placeholder="请输入申购金额"
  suffix="元"
  required
/>

// 金额输入框
<AmountInput
  label="申购金额"
  min={1000}
  max={10000000}
  precision={2}
  required
/>

// 带验证的输入框
<Input
  label="手机号"
  type="tel"
  rules={[
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
  ]}
/>
```

#### 选择器（Select）

```tsx
// 基金选择器
<FundSelector
  label="选择基金"
  placeholder="请选择基金"
  showSearch
  required
/>

// 日期选择器
<DatePicker
  label="净值日期"
  format="YYYY-MM-DD"
  disabledDate={(date) => date.isAfter(moment())}
/>

// 日期范围选择器
<DateRangePicker
  label="查询时间段"
  presets={[
    { label: '最近 7 天', value: [moment().subtract(7, 'd'), moment()] },
    { label: '最近 30 天', value: [moment().subtract(30, 'd'), moment()] },
    { label: '最近 90 天', value: [moment().subtract(90, 'd'), moment()] }
  ]}
/>
```

### 3. 数据展示组件

#### 表格（Table）

```tsx
// GP 端交易列表
<Table
  columns={[
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 180,
      fixed: 'left'
    },
    {
      title: '投资者',
      dataIndex: 'investorName',
      width: 120
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      width: 200
    },
    {
      title: '申购金额',
      dataIndex: 'amount',
      width: 150,
      align: 'right',
      render: (value) => formatAmount(value)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => <StatusBadge status={status} />
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (record) => (
        <>
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
          {record.status === 'PENDING' && (
            <Button type="link" onClick={() => handleConfirm(record)}>
              确认
            </Button>
          )}
        </>
      )
    }
  ]}
  dataSource={transactions}
  pagination={{
    current: page,
    pageSize: 20,
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`
  }}
  rowKey="id"
/>
```

#### 卡片（Card）

```tsx
// KPI 卡片
<KPICard
  title="管理资产规模"
  value={totalAUM}
  unit="元"
  trend={+5.23}
  period="较上月"
  icon={<AssetsIcon />}
  color="primary"
/>

// 基金卡片
<FundCard
  fund={fund}
  showActions
  onSubscribe={() => handleSubscribe(fund)}
  onRedeem={() => handleRedeem(fund)}
/>
```

#### 图表（Chart）

```tsx
// 净值走势图
<LineChart
  data={navHistory}
  xField="navDate"
  yField="nav"
  seriesField="fundName"
  yAxis={{
    label: {
      formatter: (v) => `¥${v.toFixed(4)}`
    }
  }}
  tooltip={{
    formatter: (datum) => ({
      name: '单位净值',
      value: `¥${datum.nav.toFixed(4)}`
    })
  }}
/>

// 资产配置饼图
<PieChart
  data={assetAllocation}
  angleField="value"
  colorField="fundType"
  label={{
    type: 'spider',
    content: '{name}\n{percentage}'
  }}
  legend={{
    position: 'right'
  }}
/>
```

### 4. 反馈组件

#### 消息提示（Message）

```tsx
// 成功消息
message.success('申购申请提交成功');

// 错误消息
message.error('申购申请提交失败，请重试');

// 警告消息
message.warning('您的可用余额不足');

// 信息消息
message.info('净值将在每日 18:00 更新');
```

#### 通知（Notification）

```tsx
// 交易通知
notification.success({
  message: '申购已确认',
  description: `您的申购订单 ${orderNumber} 已确认，确认份额 ${shares} 份`,
  duration: 6
});

// 系统通知
notification.info({
  message: '系统维护通知',
  description: '系统将于今晚 22:00-24:00 进行维护，期间无法进行交易操作',
  duration: 0  // 不自动关闭
});
```

#### 对话框（Modal）

```tsx
// 确认对话框
Modal.confirm({
  title: '确认赎回',
  content: `您确定要赎回 ${shares} 份吗？预估到账金额为 ¥${estimatedAmount}`,
  okText: '确认赎回',
  cancelText: '取消',
  onOk: handleConfirmRedemption
});

// 表单对话框
<Modal
  title="新建基金"
  visible={visible}
  onOk={handleSubmit}
  onCancel={handleCancel}
  width={800}
  footer={[
    <Button key="cancel" onClick={handleCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" loading={submitting} onClick={handleSubmit}>
      创建
    </Button>
  ]}
>
  <FundForm ref={formRef} />
</Modal>
```

---

## 页面布局设计

### 1. GP 管理端布局

```
┌─────────────────────────────────────────────────────────┐
│  Header (顶部导航栏)                                     │
│  ┌─────────────┐  用户信息  通知  退出                   │
│  │  天汇基金    │                                        │
│  └─────────────┘                                        │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  Sidebar │  Main Content (主要内容区)                   │
│  (侧边栏) │                                              │
│          │  ┌────────────────────────────────────────┐  │
│ ○ 首页   │  │  Breadcrumb (面包屑)                    │  │
│ ○ 基金   │  ├────────────────────────────────────────┤  │
│ ○ 投资者 │  │                                        │  │
│ ○ 交易   │  │  Page Header (页面标题 + 操作按钮)       │  │
│ ○ 持仓   │  │                                        │  │
│ ○ 报表   │  ├────────────────────────────────────────┤  │
│ ○ 设置   │  │                                        │  │
│          │  │  Content Area (内容区域)                │  │
│          │  │                                        │  │
│          │  │  ┌──────────┐  ┌──────────┐          │  │
│          │  │  │  Card 1  │  │  Card 2  │  ...    │  │
│          │  │  └──────────┘  └──────────┘          │  │
│          │  │                                        │  │
│          │  │  ┌────────────────────────────────┐   │  │
│          │  │  │  Table / Chart                 │   │  │
│          │  │  └────────────────────────────────┘   │  │
│          │  │                                        │  │
│          │  └────────────────────────────────────────┘  │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 2. LP 投资端布局

```
┌─────────────────────────────────────────────────────────┐
│  Header (顶部导航栏)                                     │
│  ┌─────────────┐  首页  基金  我的持仓  交易记录  消息  │
│  │  天汇基金    │                          用户  退出   │
│  └─────────────┘                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Main Content (主要内容区 - 全宽)                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Banner / Summary Cards (概览卡片)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │总资产     │  │总收益     │  │收益率     │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘       │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Holdings / Chart (持仓详情 / 收益曲线)             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Recent Transactions (最近交易)                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 关键页面设计

### 1. GP 端 - Dashboard（首页）

```
┌─ KPI 卡片行 ────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 管理资产规模   │  │ 基金数量      │  │ 投资者数量    │  │
│  │ ¥10.5亿      │  │ 15           │  │ 1,234        │  │
│  │ ↑ +5.2%      │  │ +2 (本月)    │  │ +45 (本月)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 待处理申购    │  │ 待处理赎回     │  │ 今日净值更新  │  │
│  │ 23 笔        │  │ 15 笔        │  │ 12/15        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─ 图表区 ────────────────────────────────────────────────┐
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │  管理规模趋势 (折线图)   │  │  基金类型分布 (饼图)  │  │
│  │                        │  │                      │  │
│  │  [折线图]              │  │  [饼图]              │  │
│  │                        │  │                      │  │
│  └────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌─ 最近交易 ──────────────────────────────────────────────┐
│  订单号         投资者    基金      类型    金额       状态  │
│  SUB202410270001  张三   XX基金   申购   ¥100,000  待确认│
│  RED202410270002  李四   YY基金   赎回   ¥50,000   已确认│
│  ...                                                   │
│  [查看全部 →]                                          │
└─────────────────────────────────────────────────────────┘
```

### 2. GP 端 - 基金列表

```
┌─ 页面头部 ──────────────────────────────────────────────┐
│  基金管理                                 [+ 新建基金]    │
└─────────────────────────────────────────────────────────┘

┌─ 筛选栏 ────────────────────────────────────────────────┐
│  [搜索框: 基金名称/代码]  [类型筛选 ▼]  [状态筛选 ▼]     │
└─────────────────────────────────────────────────────────┘

┌─ 基金卡片列表 ──────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────┐  │
│  │  XX股票型基金                         [编辑] [更多]│  │
│  │  代码: 001234    │    类型: 股票型    │  状态: 运行中│  │
│  │  ─────────────────────────────────────────────────│  │
│  │  单位净值: ¥1.2345 (↑ +2.15%)    规模: ¥5.2亿    │  │
│  │  成立日期: 2020-01-01             累计收益: +45.6%│  │
│  │  ─────────────────────────────────────────────────│  │
│  │  [查看详情]  [净值管理]  [投资者管理]  [报表]     │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  YY债券型基金                         [编辑] [更多]│  │
│  │  ...                                              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  [1] [2] [3] ... [10]  共 150 条                        │
└─────────────────────────────────────────────────────────┘
```

### 3. LP 端 - 我的持仓

```
┌─ 资产概览 ──────────────────────────────────────────────┐
│  总资产                  总收益                收益率     │
│  ¥ 1,234,567.89        ¥ +234,567.89        +23.45%   │
│  ───────────────────────────────────────────────────── │
│  [收益曲线图]                                           │
│  [折线图显示近期收益变化]                               │
└─────────────────────────────────────────────────────────┘

┌─ 资产配置 ──────────────────────────────────────────────┐
│  ┌────────────────┐  ┌────────────────────────────────┐│
│  │  [饼图]        │  │  股票型基金  ¥500,000  40.5%   ││
│  │                │  │  债券型基金  ¥400,000  32.4%   ││
│  │  资产类型分布   │  │  混合型基金  ¥300,000  24.3%   ││
│  │                │  │  货币基金    ¥34,567   2.8%    ││
│  └────────────────┘  └────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘

┌─ 持仓明细 ──────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────┐  │
│  │  XX股票型基金                       [申购] [赎回]  │  │
│  │  ─────────────────────────────────────────────────│  │
│  │  持有份额: 123,456.78 份                          │  │
│  │  单位净值: ¥1.2345      市值: ¥152,415.14        │  │
│  │  持仓成本: ¥1.0000      收益: ¥+28,953.36 (+23.4%)│  │
│  │  ─────────────────────────────────────────────────│  │
│  │  [查看详情] [交易记录] [下载报表]                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  YY债券型基金                       [申购] [赎回]  │  │
│  │  ...                                              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 4. 申购流程页面

```
┌─ 申购基金 ──────────────────────────────────────────────┐
│  步骤: ● 1. 选择基金  ○ 2. 填写信息  ○ 3. 确认提交      │
└─────────────────────────────────────────────────────────┘

┌─ 第 1 步: 选择基金 ─────────────────────────────────────┐
│  [搜索框]                              [类型筛选 ▼]      │
│                                                         │
│  ┌────────────────────────────────────┐                │
│  │ ◉ XX股票型基金                     │  [选择]         │
│  │   单位净值: ¥1.2345  (↑ +2.15%)   │                │
│  │   申购费率: 1.5%  最低金额: ¥1,000 │                │
│  └────────────────────────────────────┘                │
│                                                         │
│  ┌────────────────────────────────────┐                │
│  │ ○ YY债券型基金                     │  [选择]         │
│  │   ...                              │                │
│  └────────────────────────────────────┘                │
│                                                         │
│                                       [下一步 →]        │
└─────────────────────────────────────────────────────────┘

┌─ 第 2 步: 填写信息 ─────────────────────────────────────┐
│  基金信息:  XX股票型基金 (001234)                       │
│  单位净值:  ¥1.2345                                     │
│  ───────────────────────────────────────────────────── │
│                                                         │
│  申购金额 *                                             │
│  ┌─────────────────────────┐  元                       │
│  │  100000                 │                           │
│  └─────────────────────────┘                           │
│  最低申购金额: ¥1,000                                   │
│                                                         │
│  费用明细:                                              │
│  申购金额:      ¥100,000.00                            │
│  申购费用:      ¥  1,500.00 (1.5%)                     │
│  ───────────────────────────────────                   │
│  净申购金额:    ¥ 98,500.00                            │
│  预计确认份额:   79,838.08 份 (按最新净值估算)         │
│                                                         │
│  支付方式                                               │
│  ◉ 账户余额 (可用: ¥500,000)                           │
│  ○ 银行卡支付                                           │
│                                                         │
│  [← 上一步]                           [下一步 →]        │
└─────────────────────────────────────────────────────────┘

┌─ 第 3 步: 确认提交 ─────────────────────────────────────┐
│  请确认以下信息:                                        │
│                                                         │
│  基金名称:      XX股票型基金 (001234)                   │
│  申购金额:      ¥100,000.00                            │
│  申购费用:      ¥  1,500.00                            │
│  净申购金额:    ¥ 98,500.00                            │
│  预计份额:       79,838.08 份                          │
│  支付方式:      账户余额                                │
│                                                         │
│  重要提示:                                              │
│  1. 申购申请提交后不可撤销                              │
│  2. 份额确认以 T 日净值为准 (T 为申请日)               │
│  3. 预计 T+1 日确认份额                                │
│                                                         │
│  ☐ 我已阅读并同意《基金申购协议》                       │
│                                                         │
│  [← 上一步]                           [确认提交]        │
└─────────────────────────────────────────────────────────┘
```

---

## 交互设计规范

### 1. 加载状态

```tsx
// 按钮加载
<Button loading>提交中...</Button>

// 页面加载（骨架屏）
<Skeleton active paragraph={{ rows: 4 }} />

// 表格加载
<Table loading={loading} ... />

// 全局加载
<Spin spinning={globalLoading}>
  <App />
</Spin>
```

### 2. 空状态

```tsx
// 无数据
<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  description="暂无交易记录"
>
  <Button type="primary" onClick={handleSubscribe}>
    立即申购
  </Button>
</Empty>

// 搜索无结果
<Empty
  description="未找到符合条件的基金"
>
  <Button onClick={handleClearFilters}>
    清空筛选条件
  </Button>
</Empty>
```

### 3. 错误处理

```tsx
// 表单验证错误
<Form.Item
  name="amount"
  rules={[
    { required: true, message: '请输入申购金额' },
    { type: 'number', min: 1000, message: '最低申购金额为 ¥1,000' }
  ]}
  validateStatus="error"
  help="申购金额不能低于 ¥1,000"
>
  <Input />
</Form.Item>

// 网络错误
<Result
  status="500"
  title="加载失败"
  subTitle="网络连接失败，请检查网络后重试"
  extra={<Button type="primary" onClick={handleRetry}>重新加载</Button>}
/>

// 权限错误
<Result
  status="403"
  title="访问受限"
  subTitle="您没有权限访问此页面"
  extra={<Button type="primary" onClick={handleGoBack}>返回</Button>}
/>
```

### 4. 成功反馈

```tsx
// 操作成功页面
<Result
  status="success"
  title="申购申请提交成功！"
  subTitle={`订单号: ${orderNumber}，预计 T+1 日确认份额`}
  extra={[
    <Button type="primary" onClick={handleGoHoldings}>
      查看我的持仓
    </Button>,
    <Button onClick={handleContinue}>
      继续申购
    </Button>
  ]}
/>
```

---

## 响应式设计

### 断点设置

```css
/* 移动设备 */
@media (max-width: 640px) {
  /* 小屏幕样式 */
}

/* 平板设备 */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 中等屏幕样式 */
}

/* 桌面设备 */
@media (min-width: 1025px) {
  /* 大屏幕样式 */
}

/* 超大屏幕 */
@media (min-width: 1920px) {
  /* 超大屏幕样式 */
}
```

### 移动端适配

```tsx
// 移动端布局调整
const isMobile = useMediaQuery({ maxWidth: 640 });

return (
  <Layout>
    {!isMobile && <Sidebar />}
    <Content>
      {/* 内容 */}
    </Content>
    {isMobile && <MobileNavigation />}
  </Layout>
);

// 移动端表格改为卡片
{isMobile ? (
  <TransactionCardList data={transactions} />
) : (
  <TransactionTable data={transactions} />
)}
```

---

## 数据格式化规范

### 1. 数字格式化

```typescript
// 金额格式化（千分位 + 小数）
formatAmount(123456.789)     // "¥123,456.79"
formatAmount(123456.789, 4)  // "¥123,456.7890"

// 百分比格式化
formatPercent(0.2345)        // "+23.45%"
formatPercent(-0.0156)       // "-1.56%"
formatPercent(0)             // "0.00%"

// 份额格式化
formatShares(123456.789)     // "123,456.79 份"

// 大数字缩写
formatLargeNumber(12345678)  // "1,234.57 万"
formatLargeNumber(123456789) // "1.23 亿"
```

### 2. 日期时间格式化

```typescript
// 日期
formatDate('2024-10-27')               // "2024-10-27"
formatDate('2024-10-27', 'YYYY年MM月DD日') // "2024年10月27日"

// 日期时间
formatDateTime('2024-10-27 14:30:00')  // "2024-10-27 14:30"

// 相对时间
formatRelativeTime('2024-10-27 14:00') // "1 小时前"
formatRelativeTime('2024-10-26')       // "昨天"
formatRelativeTime('2024-10-01')       // "26 天前"
```

### 3. 状态文本映射

```typescript
const statusMap = {
  PENDING: { text: '待处理', color: 'warning' },
  CONFIRMED: { text: '已确认', color: 'success' },
  REJECTED: { text: '已拒绝', color: 'error' },
  CANCELLED: { text: '已取消', color: 'default' }
};

// 使用
<Badge status={statusMap[status].color} text={statusMap[status].text} />
```

---

## 可访问性（A11y）

### 1. 键盘导航

- 所有交互元素可通过 Tab 键访问
- 模态框自动聚焦到第一个输入框
- Esc 键关闭模态框和下拉菜单

### 2. 屏幕阅读器支持

```tsx
// ARIA 标签
<button aria-label="关闭">
  <CloseIcon />
</button>

// 角色定义
<div role="alert" aria-live="polite">
  操作成功
</div>

// 描述性文本
<img src="logo.png" alt="天汇基金 Logo" />
```

### 3. 颜色对比度

- 正文文字对比度至少 4.5:1
- 大号文字对比度至少 3:1
- 不仅依赖颜色传达信息（使用图标 + 文字）

---

## 性能优化

### 1. 图片优化

- 使用 WebP 格式
- 懒加载非首屏图片
- 提供多尺寸响应式图片

### 2. 代码分割

```tsx
// 路由级别代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Funds = lazy(() => import('./pages/Funds'));

// 组件级别懒加载
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

### 3. 列表虚拟化

```tsx
// 大列表使用虚拟滚动
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
>
  {Row}
</FixedSizeList>
```

---

**文档版本**: v1.0
**最后更新**: 2025-10-27
