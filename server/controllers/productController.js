const Category = require("../models/category");
const Product = require("../models/product");
const Banner = require("../models/banner");
const { deleteImage } = require("./imageController");

const showProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).send({ products: products });
  } catch (err) {
    console.log("show product error");
    return res.status(501).send({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    //check for product image & data
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const data = req.body;
    const imgUrls = req.files.map((file) => file.path);
    const imgNames = req.files.map((file) => file.filename);
    const productData = {
      ...data,
      pictures: imgNames,
      pictureLinks: imgUrls,
    };
    await new Product(productData).save();
    return res.status(200).json({
      message: "Product Added Successfully!",
    });
  } catch (error) {
    console.log("add product error");
    return res.status(500).json({
      message: "Error uploading images OR Error while saving into Database",
      error: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  const sku = req.body.sku;
  const editedData = req.body;
  try {
    await Product.findOneAndUpdate({ sku: sku }, { $set: { ...editedData } });
    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully." });
  } catch (err) {
    console.log("edit product error");
    return res.status(501).json({
      success: false,
      message: "Database error!! Can't update the product.",
    });
  }
};

const editProductImage = async (req, res) => {
  const images = req.body.imageNames;
  const productID = req.body.id;
  try {
    //check for images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const imgUrls = req.files.map((file) => file.path);
    const imgNames = req.files.map((file) => file.filename);
    //delete old images
    const deletedResponse = await deleteImage(images);
    // update with current images
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productID },
      { $set: { pictures: imgNames, pictureLinks: imgUrls } },
      { new: true }
    );
    return res.status(200).send({
      deletedResponse,
      UpdatedResponse: updatedProduct.pictureLinks,
      message: "Image updated successfully.",
    });
  } catch (err) {
    console.log("edit product image error");
    res.status(404).send({ message: "Something is wrong!" });
  }
};

const editPrimaryImage = async (req, res) => {
  const primaryPicture = req.body.primaryPicture;
  const productID = req.body.id;
  try {
    //replace primary image link
    await Product.findOneAndUpdate(
      { _id: productID },
      { $set: { primaryPicture: primaryPicture } }
    );
    return res.status(200).send({
      success: true,
      message: "Primary Image Updated!.",
    });
  } catch (err) {
    console.log("edit primary image error");
    res.status(404).send({ message: "Something is wrong!" });
  }
};

const deletePoduct = async (req, res) => {
  const productID = req.body.id;
  try {
    //delete product
    const product = await Product.findByIdAndDelete(productID);
    //delete images
    const isImgDeleted = await deleteImage(product.pictures);
    if (isImgDeleted.success) {
      return res
        .status(200)
        .json({ success: true, message: "Product is Deleted!" });
    }
    return res.status(200).json({
      success: true,
      message: "Product Deleted but Product image deletion unsucessful!",
    });
  } catch (err) {
    console.log("delete product error");
    return res.status(501).json({ message: "Something is wrong" });
  }
};

const addCategory = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "Invalid User!" });
    //check for req category data
    const { category } = req.body;
    if (!category)
      return res.status(400).json({ message: "Category is required!" });
    // check for existing category
    const exists = await Category.findOne({ category });
    if (exists) {
      return res.status(409).json({ message: "Category already exists!" });
    }
    await Category.create({ category });
    return res.status(200).json({ message: "Category Added" });
  } catch (err) {
    console.log("add category error");
    res.status(501).json({ message: "Something is wrong" });
  }
};

module.exports = {
  showProducts,
  addProduct,
  editProductImage,
  deletePoduct,
  editProduct,
  editPrimaryImage,
  addCategory,
};
