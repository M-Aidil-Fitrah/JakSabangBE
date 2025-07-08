const BookingPenginapan = require("../models/BookingPenginapan");
const Penginapan = require("../models/Penginapan");

// ✅ Buat booking penginapan
exports.createBooking = async (req, res) => {
  try {
    const { penginapan, tanggalCheckIn, tanggalCheckOut } = req.body;

    const penginapanData = await Penginapan.findById(penginapan);
    if (!penginapanData) return res.status(404).json({ error: "Penginapan tidak ditemukan" });

    const lamaInap = Math.ceil((new Date(tanggalCheckOut) - new Date(tanggalCheckIn)) / (1000 * 60 * 60 * 24));
    const totalHarga = penginapanData.hargaPerMalam * lamaInap;

    const booking = await BookingPenginapan.create({
      user: req.user.id,
      penginapan,
      tanggalCheckIn,
      tanggalCheckOut,
      totalHarga,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Ambil semua booking milik user
exports.getMyBookings = async (req, res) => {
  try {
    const data = await BookingPenginapan.find({ user: req.user.id }).populate("penginapan");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingPenginapan.findById(req.params.id).populate("penginapan");
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
