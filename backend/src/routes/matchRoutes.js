const express = require("express");
const store = require("../data/store");
const matchService = require("../services/matchService");
const { authRequired } = require("../middlewares/auth");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.get("/list", authRequired, (req, res) => {
  ok(res, matchService.listWithDetail(req.query));
});

router.put("/status/:id", authRequired, (req, res) => {
  const record = store.matches.find((item) => item.id === Number(req.params.id));
  if (!record) return fail(res, 404, "匹配记录不存在");
  if (!["recommended", "contacted", "completed", "invalid"].includes(req.body.status)) {
    return fail(res, 400, "匹配状态不合法");
  }
  const resource = store.resources.find((item) => item.id === record.resourceId);
  const need = store.needs.find((item) => item.id === record.needId);
  const isParticipant = [resource && resource.userId, need && need.userId].includes(req.user.id);
  if (!isParticipant && !["admin", "super_admin"].includes(req.user.role)) {
    return fail(res, 403, "只有匹配双方或管理员可以更新状态");
  }
  record.status = req.body.status;
  record.updatedAt = new Date().toISOString();
  ok(res, record, "匹配状态已更新");
});

router.get("/my-list", authRequired, (req, res) => {
  const resourceIds = store.resources.filter((item) => item.userId === req.user.id).map((item) => item.id);
  const needIds = store.needs.filter((item) => item.userId === req.user.id).map((item) => item.id);
  ok(res, matchService.listWithDetail().filter((item) => resourceIds.includes(item.resourceId) || needIds.includes(item.needId)));
});

module.exports = router;
