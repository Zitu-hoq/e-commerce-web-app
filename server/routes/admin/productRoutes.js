const express = require("express");
const router = express.Router();
const {
  multipleImageMiddleware,
} = require("../../controllers/imageController");
const {
  showProducts,
  addProduct,
  editProductImage,
  deletePoduct,
  editProduct,
  editPrimaryImage,

  addCategory,
} = require("../../controllers/productController");
const { authenticate } = require("../../controllers/authController");

router.get("/all", authenticate, showProducts);

router.post("/add", authenticate, multipleImageMiddleware, addProduct);

router.post("/edit", authenticate, editProduct);

router.post(
  "/img/edit",
  authenticate,
  multipleImageMiddleware,
  editProductImage
);

router.post("/delete", authenticate, deletePoduct);

router.post("/img/primary", authenticate, editPrimaryImage);

router.post("/category/add", authenticate, addCategory);

module.exports = router;
