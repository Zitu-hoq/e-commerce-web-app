const express = require("express");
const router = express.Router();
const { singleImageMiddleware } = require("../../controllers/imageController");
const {
  addBanner,
  showAllBanners,
  deleteBanner,
  editBanner,
} = require("../../controllers/bannerController");
const { authenticate } = require("../../controllers/authController");

router.get("/", authenticate, showAllBanners);

router.post("/add", authenticate, singleImageMiddleware, addBanner);

router.post("/delete", authenticate, deleteBanner);

router.post("/edit", authenticate, editBanner);

module.exports = router;
