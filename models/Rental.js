const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["motor", "mobil", "driver"],
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    deskripsi: {
      type: String,
    },
    gambar: {
      type: String,
    },
    penyedia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    namaPenyedia: {
      type: String,
      required: true,
    },
    no_telepon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
