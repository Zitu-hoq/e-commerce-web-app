const express = require("express");
const router = express.Router();
const { authenticate } = require("../../controllers/authController");
const {
  addAddress,
  deleteAddress,
  updateAddress,
} = require("../../controllers/profileController");
const { checkCoupon } = require("../../controllers/voucherController");

router.post("/addressbook/add", authenticate, addAddress);
router.post("/addressbook/update", authenticate, updateAddress);
router.delete("/addressbook/delete/:id", authenticate, deleteAddress);
router.get("/coupon/:code", authenticate, checkCoupon);

module.exports = router;
