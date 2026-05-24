const express = require("express");
const store = require("../data/store");
const { authRequired } = require("../middlewares/auth");
const { nextId } = require("../utils/id");
const { ok, fail } = require("../utils/response");
const creditService = require("../services/creditService");

const router = express.Router();

function getMatchParticipants(match) {
  const resource = store.resources.find((item) => item.id === match.resourceId);
  const need = store.needs.find((item) => item.id === match.needId);
  if (!resource || !need) return null;

  return {
    resource,
    need,
    resourceUserId: resource.userId,
    needUserId: need.userId
  };
}

router.post("/create", authRequired, (req, res) => {
  const { matchId, rating, content = "", tags = [] } = req.body;
  const score = Number(rating);

  if (!matchId) return fail(res, 400, "matchId 不能为空");
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return fail(res, 400, "评分必须是 1 到 5 的整数");
  }

  const match = store.matches.find((item) => item.id === Number(matchId));
  if (!match) return fail(res, 404, "匹配记录不存在");

  const participants = getMatchParticipants(match);
  if (!participants) return fail(res, 404, "匹配双方信息不完整");

  const fromUserId = req.user.id;
  let toUserId = null;
  if (fromUserId === participants.resourceUserId) {
    toUserId = participants.needUserId;
  } else if (fromUserId === participants.needUserId) {
    toUserId = participants.resourceUserId;
  } else {
    return fail(res, 403, "只有匹配双方可以评价");
  }

  if (toUserId === fromUserId) {
    return fail(res, 400, "当前演示数据的资源方和需求方相同，无法进行双方互评");
  }

  const duplicated = store.feedbacks.find(
    (item) => item.matchId === Number(matchId) && item.fromUserId === fromUserId
  );
  if (duplicated) return fail(res, 409, "你已经评价过该匹配");

  const now = new Date().toISOString();
  const creditResult = creditService.applyCredit(toUserId, score);
  const feedback = {
    id: nextId(),
    matchId: Number(matchId),
    fromUserId,
    toUserId,
    rating: score,
    content,
    tags,
    creditDelta: creditResult ? creditResult.delta : 0,
    createdAt: now
  };

  store.feedbacks.push(feedback);
  match.status = "completed";
  match.updatedAt = now;

  store.messages.push({
    id: nextId(),
    userId: toUserId,
    messageType: "feedback",
    title: "你收到一条对接评价",
    content: `${req.user.nickname} 给你 ${score} 星评价，信誉分变化 ${feedback.creditDelta > 0 ? "+" : ""}${feedback.creditDelta}`,
    relatedType: "match",
    relatedId: match.id,
    isRead: 0,
    createdAt: now
  });

  ok(res, {
    feedback,
    credit: creditResult
  }, "评价已提交");
});

router.get("/my-list", authRequired, (req, res) => {
  const rows = store.feedbacks
    .filter((item) => item.fromUserId === req.user.id || item.toUserId === req.user.id)
    .map((item) => ({
      ...item,
      fromUser: store.users.find((user) => user.id === item.fromUserId),
      toUser: store.users.find((user) => user.id === item.toUserId)
    }))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  ok(res, rows);
});

router.get("/credit/:userId", authRequired, (req, res) => {
  const summary = creditService.getCreditSummary(req.params.userId);
  if (!summary) return fail(res, 404, "用户不存在");
  ok(res, summary);
});

module.exports = router;
