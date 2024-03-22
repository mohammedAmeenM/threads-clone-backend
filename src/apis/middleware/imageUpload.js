require("dotenv").config();

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
    console.log("requsts:", req.body);
  },
});
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_APL_SECRET,
});

const imageUpload = (fieldname) => async (req, res, next) => {
  //  console.log("requsets",req.body)
  upload.single(fieldname)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      if (!req.file) {
        return next();
      }

      console.log(req.file);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "TalkFlow-users",
      });

     
      req.body[fieldname] = result.secure_url;
      fs.unlink(req.file.path, (unliker) => {
        if (unliker) {
          console.log("Error deleting local file", unliker);
        }
      });

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log("Error in image upload: ", error);
    }
  });
};

module.exports = imageUpload;
