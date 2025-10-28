// 格式化金额
export const formatAmount = (amount: number, precision: number = 2): string => {
  return `¥${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })}`;
};

// 格式化百分比
export const formatPercent = (value: number, precision: number = 2): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(precision)}%`;
};

// 格式化份额
export const formatShares = (shares: number, precision: number = 2): string => {
  return `${shares.toLocaleString('zh-CN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })} 份`;
};

// 格式化日期
export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN');
};

// 格式化日期时间
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('zh-CN');
};

// 获取状态文本
export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: '待处理',
    CONFIRMED: '已确认',
    REJECTED: '已拒绝',
    CANCELLED: '已取消',
    ACTIVE: '运行中',
    SUSPENDED: '暂停',
    CLOSED: '已关闭',
  };
  return statusMap[status] || status;
};

// 获取基金类型文本
export const getFundTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    EQUITY: '股票型',
    BOND: '债券型',
    HYBRID: '混合型',
    MONEY_MARKET: '货币型',
  };
  return typeMap[type] || type;
};
