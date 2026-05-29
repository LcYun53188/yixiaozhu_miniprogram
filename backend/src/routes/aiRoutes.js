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
    success: true,
    ...aiService.assistByImage(req.body),
    suggestion: "当前为演示兜底识别结果，发布前可手动删改标题、标签和描述。"
  });
});

router.post("/isbn-assist", authRequired, (req, res) => {
  const result = aiService.assistByIsbn(req.body.isbn || req.body.code);
  if (!result.success) return fail(res, 400, result.message);
  ok(res, {
    taskType: "isbn_assist",
    ...result
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
