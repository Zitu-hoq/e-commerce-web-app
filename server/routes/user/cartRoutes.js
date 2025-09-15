const express = require("express");
const router = express.Router();
const { authenticate } = require("../../controllers/authController");
const {
  getCartItems,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../../controllers/cartController");

router.get("/getcart", authenticate, getCartItems);
router.post("/addtocart", authenticate, addToCart);
router.patch("/updatecart", authenticate, updateCart);
router.delete("/removefromcart/:productId", authenticate, removeFromCart);

module.exports = router;
