const store = require("../data/store");

function calculateCreditDelta(rating) {
  const value = Number(rating);
  if (value >= 5) return 5;
  if (value === 4) return 3;
  if (value === 3) return 1;
  if (value === 2) return -3;
  return -6;
}

function applyCredit(userId, rating) {
  const user = store.users.find((item) => item.id === Number(userId));
  if (!user) return null;

  const delta = calculateCreditDelta(rating);
  const currentScore = Number(user.creditScore || 100);
  user.creditScore = Math.max(0, Math.min(150, currentScore + delta));
  user.ratingCount = Number(user.ratingCount || 0) + 1;
  user.updatedAt = new Date().toISOString();

  return {
    user,
    delta,
    creditScore: user.creditScore
  };
}

function getCreditSummary(userId) {
  const user = store.users.find((item) => item.id === Number(userId));
  if (!user) return null;

  const received = store.feedbacks.filter((item) => item.toUserId === user.id);
  const averageRating = received.length
    ? Number((received.reduce((sum, item) => sum + Number(item.rating), 0) / received.length).toFixed(1))
    : 0;

  return {
    userId: user.id,
    nickname: user.nickname,
    creditScore: Number(user.creditScore || 100),
    ratingCount: Number(user.ratingCount || 0),
    averageRating,
    receivedFeedbacks: received
  };
}

module.exports = {
  applyCredit,
  getCreditSummary
};
