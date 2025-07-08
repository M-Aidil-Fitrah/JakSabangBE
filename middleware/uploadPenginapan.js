const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const penginapanStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sabangkarsa/penginapan", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadPenginapan = multer({ storage: penginapanStorage });

module.exports = uploadPenginapan;
