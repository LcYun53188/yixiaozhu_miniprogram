const express = require("express");
const aiService = require("../services/aiService");
const matchService = require("../services/matchService");
const { authRequired } = require("../middlewares/auth");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.post("/classify", authRequired, (req, res) => {
  if (!req.body.text) return fail(res, 400, "text 不能为空");
  ok(res, { taskType: "classify", category: aiService.classify(req.body.text) });
});

router.post("/tags", authRequired, (req, res) => {
  if (!req.body.text) return fail(res, 400, "text 不能为空");
  ok(res, { taskType: "tags", tags: aiService.extractTags(req.body.text) });
});

router.post("/polish", authRequired, (req, res) => {
  if (!req.body.text) return fail(res, 400, "text 不能为空");
  ok(res, { taskType: "polish", polishedText: aiService.polish(req.body.text) });
});

router.post("/moderation", authRequired, (req, res) => {
  if (!req.body.text) return fail(res, 400, "text 不能为空");
  ok(res, { taskType: "moderation", ...aiService.moderate(req.body.text) });
});

router.post("/image-assist", authRequired, (req, res) => {
  ok(res, {
    taskType: "image_assist",
    category: "闲置物资",
    tags: ["图片待接入", "物资识别"],
    suggestion: "当前为比赛演示兜底结果，后续可接入视觉模型或云开发图片识别。"
  });
});

router.post("/match", authRequired, (req, res) => {
  const { targetType, targetId } = req.body;
  if (!["resource", "need"].includes(targetType) || !targetId) {
    return fail(res, 400, "targetType 和 targetId 参数不合法");
  }
  ok(res, matchService.generateForTarget(targetType, targetId));
});

module.exports = router;
