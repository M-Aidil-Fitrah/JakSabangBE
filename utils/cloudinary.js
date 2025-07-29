const cloudinary = require('cloudinary').v2;

// Load env (pastikan sudah ada di server.js atau di sini kalau belum)
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tes koneksi
cloudinary.api.ping()
  .then(res => console.log("✅ Cloudinary connected:", res))
  .catch(err => console.error("❌ Cloudinary error:", err));

// Export supaya bisa dipakai di tempat lain
module.exports = cloudinary;
