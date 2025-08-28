const BookingRental = require("../models/BookingRental");
const Rental = require('../models/Rental');
const midtransClient = require("midtrans-client");

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});
exports.createBooking = async (req, res) => {
  try {
    const { rental, tanggalMulai, tanggalSelesai, totalHarga } = req.body;
    const orderId = `ORDER-${Date.now()}-${req.user.id}`;

    // Step 1: cek apakah rental ini sudah dibooking di tanggal overlap
    const existingBookings = await BookingRental.find({
      rental,
      status_pembayaran: { $in: ["pending", "paid"] },
      $or: [
        {
          tanggalMulai: { $lt: new Date(tanggalSelesai) },
          tanggalSelesai: { $gt: new Date(tanggalMulai) }
        }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ error: "Rental sudah dibooking di tanggal tersebut" });
    }

    // Step 2: lanjut proses Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalHarga,
      },
      customer_details: {
        first_name: req.user.name || "User",
        email: req.user.email || "user@example.com",
      },
    };

    const midtransResponse = await snap.createTransaction(parameter);

    // Step 3: simpan booking
    const booking = await BookingRental.create({
      user: req.user.id,
      rental,
      tanggalMulai,
      tanggalSelesai,
      totalHarga,
      payment_id: orderId,
      status_pembayaran: "pending",
    });

    res.status(201).json({
      booking,
      payment: midtransResponse,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Ambil booking milik user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await BookingRental.find({ user: req.user.id }).populate("rental");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil semua booking (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingRental.find().populate("user rental");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingsForSeller = async (req, res) => {
  try {
    // Cari semua rental milik seller ini
    // const rentals = await Rental.find({ penyedia: req.user.id }).select('_id');
    // const rentalIds = rentals.map(r => r._id);

    // Cari booking untuk rental tersebut
    const bookings = await BookingRental.find({ rental: req.user.id })
      .populate("user", "name email")
      .populate("rental", "nama");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error("[getBookingsForSeller - Rental]", err.message);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server"
    });
  }
};

// Update status pembayaran manual (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await BookingRental.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (req.body.status_pembayaran) booking.status_pembayaran = req.body.status_pembayaran;
    if (req.body.payment_id) booking.payment_id = req.body.payment_id;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Callback Midtrans (public)
exports.handleMidtransCallback = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;
    const booking = await BookingRental.findOne({ payment_id: order_id });
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (transaction_status === "capture" || transaction_status === "settlement") {
      booking.status_pembayaran = "paid";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      booking.status_pembayaran = "failed";
    }
    await booking.save();

    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
