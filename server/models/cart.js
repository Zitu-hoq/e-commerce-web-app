const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
