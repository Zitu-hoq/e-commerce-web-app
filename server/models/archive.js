const mongoose = require("mongoose");

const archiveSchema = new mongoose.Schema({
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
      unitPrice: { type: Number, required: true },
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
  trackingNumber: { type: String },
  voucher: { type: String },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  status: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true,
  },

  adminComment: { type: String, required: true },

  completedAt: { type: Date, default: Date.now },
});

const Archive = mongoose.model("archive", archiveSchema);

module.exports = Archive;
