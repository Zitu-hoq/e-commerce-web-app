const express = require("express");
const router = express.Router();
const {
  placeOrder,
  cancelOrder,
} = require("../../controllers/orderController");
const { authenticate } = require("../../controllers/authController");
const {
  handlePayment,
  generateMessage,
  cancelPayment,
} = require("../../controllers/paymentController");

router.post("/place", authenticate, placeOrder);
router.post("/payment", authenticate, handlePayment);
router.post("/payment/message", authenticate, generateMessage);
router.post("/payment/cancel", cancelPayment);
router.post("/cancel", authenticate, cancelOrder);

module.exports = router;
