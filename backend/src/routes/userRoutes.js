const express = require("express");
const store = require("../data/store");
const { authRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");

const router = express.Router();

router.post("/login", (req, res) => {
  const { code = "demo-user", nickname = "校园用户", avatarUrl = "" } = req.body;
  const openid = String(code).includes("admin") ? "demo-admin" : String(code);
  let user = store.users.find((item) => item.openid === openid);
  const now = new Date().toISOString();

  if (!user) {
    user = {
      id: nextId(),
      openid,
      nickname,
      avatarUrl,
      phone: "",
      studentNo: "",
      realName: "",
      college: "",
      role: "user",
      creditScore: 100,
      ratingCount: 0,
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    store.users.push(user);
  }

  ok(res, {
    token: `demo-token-${user.id}`,
    user
  });
});

router.get("/profile", authRequired, (req, res) => {
  ok(res, req.user);
});

router.put("/profile", authRequired, (req, res) => {
  const allowedFields = ["nickname", "avatarUrl", "phone", "studentNo", "realName", "college"];
  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      req.user[field] = req.body[field];
    }
  });
  req.user.updatedAt = new Date().toISOString();
  ok(res, req.user, "用户信息已更新");
});

router.post("/admin-apply", authRequired, (req, res) => {
  if (!req.body.applyReason) return fail(res, 400, "请填写申请原因");
  const now = new Date().toISOString();
  const record = {
    id: nextId(),
    userId: req.user.id,
    applyReason: req.body.applyReason,
    status: "pending",
    reviewerId: null,
    reviewReason: "",
    createdAt: now,
    updatedAt: now
  };
  store.adminApplies = store.adminApplies || [];
  store.adminApplies.push(record);
  ok(res, record, "管理员申请已提交");
});

module.exports = router;
