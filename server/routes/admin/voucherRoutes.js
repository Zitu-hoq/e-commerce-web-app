const express = require("express");
const router = express.Router();
const { authenticate } = require("../../controllers/authController");
const {
  getVouchers,
  addVoucher,
  editVoucher,
  deleteVoucher,
} = require("../../controllers/voucherController");

router.get("/", authenticate, getVouchers);
router.post("/add", authenticate, addVoucher);
router.put("/edit/:code", authenticate, editVoucher);
router.delete("/delete/:code", authenticate, deleteVoucher);

module.exports = router;
