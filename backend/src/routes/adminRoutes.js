const express = require("express");
const store = require("../data/store");
const matchService = require("../services/matchService");
const { authRequired, adminRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.use(authRequired, adminRequired);

function findTarget(targetType, targetId) {
  if (targetType === "resource") {
    return store.resources.find((item) => item.id === Number(targetId) && item.deletedFlag === 0);
  }
  if (targetType === "need") {
    return store.needs.find((item) => item.id === Number(targetId) && item.deletedFlag === 0);
  }
  return null;
}

function addMessage(userId, message) {
  const record = {
    id: nextId(),
    userId,
    messageType: message.messageType,
    title: message.title,
    content: message.content,
    relatedType: message.relatedType,
    relatedId: message.relatedId,
    isRead: 0,
    createdAt: new Date().toISOString()
  };
  store.messages.push(record);
  return record;
}

router.get("/review/list", (req, res) => {
  const resources = store.resources
    .filter((item) => item.reviewStatus === "pending" && item.deletedFlag === 0)
    .map((item) => ({ ...item, targetType: "resource" }));
  const needs = store.needs
    .filter((item) => item.reviewStatus === "pending" && item.deletedFlag === 0)
    .map((item) => ({ ...item, targetType: "need" }));
  ok(res, [...resources, ...needs].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
});

router.post("/review/pass", (req, res) => {
  const { targetType, targetId } = req.body;
  const target = findTarget(targetType, targetId);
  if (!target) return fail(res, 404, "审核对象不存在");

  const now = new Date().toISOString();
  target.reviewStatus = "passed";
  target.publishedAt = now;
  target.updatedAt = now;

  const review = {
    id: nextId(),
    targetType,
    targetId: target.id,
    reviewStatus: "passed",
    reviewReason: req.body.reviewReason || "审核通过",
    reviewerId: req.user.id,
    createdAt: now
  };
  store.reviews.push(review);

  const matches = matchService.generateForTarget(targetType, target.id);
  addMessage(target.userId, {
    messageType: "review",
    title: "发布内容已通过审核",
    content: `你的“${target.title}”已通过审核并进入匹配流程。`,
    relatedType: targetType,
    relatedId: target.id
  });

  if (matches.length > 0) {
    addMessage(target.userId, {
      messageType: "match",
      title: "系统已生成匹配推荐",
      content: `系统为“${target.title}”推荐了 ${matches.length} 个潜在对接对象。`,
      relatedType: targetType,
      relatedId: target.id
    });
  }

  ok(res, { review, matches }, "审核通过");
});

router.post("/review/reject", (req, res) => {
  const { targetType, targetId, reviewReason = "内容不符合发布要求" } = req.body;
  const target = findTarget(targetType, targetId);
  if (!target) return fail(res, 404, "审核对象不存在");

  const now = new Date().toISOString();
  target.reviewStatus = "rejected";
  target.updatedAt = now;

  const review = {
    id: nextId(),
    targetType,
    targetId: target.id,
    reviewStatus: "rejected",
    reviewReason,
    reviewerId: req.user.id,
    createdAt: now
  };
  store.reviews.push(review);

  addMessage(target.userId, {
    messageType: "review",
    title: "发布内容审核未通过",
    content: `你的“${target.title}”审核未通过，原因：${reviewReason}`,
    relatedType: targetType,
    relatedId: target.id
  });

  ok(res, review, "审核驳回");
});

router.get("/dashboard/summary", (req, res) => {
  ok(res, {
    userCount: store.users.length,
    resourceCount: store.resources.filter((item) => item.deletedFlag === 0).length,
    needCount: store.needs.filter((item) => item.deletedFlag === 0).length,
    pendingReviewCount:
      store.resources.filter((item) => item.reviewStatus === "pending" && item.deletedFlag === 0).length +
      store.needs.filter((item) => item.reviewStatus === "pending" && item.deletedFlag === 0).length,
    matchCount: store.matches.length,
    completedCount: store.matches.filter((item) => item.status === "completed").length
  });
});

router.get("/user/list", (req, res) => {
  ok(res, store.users);
});

router.put("/user/role/:id", (req, res) => {
  if (!["user", "admin", "super_admin"].includes(req.body.role)) {
    return fail(res, 400, "角色参数不合法");
  }
  const user = store.users.find((item) => item.id === Number(req.params.id));
  if (!user) return fail(res, 404, "用户不存在");
  user.role = req.body.role;
  user.updatedAt = new Date().toISOString();
  ok(res, user, "用户角色已更新");
});

module.exports = router;
