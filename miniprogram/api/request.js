const app = getApp();

function loginByWechatCode(profile = {}) {
  return new Promise((resolve, reject) => {
    wx.login({
      success(loginResult) {
        if (!loginResult.code) {
          reject(new Error("微信登录未返回 code"));
          return;
        }

        wx.request({
          url: `${app.globalData.apiBaseUrl}/user/login`,
          method: "POST",
          timeout: 8000,
          data: {
            code: loginResult.code,
            nickname: profile.nickname || "微信用户",
            avatarUrl: profile.avatarUrl || ""
          },
          success(res) {
            const body = res.data || {};
            if (body.code !== 200) {
              reject(body);
              return;
            }
            app.globalData.token = body.data.token;
            app.globalData.user = body.data.user;
            wx.setStorageSync("token", body.data.token);
            wx.setStorageSync("user", body.data.user);
            resolve(body.data.token);
          },
          fail: reject
        });
      },
      fail: reject
    });
  });
}

function loginByDemoUser() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/user/login`,
      method: "POST",
      timeout: 8000,
      data: {
        code: "demo-user",
        nickname: "张同学"
      },
      success(res) {
        const body = res.data || {};
        if (body.code !== 200) {
          reject(body);
          return;
        }
        app.globalData.token = body.data.token;
        app.globalData.user = body.data.user;
        wx.setStorageSync("token", body.data.token);
        wx.setStorageSync("user", body.data.user);
        resolve(body.data.token);
      },
      fail: reject
    });
  });
}

function ensureToken() {
  const cachedToken = app.globalData.token || wx.getStorageSync("token");
  if (cachedToken) {
    app.globalData.token = cachedToken;
    return Promise.resolve(cachedToken);
  }

  return loginByWechatCode().catch(() => loginByDemoUser());
}

function request(options) {
  const tokenReady = options.url === "/user/login"
    ? Promise.resolve("")
    : ensureToken();

  return tokenReady.then((token) => new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBaseUrl}${options.url}`,
      method: options.method || "GET",
      data: options.data || {},
      timeout: options.timeout || 10000,
      header: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      success(res) {
        const body = res.data || {};
        if (body.code === 200) {
          resolve(body.data);
        } else {
          wx.showToast({ title: body.message || "请求失败", icon: "none" });
          reject(body);
        }
      },
      fail(err) {
        const reason = err && err.errMsg ? err.errMsg : "未知错误";
        wx.showToast({ title: `请求失败：${reason}`, icon: "none", duration: 2500 });
        reject(err);
      }
    });
  }));
}

module.exports = {
  request,
  loginByWechatCode,
  loginByDemoUser
};
