const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    summary: {},
    reviews: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    Promise.all([api.getAdminSummary(), api.getReviewList()]).then(([summary, reviews]) => {
      this.setData({
        summary,
        reviews: statusText.decorateList(reviews)
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
  }
});
