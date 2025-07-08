const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");

const paketStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sabangkarsa/paket", 
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadPaket = multer({ storage: paketStorage });

module.exports = uploadPaket;
