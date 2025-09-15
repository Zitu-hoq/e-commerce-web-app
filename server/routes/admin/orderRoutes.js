const express = require("express");
const router = express.Router();
const {
  showOrders,
  deleteOrder,
  editOrder,
} = require("../../controllers/orderController");
const { authenticate } = require("../../controllers/authController");
const { addToArchive } = require("../../controllers/archiveController");

router.get("/", authenticate, showOrders);
router.delete("/delete", authenticate, deleteOrder);
router.put("/edit", authenticate, editOrder);
router.post("/archive", authenticate, addToArchive);

module.exports = router;
