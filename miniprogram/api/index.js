const { request } = require("./request");

module.exports = {
  login(data) {
    return request({ url: "/user/login", method: "POST", data });
  },
  getResources(params) {
    return request({ url: "/resource/list", data: params });
  },
  getNeeds(params) {
    return request({ url: "/need/list", data: params });
  },
  createResource(data) {
    return request({ url: "/resource/create", method: "POST", data });
  },
  createNeed(data) {
    return request({ url: "/need/create", method: "POST", data });
  },
  aiTags(text) {
    return request({ url: "/ai/tags", method: "POST", data: { text } });
  },
  aiPolish(text) {
    return request({ url: "/ai/polish", method: "POST", data: { text } });
  },
  getMatches(params) {
    return request({ url: "/match/list", data: params });
  },
  updateMatchStatus(id, status) {
    return request({ url: `/match/status/${id}`, method: "PUT", data: { status } });
  },
  createFeedback(data) {
    return request({ url: "/feedback/create", method: "POST", data });
  },
  getFeedbacks() {
    return request({ url: "/feedback/my-list" });
  },
  getCredit(userId) {
    return request({ url: `/feedback/credit/${userId}` });
  },
  getMessages() {
    return request({ url: "/message/list" });
  },
  getProfile() {
    return request({ url: "/user/profile" });
  },
  getAdminSummary() {
    return request({ url: "/admin/dashboard/summary" });
  },
  getReviewList() {
    return request({ url: "/admin/review/list" });
  },
  passReview(data) {
    return request({ url: "/admin/review/pass", method: "POST", data });
  },
  rejectReview(data) {
    return request({ url: "/admin/review/reject", method: "POST", data });
  }
};
