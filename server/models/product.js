const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categories: [String],
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    primaryPicture: { type: String },
    pictures: { type: [String], required: true },
    pictureLinks: { type: [String], required: true },
    description: { type: String, required: true },
    features: { type: String, required: true },
    idealFor: { type: String, required: true },
    colors: [String],
    size: [String],
    estDelivaryTime: { type: Number, required: true },
    shipFrom: String,
    discount: Number,
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

// Middleware to ensure "all" is always present and no duplicates
productSchema.pre("save", function (next) {
  const set = new Set(this.categories);
  set.add("all");
  this.categories = Array.from(set);
  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
