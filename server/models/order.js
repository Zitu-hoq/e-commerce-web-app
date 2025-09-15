const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        deliveryDate: { type: Date, required: true },
        userComment: { type: String },
        rating: { type: Number },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    deliveryDate: { type: Date, require: true },
    trackingNumber: { type: String, default: "" },
    paymentId: { type: String },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "coming from overseas",
        "waiting for custom check",
        "shipped",
        "out for delivary",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "Mobile Banking", "processing"],
      default: "processing",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
