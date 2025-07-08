const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  no_hp: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
  },
  wilayah: {
    type: String,
  },
  harga: {
    type: Number,
    required: true,
  },
  foto: {
    type: String, // URL dari Cloudinary
  },
  penyedia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("TourGuide", tourGuideSchema);
