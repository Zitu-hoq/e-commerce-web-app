const express = require("express");
const router = express.Router();
const {
  publicController,
  showOneProduct,
  searchController,
  getCategory,
  getBanners,
} = require("../controllers/publicController");

router.get("/products", publicController);

router.get("/product/:id", showOneProduct);

router.get("/explore/products", searchController);

router.get("/category", getCategory);

router.get("/banners", getBanners);

module.exports = router;
