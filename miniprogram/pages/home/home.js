const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    categories: ["旧书教材", "闲置物资", "失物招领", "爱心帮扶", "公益活动", "AI推荐"],
    resources: [],
    needs: []
  },

  onLoad() {
    this.ensureLogin();
    this.loadData();
  },

  ensureLogin() {
    const app = getApp();
    if (app.globalData.token) return;
    api.login({ code: "demo-user", nickname: "张同学" }).then((data) => {
      app.globalData.token = data.token;
      app.globalData.user = data.user;
      wx.setStorageSync("token", data.token);
      wx.setStorageSync("user", data.user);
    });
  },

  loadData() {
    Promise.all([
      api.getResources({ reviewStatus: "passed" }),
      api.getNeeds({ reviewStatus: "passed" })
    ]).then(([resources, needs]) => {
      this.setData({
        resources: statusText.decorateList(resources).slice(0, 3),
        needs: statusText.decorateList(needs).slice(0, 3)
      });
    });
  },

  goCategory(event) {
    wx.setStorageSync("selectedCategory", event.currentTarget.dataset.category);
    wx.switchTab({ url: "/pages/category/category" });
  },

  goDetail(event) {
    const { id, type } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}&type=${type}` });
  }
});
