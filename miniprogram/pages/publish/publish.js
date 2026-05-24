const api = require("../../api/index");

Page({
  data: {
    type: "resource",
    categories: ["旧书教材", "闲置物资", "失物招领", "爱心帮扶", "公益活动"],
    form: {
      title: "",
      description: "",
      category: "旧书教材",
      tags: [],
      imageUrls: [],
      polishedText: "",
      contactInfo: "",
      locationText: "",
      urgencyLevel: "medium"
    }
  },

  setType(event) {
    this.setData({ type: event.currentTarget.dataset.type });
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value });
  },

  onCategory(event) {
    this.setData({ "form.category": this.data.categories[event.detail.value] });
  },

  chooseImages() {
    const remainCount = 3 - this.data.form.imageUrls.length;
    wx.chooseMedia({
      count: remainCount,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const paths = res.tempFiles.map((file) => file.tempFilePath);
        this.setData({
          "form.imageUrls": this.data.form.imageUrls.concat(paths).slice(0, 3)
        });
      }
    });
  },

  previewImage(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.url,
      urls: this.data.form.imageUrls
    });
  },

  removeImage(event) {
    const index = event.currentTarget.dataset.index;
    const imageUrls = this.data.form.imageUrls.filter((_, currentIndex) => currentIndex !== index);
    this.setData({ "form.imageUrls": imageUrls });
  },

  extractTags() {
    const text = `${this.data.form.title} ${this.data.form.description}`;
    api.aiTags(text).then((data) => {
      this.setData({ "form.tags": data.tags });
    });
  },

  polishText() {
    api.aiPolish(this.data.form.description).then((data) => {
      this.setData({ "form.polishedText": data.polishedText });
    });
  },

  submit() {
    const action = this.data.type === "resource" ? api.createResource : api.createNeed;
    action(this.data.form).then(() => {
      wx.showToast({ title: "已提交审核" });
      this.setData({
        form: {
          title: "",
          description: "",
          category: "旧书教材",
          tags: [],
          imageUrls: [],
          polishedText: "",
          contactInfo: "",
          locationText: "",
          urgencyLevel: "medium"
        }
      });
    });
  }
});
