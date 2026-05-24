const express = require("express");
const store = require("../data/store");
const { authRequired } = require("../middlewares/auth");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.get("/list", authRequired, (req, res) => {
  const rows = store.messages
    .filter((item) => item.userId === req.user.id)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  ok(res, rows);
});

router.put("/read/:id", authRequired, (req, res) => {
  const message = store.messages.find((item) => item.id === Number(req.params.id) && item.userId === req.user.id);
  if (!message) return fail(res, 404, "消息不存在");
  message.isRead = 1;
  ok(res, message, "消息已读");
});

module.exports = router;
