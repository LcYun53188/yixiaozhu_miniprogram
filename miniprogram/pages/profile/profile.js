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
    feedbacks: [],
    offlineAccounts: [
      { code: "demo-user", nickname: "张同学", roleText: "普通用户" },
      { code: "demo-need-user", nickname: "李同学", roleText: "需求方用户" },
      { code: "demo-admin", nickname: "管理员", roleText: "管理员" },
      { code: "demo-super-admin", nickname: "超级管理员", roleText: "超级管理员" }
    ]
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

  loginByWechat() {
    const app = getApp();

    const doLogin = (profile = {}) => {
      api.loginByWechatCode(profile).then(() => {
        const user = app.globalData.user || wx.getStorageSync("user");
        this.setData({ user: statusText.decorateItem(user) });
        wx.showToast({ title: "微信登录成功" });
        this.onShow();
      }).catch(() => {
        wx.showToast({ title: "微信登录失败", icon: "none" });
      });
    };

    if (!wx.getUserProfile) {
      doLogin();
      return;
    }

    wx.getUserProfile({
      desc: "用于完善益小助用户资料",
      success: (res) => {
        doLogin({
          nickname: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        });
      },
      fail: () => {
        doLogin();
      }
    });
  },

  loginOffline(event) {
    const app = getApp();
    const { code, nickname } = event.currentTarget.dataset;
    api.login({ code, nickname }).then((data) => {
      app.globalData.token = data.token;
      app.globalData.user = data.user;
      wx.setStorageSync("token", data.token);
      wx.setStorageSync("user", data.user);
      this.setData({ user: statusText.decorateItem(data.user) });
      wx.showToast({ title: "已切换账号" });
      this.onShow();
    });
  },

  goMessage() {
    wx.navigateTo({ url: "/pages/message/message" });
  },

  goMatch() {
    wx.navigateTo({ url: "/pages/match/match" });
  },

  goSettings() {
    wx.navigateTo({ url: "/pages/settings/settings" });
  },

  goAdmin() {
    if (!["admin", "super_admin"].includes(this.data.user.role)) {
      wx.showToast({ title: "请先登录管理员", icon: "none" });
      return;
    }
    wx.navigateTo({ url: "/pages/admin/admin" });
  }
});
