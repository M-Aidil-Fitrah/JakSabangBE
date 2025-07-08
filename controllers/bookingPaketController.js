const BookingPaket = require("../models/BookingPaket");

exports.createBooking = async (req, res) => {
  try {
    const { paket, tanggal, jumlahOrang, totalHarga, penyedia } = req.body;

    const booking = await BookingPaket.create({
      user: req.user.id,
      paket,
      tanggal,
      jumlahOrang,
      totalHarga,
      penyedia
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await BookingPaket.find({ user: req.user.id }).populate("penyedia", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingPaket.find().populate("user", "name").populate("penyedia", "name");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
