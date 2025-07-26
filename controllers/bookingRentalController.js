const BookingRental = require("../models/BookingRental");
const midtransClient = require("midtrans-client");

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// Buat booking + generate payment link
exports.createBooking = async (req, res) => {
  try {
    const { rental, tanggalMulai, tanggalSelesai, totalHarga } = req.body;
    const orderId = `ORDER-${Date.now()}-${req.user.id}`;

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
      payment: midtransResponse, // ada token & redirect_url
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
