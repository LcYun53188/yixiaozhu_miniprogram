const reviewStatusMap = {
  pending: "待审核",
  passed: "审核通过",
  rejected: "审核驳回"
};

const flowStatusMap = {
  pending_matching: "待匹配",
  matching: "匹配中",
  in_progress: "对接中",
  completed: "已完成"
};

const matchStatusMap = {
  recommended: "系统推荐",
  contacted: "已联系",
  completed: "已完成",
  invalid: "已失效"
};

const urgencyLevelMap = {
  low: "低",
  medium: "中",
  high: "高"
};

const roleMap = {
  user: "普通用户",
  admin: "管理员",
  super_admin: "超级管理员"
};

const targetTypeMap = {
  resource: "资源",
  need: "需求",
  admin_apply: "管理员申请"
};

const riskLevelMap = {
  low: "低风险",
  medium: "中风险",
  high: "高风险"
};

function textOf(map, value) {
  return map[value] || value || "未知";
}

function decorateItem(item) {
  if (!item) return item;
  return {
    ...item,
    reviewStatusText: textOf(reviewStatusMap, item.reviewStatus),
    flowStatusText: textOf(flowStatusMap, item.flowStatus),
    matchStatusText: textOf(matchStatusMap, item.status),
    urgencyLevelText: textOf(urgencyLevelMap, item.urgencyLevel),
    roleText: textOf(roleMap, item.role),
    targetTypeText: textOf(targetTypeMap, item.targetType),
    aiRiskLevelText: textOf(riskLevelMap, item.aiRiskLevel)
  };
}

function decorateList(list) {
  return (list || []).map(decorateItem);
}

module.exports = {
  decorateItem,
  decorateList,
  textOf,
  reviewStatusMap,
  flowStatusMap,
  matchStatusMap,
  urgencyLevelMap,
  roleMap,
  targetTypeMap,
  riskLevelMap
};
