const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
    previousOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: "archive" }],
    message: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
