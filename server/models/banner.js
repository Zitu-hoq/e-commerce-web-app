const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imgName: { type: String, required: true },
    imgUrl: { type: String, required: true },
    btnText: { type: String, required: true },
    btnLink: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.model("banner", bannerSchema);

module.exports = Banner;
