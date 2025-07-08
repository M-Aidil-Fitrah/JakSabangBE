// models/PaketWisata.js
const mongoose = require("mongoose");

const paketSchema = new mongoose.Schema({
  penyedia: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nama: { type: String, required: true },         // contoh: Snorkeling, Diving
  deskripsi: String,
  hargaPerOrang: { type: Number, required: true },
  durasi: String,                                 // contoh: "2 jam"
  gambar: String                                  // bisa pakai Cloudinary
}, { timestamps: true });

module.exports = mongoose.model("PaketWisata", paketSchema);
