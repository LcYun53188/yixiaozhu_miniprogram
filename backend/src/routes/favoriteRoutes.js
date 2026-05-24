const express = require("express");
const store = require("../data/store");
const { authRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.post("/create", authRequired, (req, res) => {
  const { targetType, targetId } = req.body;
  if (!["resource", "need"].includes(targetType) || !targetId) {
    return fail(res, 400, "收藏对象参数不合法");
  }

  const exists = store.favorites.find(
    (item) => item.userId === req.user.id && item.targetType === targetType && item.targetId === Number(targetId)
  );
  if (exists) return ok(res, exists, "已收藏");

  const record = {
    id: nextId(),
    userId: req.user.id,
    targetType,
    targetId: Number(targetId),
    createdAt: new Date().toISOString()
  };
  store.favorites.push(record);
  ok(res, record, "收藏成功");
});

router.delete("/delete/:id", authRequired, (req, res) => {
  const index = store.favorites.findIndex((item) => item.id === Number(req.params.id) && item.userId === req.user.id);
  if (index < 0) return fail(res, 404, "收藏记录不存在");
  const [removed] = store.favorites.splice(index, 1);
  ok(res, removed, "已取消收藏");
});

router.get("/my-list", authRequired, (req, res) => {
  const rows = store.favorites
    .filter((item) => item.userId === req.user.id)
    .map((item) => ({
      ...item,
      target:
        item.targetType === "resource"
          ? store.resources.find((resource) => resource.id === item.targetId)
          : store.needs.find((need) => need.id === item.targetId)
    }));
  ok(res, rows);
});

module.exports = router;
