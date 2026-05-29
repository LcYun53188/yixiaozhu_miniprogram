async function code2Session(code) {
  const appid = process.env.WECHAT_APPID;
  const secret = process.env.WECHAT_SECRET;

  if (!appid || !secret) {
    return {
      openid: "demo-user",
      sessionKey: "",
      unionid: "",
      mode: "demo",
      reason: "未配置 WECHAT_APPID 或 WECHAT_SECRET，已回退演示登录"
    };
  }

  const url = new URL("https://api.weixin.qq.com/sns/jscode2session");
  url.searchParams.set("appid", appid);
  url.searchParams.set("secret", secret);
  url.searchParams.set("js_code", code);
  url.searchParams.set("grant_type", "authorization_code");

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.errcode) {
    const message = data.errmsg || `微信登录请求失败：${response.status}`;
    const error = new Error(message);
    error.wechatResponse = data;
    throw error;
  }

  return {
    openid: data.openid,
    sessionKey: data.session_key,
    unionid: data.unionid || "",
    mode: "wechat"
  };
}

module.exports = {
  code2Session
};
