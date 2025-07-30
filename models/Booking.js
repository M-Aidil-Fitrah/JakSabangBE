const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  penginapan: { type: mongoose.Schema.Types.ObjectId, ref: "Penginapan", required: true },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  jumlah_kamar: { type: Number, required: true },
  total_harga: { type: Number, required: true },
  status_pembayaran: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending"
  },
  payment_id: String,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
