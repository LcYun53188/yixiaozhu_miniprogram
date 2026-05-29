const express = require("express");
const store = require("../data/store");
const { authRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");
const wechatService = require("../services/wechatService");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { code = "demo-user", nickname = "校园用户", avatarUrl = "" } = req.body;
  try {
    const loginCode = String(code);
    const session = loginCode.startsWith("demo")
      ? {
          openid: loginCode,
          sessionKey: "",
          unionid: "",
          mode: "demo"
        }
      : await wechatService.code2Session(loginCode);

    let user = store.users.find((item) => item.openid === session.openid);
    const now = new Date().toISOString();

    if (!user) {
      user = {
        id: nextId(),
        openid: session.openid,
        nickname,
        avatarUrl,
        phone: "",
        studentNo: "",
        realName: "",
        college: "",
        identityVerified: session.mode === "demo",
        verifiedAt: session.mode === "demo" ? now : null,
        role: "user",
        creditScore: 100,
        ratingCount: 0,
        status: "active",
        createdAt: now,
        updatedAt: now
      };
      store.users.push(user);
    } else {
      user.nickname = nickname || user.nickname;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      user.updatedAt = now;
    }

    ok(res, {
      token: `demo-token-${user.id}`,
      user,
      loginMode: session.mode,
      loginTip: session.reason || ""
    });
  } catch (err) {
    next(err);
  }
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

router.post("/identity/verify", authRequired, (req, res) => {
  const studentNo = String(req.body.studentNo || "").trim();
  const realName = String(req.body.realName || "").trim();
  const college = String(req.body.college || "").trim();

  if (!/^[0-9A-Za-z]{6,20}$/.test(studentNo)) {
    return fail(res, 400, "请输入 6 到 20 位学号");
  }
  if (!/^[\u4e00-\u9fa5A-Za-z·\s]{2,32}$/.test(realName)) {
    return fail(res, 400, "请输入真实姓名");
  }

  const duplicated = store.users.find(
    (item) => item.id !== req.user.id && item.studentNo === studentNo && item.identityVerified
  );
  if (duplicated) return fail(res, 409, "该学号已完成验证，请确认信息是否正确");

  const now = new Date().toISOString();
  req.user.studentNo = studentNo;
  req.user.realName = realName;
  req.user.college = college || req.user.college;
  req.user.identityVerified = true;
  req.user.verifiedAt = now;
  req.user.updatedAt = now;

  ok(res, req.user, "身份验证成功");
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

router.post("/admin-invite/redeem", authRequired, (req, res) => {
  if (!req.user.identityVerified) {
    return fail(res, 403, "请先完成学号姓名验证，再使用管理员邀请码");
  }
  const code = String(req.body.code || "").trim();
  if (!code) return fail(res, 400, "请输入管理员邀请码");

  const invite = store.adminInviteCodes.find((item) => item.code === code);
  if (!invite) return fail(res, 404, "管理员邀请码不存在");
  if (invite.disabled) return fail(res, 403, "该管理员邀请码已停用");
  if (invite.used) return fail(res, 409, "该管理员邀请码已被使用");

  const now = new Date().toISOString();
  invite.used = true;
  invite.usedBy = req.user.id;
  invite.usedAt = now;

  req.user.role = "admin";
  req.user.updatedAt = now;

  store.messages.push({
    id: nextId(),
    userId: req.user.id,
    messageType: "system",
    title: "管理员权限已开通",
    content: "你已通过一次性邀请码成为管理员，可进入后台管理页面处理审核任务。",
    relatedType: "user",
    relatedId: req.user.id,
    isRead: 0,
    createdAt: now
  });

  ok(res, {
    user: req.user,
    invite: {
      used: invite.used,
      usedAt: invite.usedAt
    }
  }, "管理员权限已开通");
});

module.exports = router;
