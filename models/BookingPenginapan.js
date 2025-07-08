const mongoose = require("mongoose");

const bookingPenginapanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  penginapan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Penginapan",
    required: true,
  },
  tanggalCheckIn: {
    type: Date,
    required: true,
  },
  tanggalCheckOut: {
    type: Date,
    required: true,
  },
  totalHarga: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("BookingPenginapan", bookingPenginapanSchema);
