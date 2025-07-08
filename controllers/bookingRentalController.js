const BookingRental = require("../models/BookingRental");

exports.createBooking = async (req, res) => {
  try {
    const { rental, tanggalMulai, tanggalSelesai, totalHarga } = req.body;

    const booking = await BookingRental.create({
      user: req.user.id,
      rental,
      tanggalMulai,
      tanggalSelesai,
      totalHarga,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await BookingRental.find({ user: req.user.id })
      .populate("rental");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingRental.find()
      .populate("user rental");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await BookingRental.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
