const fs = require("fs");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_APL_SECRET,
});
const uploadImage = (req, res, next) => {
  console.log("multersss");
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Product-IMG",
      });
      req.body.image = result.secure_url;
      console.log(req.body.image, "1234567");
      fs.unlink(req.file.path, (unlink) => {
        if (unlink) {
          console.log("error deleting local file", unlink);
        }
      });
      next();
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: "Error uploding file to cloudinary",
      });
    }
  });
};
module.exports = uploadImage;
