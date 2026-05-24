const api = require("../../api/index");

Page({
  data: {
    messages: []
  },

  onShow() {
    api.getMessages().then((messages) => {
      this.setData({ messages });
    });
  }
});
