const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    user: {},
    adminInviteCode: "",
    identityForm: {
      studentNo: "",
      realName: "",
      college: ""
    }
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    api.getProfile().then((user) => {
      this.setData({
        user: statusText.decorateItem(user),
        identityForm: {
          studentNo: user.studentNo || "",
          realName: user.realName || "",
          college: user.college || ""
        }
      });
    });
  },

  onIdentityInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`identityForm.${field}`]: event.detail.value });
  },

  verifyIdentity() {
    api.verifyIdentity(this.data.identityForm).then((user) => {
      const app = getApp();
      app.globalData.user = user;
      wx.setStorageSync("user", user);
      this.setData({ user: statusText.decorateItem(user) });
      wx.showToast({ title: "验证成功" });
    });
  },

  onAdminInviteInput(event) {
    this.setData({ adminInviteCode: event.detail.value });
  },

  redeemAdminInvite() {
    const code = this.data.adminInviteCode.trim();
    if (!code) {
      wx.showToast({ title: "请输入邀请码", icon: "none" });
      return;
    }

    api.redeemAdminInvite(code).then((data) => {
      const app = getApp();
      app.globalData.user = data.user;
      wx.setStorageSync("user", data.user);
      this.setData({
        user: statusText.decorateItem(data.user),
        adminInviteCode: ""
      });
      wx.showToast({ title: "已成为管理员" });
    });
  }
});
