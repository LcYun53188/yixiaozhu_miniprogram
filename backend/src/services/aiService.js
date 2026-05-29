const categoryKeywords = {
  "旧书教材": ["书", "教材", "资料", "高数", "英语", "四级", "考研", "复习"],
  "闲置物资": ["衣服", "衣物", "台灯", "文具", "水杯", "小家电", "闲置"],
  "失物招领": ["丢失", "拾到", "失物", "招领", "钥匙", "校园卡", "水杯"],
  "爱心帮扶": ["求助", "帮扶", "急需", "临时", "困难"],
  "公益活动": ["活动", "志愿", "报名", "公益", "签到"]
};

const riskWords = ["广告", "兼职", "刷单", "贷款", "博彩", "加群赚钱"];

const demoBooks = {
  "9787040396638": {
    title: "高等数学教材转赠",
    category: "旧书教材",
    tags: ["教材", "高数", "大学数学", "本科", "ISBN"],
    description: "识别到 ISBN 9787040396638，疑似高等数学相关教材。请根据实际书名、版本和新旧程度手动确认后发布。"
  },
  "9787302336518": {
    title: "数据结构教材转赠",
    category: "旧书教材",
    tags: ["教材", "数据结构", "计算机", "编程", "ISBN"],
    description: "识别到 ISBN 9787302336518，疑似计算机类教材。请补充出版社、版本、新旧程度和交接地点。"
  },
  "9787115546081": {
    title: "计算机网络教材转赠",
    category: "旧书教材",
    tags: ["教材", "计算机网络", "计算机", "ISBN"],
    description: "识别到 ISBN 9787115546081，疑似计算机网络相关教材。请核对书名和版本后发布。"
  }
};

function normalizeText(text = "") {
  return String(text).trim();
}

function classify(text) {
  const content = normalizeText(text);
  let best = { category: "闲置物资", score: 0 };

  Object.entries(categoryKeywords).forEach(([category, words]) => {
    const score = words.reduce((sum, word) => sum + (content.includes(word) ? 1 : 0), 0);
    if (score > best.score) {
      best = { category, score };
    }
  });

  return best.category;
}

function extractTags(text) {
  const content = normalizeText(text);
  const words = new Set();

  Object.values(categoryKeywords).flat().forEach((word) => {
    if (content.includes(word)) words.add(word);
  });

  if (content.includes("九成新")) words.add("九成新");
  if (content.includes("大一")) words.add("大一");
  if (content.includes("期末")) words.add("期末");
  if (content.includes("本周")) words.add("本周内");

  return Array.from(words).slice(0, 8);
}

function polish(text) {
  const content = normalizeText(text);
  if (!content) return "";
  if (content.length >= 40) return content;
  return `${content}。信息真实有效，可在校内约定地点对接，欢迎有需要的同学联系。`;
}

function normalizeIsbn(isbn = "") {
  return String(isbn).replace(/[^0-9Xx]/g, "").toUpperCase();
}

function assistByIsbn(isbn) {
  const normalized = normalizeIsbn(isbn);
  if (!normalized || ![10, 13].includes(normalized.length)) {
    return {
      success: false,
      isbn: normalized,
      message: "未识别到有效 ISBN，请重新扫码或手动输入"
    };
  }

  const known = demoBooks[normalized];
  if (known) {
    return {
      success: true,
      isbn: normalized,
      source: "demo_library",
      ...known
    };
  }

  return {
    success: true,
    isbn: normalized,
    source: "rule_fallback",
    title: `ISBN ${normalized} 图书`,
    category: "旧书教材",
    tags: ["图书", "教材", "ISBN", normalized],
    description: `已识别 ISBN：${normalized}。请根据书籍封面核对书名、版本、新旧程度和适用课程后发布。`
  };
}

function assistByImage(payload = {}) {
  const hint = normalizeText(payload.hint || payload.fileName || payload.imageUrl || "");
  const lowerHint = hint.toLowerCase();

  if (hint.includes("书") || hint.includes("教材") || lowerHint.includes("book")) {
    return {
      category: "旧书教材",
      title: "图书教材转赠",
      tags: ["图书", "教材", "学习资料"],
      description: "图片疑似图书或教材。请补充书名、版本、新旧程度和适用课程，可在校内约定地点交接。"
    };
  }

  if (hint.includes("衣") || hint.includes("服") || lowerHint.includes("cloth")) {
    return {
      category: "闲置物资",
      title: "闲置衣物转赠",
      tags: ["衣物", "闲置物资", "生活用品"],
      description: "图片疑似衣物类物品。请补充尺码、季节、新旧程度和领取方式。"
    };
  }

  if (hint.includes("水杯") || hint.includes("杯") || lowerHint.includes("cup")) {
    return {
      category: "失物招领",
      title: "水杯失物招领",
      tags: ["水杯", "失物招领", "生活用品"],
      description: "图片疑似水杯。请补充拾取地点、时间、颜色特征和认领方式。"
    };
  }

  if (hint.includes("台灯") || hint.includes("灯") || lowerHint.includes("lamp")) {
    return {
      category: "闲置物资",
      title: "闲置台灯转赠",
      tags: ["台灯", "小家电", "闲置物资"],
      description: "图片疑似台灯或小家电。请补充功能是否正常、新旧程度和交接地点。"
    };
  }

  return {
    category: "闲置物资",
    title: "闲置物品发布",
    tags: ["物品识别", "闲置物资", "待确认"],
    description: "已根据图片生成初步物品信息。请手动确认物品名称、状态、新旧程度和交接方式后发布。"
  };
}

function moderate(text) {
  const content = normalizeText(text);
  const hit = riskWords.find((word) => content.includes(word));
  if (hit) {
    return {
      riskLevel: "high",
      riskReason: `命中疑似风险词：${hit}`
    };
  }
  if (content.length < 8) {
    return {
      riskLevel: "medium",
      riskReason: "描述过短，建议补充物品状态、地点和用途"
    };
  }
  return {
    riskLevel: "low",
    riskReason: "未发现明显风险"
  };
}

function scoreMatch(resource, need) {
  let score = 0;
  const reasons = [];

  if (resource.category === need.category) {
    score += 40;
    reasons.push("分类一致");
  }

  const resourceTags = new Set(resource.tags || []);
  const sameTags = (need.tags || []).filter((tag) => resourceTags.has(tag));
  if (sameTags.length > 0) {
    score += Math.min(35, sameTags.length * 12);
    reasons.push(`标签重合：${sameTags.join("、")}`);
  }

  const titleText = `${resource.title}${resource.description}`;
  const needText = `${need.title}${need.description}`;
  const keywords = extractTags(`${titleText}${needText}`);
  const keywordHit = keywords.filter((word) => titleText.includes(word) && needText.includes(word));
  if (keywordHit.length > 0) {
    score += Math.min(15, keywordHit.length * 5);
    reasons.push(`关键词相关：${keywordHit.join("、")}`);
  }

  if (need.urgencyLevel === "high") {
    score += 10;
    reasons.push("需求较紧急");
  }

  return {
    score: Math.min(score, 100),
    reason: reasons.length ? reasons.join("；") : "内容存在一定相关性"
  };
}

module.exports = {
  classify,
  extractTags,
  polish,
  assistByIsbn,
  assistByImage,
  moderate,
  scoreMatch
};
