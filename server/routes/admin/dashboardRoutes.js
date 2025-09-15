const express = require("express");
const router = express.Router();
const { authenticate } = require("../../controllers/authController");
const {
  showAnalytics,
  showUsers,
} = require("../../controllers/dashboardController");

router.get("/", authenticate, showAnalytics);

router.get("/user", authenticate, showUsers);

module.exports = router;
