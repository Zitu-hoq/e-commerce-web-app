const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ZAP", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    public_id: (req, file) => {
      // Extract the original file name (without extension)
      const originalName = file.originalname.split(".").slice(0, -1).join(".");

      // Generate the custom file name: "originalName_<timestamp>.<extension>"
      const timestamp = Date.now();
      return `${originalName}_${timestamp}`;
    },
  },
});

//image uploader
const upload = multer({
  storage: storage,
});

const deleteImage = async (publicIds) => {
  try {
    // Reconstruct the public ID (assuming the folder is 'ZAP')
    const result = await cloudinary.api.delete_resources(publicIds);

    if (result.deleted) {
      return {
        success: true,
        message: "Images deleted successfully",
        deleted: result.deleted,
      };
    } else {
      return { success: false, message: "Image not found or deletion failed" };
    }
  } catch (error) {
    console.log("Error deleting image:", error.message);
    return { success: false, message: "Error deleting images" };
  }
};

// Controller function to handle single image upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // The file details are available in req.file
    res.status(200).json({
      message: "Image uploaded successfully",
      fileUrl: req.file.path, // Cloudinary file URL
      fileName: req.file.filename, // File name on Cloudinary
    });
  } catch (error) {
    console.log("upload image error");
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

//controller fuction to handle multiple image upload
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Collect URLs and filenames for all uploaded files
    const uploadedFiles = req.files.map((file) => ({
      fileUrl: file.path, // Cloudinary file URL
      fileName: file.filename, // File name on Cloudinary
    }));

    res.status(200).json({
      message: "Images uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.log("upload images error");
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
};

// Export the upload middleware and controller
module.exports = {
  singleImageMiddleware: upload.single("image"),
  multipleImageMiddleware: upload.array("images", 4),
  uploadImage,
  uploadImages,
  deleteImage,
};
