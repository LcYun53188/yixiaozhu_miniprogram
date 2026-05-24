const { request } = require("../../api/request");
const statusText = require("../../utils/statusText");

Page({
  data: {
    id: "",
    type: "resource",
    detail: null
  },

  onLoad(options) {
    this.setData({ id: options.id, type: options.type || "resource" }, this.loadData);
  },

  loadData() {
    const path = this.data.type === "resource" ? `/resource/detail/${this.data.id}` : `/need/detail/${this.data.id}`;
    request({ url: path }).then((detail) => {
      this.setData({ detail: statusText.decorateItem(detail) });
    });
  },

  previewImage(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.url,
      urls: this.data.detail.imageUrls || []
    });
  }
});
