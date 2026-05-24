const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    user: {},
    summary: {
      resourceCount: 0,
      needCount: 0,
      matchCount: 0
    },
    feedbacks: []
  },

  onShow() {
    this.loadProfile();
    Promise.all([api.getResources({}), api.getNeeds({}), api.getMatches({}), api.getFeedbacks()]).then(([resources, needs, matches, feedbacks]) => {
      this.setData({
        summary: {
          resourceCount: resources.length,
          needCount: needs.length,
          matchCount: matches.length
        },
        feedbacks
      });
    });
  },

  loadProfile() {
    api.getProfile().then((user) => {
      this.setData({ user: statusText.decorateItem(user) });
    });
  },

  loginAsAdmin() {
    const app = getApp();
    api.login({ code: "demo-admin", nickname: "管理员" }).then((data) => {
      app.globalData.token = data.token;
      app.globalData.user = data.user;
      wx.setStorageSync("token", data.token);
      wx.setStorageSync("user", data.user);
      this.setData({ user: statusText.decorateItem(data.user) });
      wx.showToast({ title: "已切换管理员" });
    });
  },

  logoutAdmin() {
    const app = getApp();
    api.login({ code: "demo-user", nickname: "张同学" }).then((data) => {
      app.globalData.token = data.token;
      app.globalData.user = data.user;
      wx.setStorageSync("token", data.token);
      wx.setStorageSync("user", data.user);
      this.setData({ user: statusText.decorateItem(data.user) });
      wx.showToast({ title: "已切回普通用户" });
    });
  },

  goMessage() {
    wx.navigateTo({ url: "/pages/message/message" });
  },

  goMatch() {
    wx.navigateTo({ url: "/pages/match/match" });
  },

  goAdmin() {
    if (!["admin", "super_admin"].includes(this.data.user.role)) {
      wx.showToast({ title: "请先登录管理员", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/admin/admin" });
  }
});
