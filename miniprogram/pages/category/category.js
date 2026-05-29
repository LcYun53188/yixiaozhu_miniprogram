const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    categories: [
      { label: "全部", value: "" },
      { label: "旧书教材", value: "旧书教材" },
      { label: "闲置物资", value: "闲置物资" },
      { label: "失物招领", value: "失物招领" },
      { label: "爱心帮扶", value: "爱心帮扶" },
      { label: "公益活动", value: "公益活动" }
    ],
    category: "",
    activeType: "resource",
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
    this.setData({ category }, this.loadData);
  },

  switchType(event) {
    this.setData({ activeType: event.currentTarget.dataset.type });
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
