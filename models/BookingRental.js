const mongoose = require("mongoose");

const bookingRentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
  },
  tanggalMulai: {
    type: Date,
    required: true,
  },
  tanggalSelesai: {
    type: Date,
    required: true,
  },
  totalHarga: {
    type: Number,
    required: true,
  },
  payment_id: { type: String },// id transaksi dari midtrans
  status_pembayaran: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending"
  }
},
{ timestamps: true });

module.exports = mongoose.model("BookingRental", bookingRentalSchema);
