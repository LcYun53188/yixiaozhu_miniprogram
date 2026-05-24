const now = new Date().toISOString();

const store = {
  users: [
    {
      id: 1,
      openid: "demo-user",
      nickname: "张同学",
      avatarUrl: "",
      phone: "13800000000",
      studentNo: "20260001",
      realName: "张同学",
      college: "计算机学院",
      role: "user",
      creditScore: 100,
      ratingCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now
    },
    {
      id: 2,
      openid: "demo-admin",
      nickname: "管理员",
      avatarUrl: "",
      phone: "13900000000",
      studentNo: "",
      realName: "管理员",
      college: "校团委",
      role: "admin",
      creditScore: 100,
      ratingCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now
    },
    {
      id: 3,
      openid: "demo-need-user",
      nickname: "李同学",
      avatarUrl: "",
      phone: "13700000000",
      studentNo: "20260002",
      realName: "李同学",
      college: "数学学院",
      role: "user",
      creditScore: 100,
      ratingCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now
    }
  ],
  resources: [
    {
      id: 101,
      userId: 3,
      title: "高等数学教材转赠",
      description: "有几本高数教材，九成新，适合大一学生期末复习。",
      polishedText: "有几本九成新的高等数学教材，适合大一学生期末复习使用，可在校内约定地点自取。",
      category: "旧书教材",
      tags: ["教材", "高数", "大一", "九成新"],
      imageUrls: [],
      contactInfo: "微信：abc123",
      locationText: "图书馆门口",
      reviewStatus: "passed",
      flowStatus: "pending_matching",
      aiRiskLevel: "low",
      aiRiskReason: "未发现明显风险",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      deletedFlag: 0
    }
  ],
  needs: [
    {
      id: 201,
      userId: 1,
      title: "求高数复习资料",
      description: "准备期末考试，希望获取高等数学复习资料。",
      polishedText: "本人正在准备期末考试，希望获得高等数学复习资料或教材，校内可自取。",
      category: "旧书教材",
      tags: ["高数", "复习", "期末考试"],
      urgencyLevel: "high",
      contactInfo: "微信：stu001",
      reviewStatus: "passed",
      flowStatus: "pending_matching",
      aiRiskLevel: "low",
      aiRiskReason: "未发现明显风险",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      deletedFlag: 0
    }
  ],
  matches: [
    {
      id: 301,
      resourceId: 101,
      needId: 201,
      matchScore: 92,
      matchReason: "分类一致；标签重合：高数；关键词相关：高数；需求较紧急",
      status: "recommended",
      createdAt: now,
      updatedAt: now
    }
  ],
  reviews: [],
  messages: [],
  favorites: [],
  feedbacks: []
};

module.exports = store;
