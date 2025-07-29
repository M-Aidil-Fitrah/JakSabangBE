const mongoose = require("mongoose");

const verifikasiSellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    npwp: {
      type: String,
      required: true,
    },
    ktp: {
      type: String,
      required: true,
    },
    dokumenBisnis: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    no_rekening: {
      type: String,
      required: true,
    },
    nama_rekening: {
      type: String,
      required: true,
    },
    catatan: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VerifikasiSeller", verifikasiSellerSchema);
