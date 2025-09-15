const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("voucher", VoucherSchema);

module.exports = Voucher;
