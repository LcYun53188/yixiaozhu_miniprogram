const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    categories: ["全部", "旧书教材", "闲置物资", "失物招领", "爱心帮扶", "公益活动"],
    category: "",
    keyword: "",
    resources: [],
    needs: []
  },

  onLoad(options) {
    this.setData({ category: options.category === "全部" ? "" : options.category || "" });
    this.loadData();
  },

  onShow() {
    const selectedCategory = wx.getStorageSync("selectedCategory");
    if (selectedCategory) {
      wx.removeStorageSync("selectedCategory");
      this.setData({ category: selectedCategory === "全部" ? "" : selectedCategory }, this.loadData);
    }
  },

  onKeyword(event) {
    this.setData({ keyword: event.detail.value });
  },

  selectCategory(event) {
    const category = event.currentTarget.dataset.category;
    this.setData({ category: category === "全部" ? "" : category }, this.loadData);
  },

  loadData() {
    const params = {
      category: this.data.category,
      keyword: this.data.keyword,
      reviewStatus: "passed"
    };
    Promise.all([api.getResources(params), api.getNeeds(params)]).then(([resources, needs]) => {
      this.setData({
        resources: statusText.decorateList(resources),
        needs: statusText.decorateList(needs)
      });
    });
  },

  goDetail(event) {
    const { id, type } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}&type=${type}` });
  }
});
