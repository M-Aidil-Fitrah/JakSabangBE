const mongoose = require("mongoose");

const penginapanSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  lokasi: {
    type: String,
    required: true,
  },
  deskripsi: {
    type: String,
  },
  hargaPerMalam: {
    type: Number,
    required: true,
  },
  gambar: {
    type: String,
  },
  penyedia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Penginapan", penginapanSchema);
