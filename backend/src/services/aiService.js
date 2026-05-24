const categoryKeywords = {
  "旧书教材": ["书", "教材", "资料", "高数", "英语", "四级", "考研", "复习"],
  "闲置物资": ["衣服", "衣物", "台灯", "文具", "水杯", "小家电", "闲置"],
  "失物招领": ["丢失", "拾到", "失物", "招领", "钥匙", "校园卡", "水杯"],
  "爱心帮扶": ["求助", "帮扶", "急需", "临时", "困难"],
  "公益活动": ["活动", "志愿", "报名", "公益", "签到"]
};

const riskWords = ["广告", "兼职", "刷单", "贷款", "博彩", "加群赚钱"];

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
  moderate,
  scoreMatch
};
