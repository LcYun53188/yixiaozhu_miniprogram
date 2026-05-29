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
    },
    newTag: "",
    assistTip: "",
    recognizeMenuOpen: false
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

  toggleRecognizeMenu() {
    this.setData({ recognizeMenuOpen: !this.data.recognizeMenuOpen });
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

  applyAssistResult(result) {
    const tags = Array.from(new Set((this.data.form.tags || []).concat(result.tags || []))).slice(0, 10);
    this.setData({
      "form.title": result.title || this.data.form.title,
      "form.category": result.category || this.data.form.category,
      "form.description": result.description || this.data.form.description,
      "form.polishedText": result.description || this.data.form.polishedText,
      "form.tags": tags,
      assistTip: result.suggestion || "已自动填充识别结果，可继续手动修改。"
    });
  },

  scanIsbn() {
    wx.scanCode({
      scanType: ["barCode", "qrCode"],
      success: (res) => {
        const isbn = String(res.result || "").trim();
        if (!isbn) {
          wx.showToast({ title: "未识别到ISBN", icon: "none" });
          return;
        }
        api.aiIsbnAssist(isbn).then((data) => {
          this.applyAssistResult(data);
          wx.showToast({ title: "已识别ISBN" });
        });
      },
      fail: () => {
        wx.showToast({ title: "扫码取消或失败", icon: "none" });
      }
    });
  },

  recognizeByCamera() {
    this.recognizeByPhotoSource("camera");
  },

  recognizeByAlbum() {
    this.recognizeByPhotoSource("album");
  },

  recognizeByPhotoSource(sourceType) {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: [sourceType],
      success: (res) => {
        const file = res.tempFiles[0];
        if (!file) return;
        const imageUrl = file.tempFilePath;
        const imageUrls = this.data.form.imageUrls.concat(imageUrl).slice(0, 3);
        this.setData({ "form.imageUrls": imageUrls });
        api.aiImageAssist({
          imageUrl,
          fileName: imageUrl
        }).then((data) => {
          this.applyAssistResult(data);
          wx.showToast({ title: "已识别图片" });
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

  onNewTagInput(event) {
    this.setData({ newTag: event.detail.value });
  },

  addTag() {
    const tag = this.data.newTag.trim();
    if (!tag) {
      wx.showToast({ title: "请输入标签", icon: "none" });
      return;
    }
    const tags = Array.from(new Set(this.data.form.tags.concat(tag))).slice(0, 10);
    this.setData({
      "form.tags": tags,
      newTag: ""
    });
  },

  removeTag(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({
      "form.tags": this.data.form.tags.filter((_, currentIndex) => currentIndex !== index)
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
        },
        newTag: "",
        assistTip: ""
      });
    });
  }
});
