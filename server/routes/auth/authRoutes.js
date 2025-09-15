const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  adminAuth,
  authenticate,
  getCurrentUser,
  deleteUser,
} = require("../../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/admin", adminAuth);
router.get("/me", authenticate, getCurrentUser);
router.post("/deleteuser", authenticate, deleteUser);

module.exports = router;
