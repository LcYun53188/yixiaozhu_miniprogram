function ok(res, data = null, message = "success") {
  return res.json({ code: 200, message, data });
}

function fail(res, code = 400, message = "error", data = null) {
  return res.status(code >= 100 && code < 600 ? code : 400).json({
    code,
    message,
    data
  });
}

module.exports = { ok, fail };
