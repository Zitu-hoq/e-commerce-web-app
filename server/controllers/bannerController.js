const Banner = require("../models/banner");

const addBanner = async (req, res) => {
  try {
    //check for image and data
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const imgUrl = req.file.path;
    const imgName = req.file.filename;
    const data = req.body;
    const bannerData = {
      ...data,
      imgName: imgName,
      imgUrl: imgUrl,
    };
    await new Banner(bannerData).save();
    return res.status(200).json({ message: "Banner added Successfully" });
  } catch (error) {
    console.log("add banner error");
    return res.status(501).json({ message: "Server Error", error });
  }
};

const editBanner = async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    await Banner.findByIdAndUpdate(_id, { $set: rest });
    return res.status(200).json({ message: "Banner Edited" });
  } catch (error) {
    console.log("edit banner error");
    return res.status(501).json({ message: "Server Error", error });
  }
};

const deleteBanner = async (req, res) => {
  try {
    if (!req.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    const bannerId = req.body.id;
    const banner = await Banner.findByIdAndDelete(bannerId);
    const isImgDeleted = await deleteImage(banner.imgName);
    if (isImgDeleted.success) {
      return res.status(200).json({ message: "Banner Deleted!" });
    }
    return res
      .status(200)
      .json({ message: "Banner Deleted but Image Deletion unsucessful!" });
  } catch (error) {
    console.log("delete banner error");
    return res.status(501).json({ message: "Server Error", error });
  }
};

const showAllBanners = async (req, res) => {
  try {
    //show all banners for admins only
    if (!req.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    const banners = await Banner.find({});
    return res.status(200).json(banners.reverse());
  } catch (err) {
    console.log("show all banner error");
    return res.status(501).send({ error: err.message });
  }
};

module.exports = { addBanner, editBanner, deleteBanner, showAllBanners };
