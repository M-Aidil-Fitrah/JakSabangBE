const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sabangkarsa/verifikasi",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"], // Menambahkan pdf
    transformation: [{ width: 500, height: 500, crop: "limit" }] // Opsional: resize image
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas 10MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung"), false);
    }
  }
});

module.exports = upload;