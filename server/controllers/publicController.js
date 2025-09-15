const Product = require("../models/product");
const Banner = require("../models/banner");
const Category = require("../models/category");

const publicController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const banners = await Banner.find({});
    return res.status(200).json({
      success: true,
      banners: banners,
      products: products,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.log("public-controller-error");
    return res
      .status(501)
      .json({ success: false, message: "Can't read from the database." });
  }
};

const showOneProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }
    return res.status(200).send({ product: product });
  } catch (err) {
    console.log("show-one-product-error");
    return res.status(501).json({ message: "Failed showing one product!" });
  }
};

const searchController = async (req, res) => {
  const searchQuery = req.query.search;
  const escapeRegex = (text) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const searchRegex = new RegExp(escapeRegex(searchQuery), "i");
  try {
    const products = await Product.find({
      $or: [{ name: searchRegex }, { categories: searchRegex }],
    });
    return res.status(200).json(products);
  } catch (error) {
    console.log("search-controller-error");
    res.status(501).json({ message: "product searching Failed!" });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    return res.status(200).json(category);
  } catch (err) {
    console.log("get-category-error");
    return res.status(501).json({ message: "Something is wrong" });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    return res.status(200).json(banners.reverse());
  } catch (error) {
    console.log("get-banners-error");
    return res.status(501).json({ message: "Server Error", error });
  }
};

module.exports = {
  publicController,
  showOneProduct,
  searchController,
  getCategory,
  getBanners,
};
