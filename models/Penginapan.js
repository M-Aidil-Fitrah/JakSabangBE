const e = require("cors");
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
  namaPenyedia:{
    type: String,
    required: true,
  },
  tipePeningapan: {
    type: String,
    enum: ["hotel", "villa", "guest house", "resort", "homestay", "boutique hotel", "inn", "motel"],
    required: true,
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


  alamat: {
    type: String,
  },
  no_telepon: {
    type: String,
  },
  email: {
    type: String,
  },
  jumlah_kamar: {
    type: Number,
  },
  fasilitas: {
    type: [String], 
  },
  rating: {
    type: Number,
    default: 0,
  },
  jumlah_review: {
    type: Number,
    default: 0,
  },
  pemilik_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  kebijakan: {
    type: String,
  },
  check_in_time: {
    type: String,
  },
  check_out_time: {
    type: String,
  },
  lokasi_maps: {
    type: String, // atau GeoJSON kalau mau
  }
}, { timestamps: true });

module.exports = mongoose.model("Penginapan", penginapanSchema);
