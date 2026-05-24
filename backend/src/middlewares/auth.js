const store = require("../data/store");
const { fail } = require("../utils/response");

function getToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return req.headers["x-demo-token"] || "";
}

function authRequired(req, res, next) {
  const token = getToken(req);
  const userId = Number(String(token).replace("demo-token-", ""));
  const user = store.users.find((item) => item.id === userId && item.status === "active");

  if (!user) {
    return fail(res, 401, "请先登录");
  }

  req.user = user;
  next();
}

function adminRequired(req, res, next) {
  if (!req.user || !["admin", "super_admin"].includes(req.user.role)) {
    return fail(res, 403, "需要管理员权限");
  }
  next();
}

module.exports = { authRequired, adminRequired };
