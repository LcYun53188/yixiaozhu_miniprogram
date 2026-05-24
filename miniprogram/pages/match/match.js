const api = require("../../api/index");
const statusText = require("../../utils/statusText");

Page({
  data: {
    matches: [],
    feedbackVisible: false,
    ratingOptions: [1, 2, 3, 4, 5],
    feedbackTags: ["沟通及时", "物品真实", "守时", "乐于互助", "描述不符"],
    feedback: {
      matchId: null,
      rating: 5,
      content: "",
      tags: []
    }
  },

  onShow() {
    this.loadMatches();
  },

  loadMatches() {
    api.getMatches({}).then((matches) => {
      this.setData({
        matches: matches.map((item) => ({
          ...statusText.decorateItem(item),
          resourceUser: item.resource && item.resource.user ? item.resource.user : item.resourceUser || {},
          needUser: item.need && item.need.user ? item.need.user : item.needUser || {}
        }))
      });
    });
  },

  markContacted(event) {
    api.updateMatchStatus(event.currentTarget.dataset.id, "contacted").then(() => {
      wx.showToast({ title: "已标记联系" });
      this.loadMatches();
    });
  },

  openFeedback(event) {
    this.setData({
      feedbackVisible: true,
      feedback: {
        matchId: event.currentTarget.dataset.id,
        rating: 5,
        content: "",
        tags: []
      }
    });
  },

  closeFeedback() {
    this.setData({ feedbackVisible: false });
  },

  selectRating(event) {
    this.setData({ "feedback.rating": Number(event.currentTarget.dataset.rating) });
  },

  onFeedbackContent(event) {
    this.setData({ "feedback.content": event.detail.value });
  },

  toggleTag(event) {
    const tag = event.currentTarget.dataset.tag;
    const exists = this.data.feedback.tags.includes(tag);
    const tags = exists
      ? this.data.feedback.tags.filter((item) => item !== tag)
      : this.data.feedback.tags.concat(tag);
    this.setData({ "feedback.tags": tags });
  },

  submitFeedback() {
    api.createFeedback(this.data.feedback).then(() => {
      wx.showToast({ title: "评价已提交" });
      this.setData({ feedbackVisible: false });
      this.loadMatches();
    });
  }
});
