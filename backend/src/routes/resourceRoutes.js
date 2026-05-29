const express = require("express");
const store = require("../data/store");
const aiService = require("../services/aiService");
const { authRequired, identityRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");

const router = express.Router();

function filterList(rows, query) {
  let result = rows.filter((item) => item.deletedFlag === 0);
  if (query.category) result = result.filter((item) => item.category === query.category);
  if (query.reviewStatus) result = result.filter((item) => item.reviewStatus === query.reviewStatus);
  if (query.flowStatus) result = result.filter((item) => item.flowStatus === query.flowStatus);
  if (query.keyword) {
    const keyword = String(query.keyword);
    result = result.filter((item) =>
      `${item.title}${item.description}${(item.tags || []).join("")}`.includes(keyword)
    );
  }
  return result.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

router.post("/create", authRequired, identityRequired, (req, res) => {
  if (!req.body.title || !req.body.description) {
    return fail(res, 400, "标题和描述不能为空");
  }

  const text = `${req.body.title} ${req.body.description}`;
  const moderation = aiService.moderate(text);
  const now = new Date().toISOString();
  const resource = {
    id: nextId(),
    userId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    polishedText: req.body.polishedText || aiService.polish(req.body.description),
    category: req.body.category || aiService.classify(text),
    tags: req.body.tags && req.body.tags.length ? req.body.tags : aiService.extractTags(text),
    imageUrls: req.body.imageUrls || [],
    contactInfo: req.body.contactInfo || req.user.phone || "",
    locationText: req.body.locationText || "",
    reviewStatus: "pending",
    flowStatus: "pending_matching",
    aiRiskLevel: moderation.riskLevel,
    aiRiskReason: moderation.riskReason,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    deletedFlag: 0
  };
  store.resources.push(resource);
  ok(res, resource, "资源已提交审核");
});

router.put("/update/:id", authRequired, (req, res) => {
  const resource = store.resources.find((item) => item.id === Number(req.params.id));
  if (!resource || resource.deletedFlag) return fail(res, 404, "资源不存在");
  if (resource.userId !== req.user.id && !["admin", "super_admin"].includes(req.user.role)) {
    return fail(res, 403, "无权修改该资源");
  }

  ["title", "description", "polishedText", "category", "tags", "imageUrls", "contactInfo", "locationText", "flowStatus"].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      resource[field] = req.body[field];
    }
  });
  resource.updatedAt = new Date().toISOString();
  ok(res, resource, "资源已更新");
});

router.delete("/delete/:id", authRequired, (req, res) => {
  const resource = store.resources.find((item) => item.id === Number(req.params.id));
  if (!resource || resource.deletedFlag) return fail(res, 404, "资源不存在");
  if (resource.userId !== req.user.id && !["admin", "super_admin"].includes(req.user.role)) {
    return fail(res, 403, "无权删除该资源");
  }
  resource.deletedFlag = 1;
  resource.updatedAt = new Date().toISOString();
  ok(res, null, "资源已删除");
});

router.get("/list", (req, res) => {
  ok(res, filterList(store.resources, req.query));
});

router.get("/detail/:id", (req, res) => {
  const resource = store.resources.find((item) => item.id === Number(req.params.id) && item.deletedFlag === 0);
  if (!resource) return fail(res, 404, "资源不存在");
  const matches = store.matches
    .filter((item) => item.resourceId === resource.id)
    .map((item) => ({
      ...item,
      need: store.needs.find((need) => need.id === item.needId)
    }));
  ok(res, { ...resource, matches });
});

router.get("/my-list", authRequired, (req, res) => {
  ok(res, filterList(store.resources.filter((item) => item.userId === req.user.id), req.query));
});

module.exports = router;
