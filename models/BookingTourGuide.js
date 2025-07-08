const mongoose = require("mongoose");

const bookingTourGuideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tourGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
    required: true
  },
  tanggalMulai: {
    type: Date,
    required: true
  },
  tanggalSelesai: {
    type: Date,
    required: true
  },
  lokasiJemput: {
    type: String,
    required: true
  },
  totalHarga: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("BookingTourGuide", bookingTourGuideSchema);
