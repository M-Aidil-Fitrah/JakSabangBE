const mongoose = require("mongoose");

const bookingPaketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  penyedia: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paket: { type: String, required: true }, // contoh: "Snorkeling", "Diving", "Perahu ke Rubiah"
  tanggal: { type: Date, required: true },
  jumlahOrang: { type: Number, required: true },
  totalHarga: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "dibayar", "selesai", "dibatalkan"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("BookingPaket", bookingPaketSchema);
