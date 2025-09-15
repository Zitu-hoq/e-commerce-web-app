const Voucher = require("../models/voucher");

const addVoucher = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "unauthorized" });
    const data = req.body;
    data.expiryDate = new Date(data.expiryDate).toISOString();
    const newVoucher = new Voucher(data);
    const savedVoucher = await newVoucher.save();
    return res.status(201).json({ savedVoucher, message: "Voucher added!" });
  } catch (err) {
    console.log("add voucher error");
    return res.status(400).json({ error: err.message });
  }
};

const editVoucher = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "unauthorized" });
    const updates = req.body;
    if (updates.expiryDate) {
      updates.expiryDate = new Date(updates.expiryDate).toISOString();
    }
    const updated = await Voucher.findOneAndUpdate(
      { code: req.params.code },
      updates,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Voucher not found" });
    }
    return res.status(200).json({ updated, message: "vouched updated!" });
  } catch (err) {
    console.log("edit voucher error");
    return res.status(400).json({ error: err.message });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "unauthorized" });
    const deleted = await Voucher.findOneAndDelete({ code: req.params.code });
    if (!deleted) {
      return res.status(404).json({ error: "Voucher not found" });
    }
    return res.json({ message: "Voucher deleted", code: deleted.code });
  } catch (err) {
    console.log("delete voucher error");
    return res.status(400).json({ error: err.message });
  }
};

const getVouchers = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(403).json({ message: "forbidden" });
    const vouchers = await Voucher.find({});
    return res.status(200).json({ vouchers });
  } catch (err) {
    console.log("get vouchers error");
    return res.status(500).json({ error: err.message });
  }
};

const checkCouponLogic = async (voucherCode) => {
  const voucher = await Voucher.findOne({ code: voucherCode });
  if (!voucher || !voucher.isActive) throw new Error("Invalid Coupon!");
  if (Date.now() > new Date(voucher.expiryDate).getTime())
    throw new Error("Coupon has expired");
  return voucher;
};

const checkCoupon = async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: "unauthorized" });
    //check for coupon code
    const couponCode = req.params.code;
    if (!couponCode) {
      return res.status(400).json({ message: "Coupon code is required" });
    }
    //validate the coupon code
    const voucher = await checkCouponLogic(couponCode);
    return res.status(200).json(voucher);
  } catch (error) {
    console.log("check-coupon-error");
    return res.status(500).json({ message: error.message, error });
  }
};

module.exports = {
  addVoucher,
  editVoucher,
  deleteVoucher,
  checkCoupon,
  getVouchers,
  checkCouponLogic,
};
