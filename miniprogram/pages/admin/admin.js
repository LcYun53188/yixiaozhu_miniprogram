const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    summary: {},
    reviews: [],
    users: [],
    invites: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    Promise.all([
      api.getAdminSummary(),
      api.getReviewList(),
      api.getAdminUsers(),
      api.getAdminInvites()
    ]).then(([summary, reviews, users, invites]) => {
      this.setData({
        summary,
        reviews: statusText.decorateList(reviews),
        users: statusText.decorateList(users),
        invites
      });
    });
  },

  passReview(event) {
    const { type, id } = event.currentTarget.dataset;
    api.passReview({ targetType: type, targetId: id }).then(() => {
      wx.showToast({ title: "已通过" });
      this.loadData();
    });
  },

  rejectReview(event) {
    const { type, id } = event.currentTarget.dataset;
    api.rejectReview({
      targetType: type,
      targetId: id,
      reviewReason: "描述信息不完整，请补充后重新提交"
    }).then(() => {
      wx.showToast({ title: "已驳回" });
      this.loadData();
    });
  },

  createInvite() {
    api.createAdminInvite().then((invite) => {
      wx.showModal({
        title: "邀请码已生成",
        content: invite.code,
        showCancel: false
      });
      this.loadData();
    });
  },

  disableInvite(event) {
    api.disableAdminInvite(event.currentTarget.dataset.code).then(() => {
      wx.showToast({ title: "已停用" });
      this.loadData();
    });
  },

  setAdmin(event) {
    api.updateUserRole(event.currentTarget.dataset.id, "admin").then(() => {
      wx.showToast({ title: "已设为管理员" });
      this.loadData();
    });
  },

  setUser(event) {
    api.updateUserRole(event.currentTarget.dataset.id, "user").then(() => {
      wx.showToast({ title: "已设为普通用户" });
      this.loadData();
    });
  }
});
