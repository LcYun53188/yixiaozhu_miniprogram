App({
  globalData: {
    // 如果微信开发者工具访问 localhost 偶发 timeout，可改为 http://127.0.0.1:3000/api。
    apiBaseUrl: "http://127.0.0.1:3000/api",
    token: "",
    user: null
  },

  onLaunch() {
    const token = wx.getStorageSync("token");
    const user = wx.getStorageSync("user");
    if (token) this.globalData.token = token;
    if (user) this.globalData.user = user;
  }
});
