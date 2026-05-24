const express = require("express");

const userRoutes = require("./userRoutes");
const resourceRoutes = require("./resourceRoutes");
const needRoutes = require("./needRoutes");
const aiRoutes = require("./aiRoutes");
const adminRoutes = require("./adminRoutes");
const matchRoutes = require("./matchRoutes");
const messageRoutes = require("./messageRoutes");
const favoriteRoutes = require("./favoriteRoutes");
const feedbackRoutes = require("./feedbackRoutes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/resource", resourceRoutes);
router.use("/need", needRoutes);
router.use("/ai", aiRoutes);
router.use("/admin", adminRoutes);
router.use("/match", matchRoutes);
router.use("/message", messageRoutes);
router.use("/favorite", favoriteRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;
