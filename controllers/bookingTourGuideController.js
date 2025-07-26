const Booking = require("../models/BookingTourGuide");
const midtransClient = require("midtrans-client");

// init Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

// Buat booking + panggil Midtrans
exports.createBooking = async (req, res) => {
  try {
    const { tourGuide, tanggalMulai, tanggalSelesai, lokasiJemput, totalHarga } = req.body;
    const orderId = `ORDER-TG-${Date.now()}-${req.user.id}`;

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

    const booking = await Booking.create({
      user: req.user.id,
      tourGuide,
      tanggalMulai,
      tanggalSelesai,
      lokasiJemput,
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

// Ambil semua booking user
exports.getUserBookings = async (req, res) => {
  try {
    const data = await Booking.find({ user: req.user.id }).populate("tourGuide");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil semua booking (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const data = await Booking.find().populate("user tourGuide");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status booking manual (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    booking.status_pembayaran = req.body.status_pembayaran || booking.status_pembayaran;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Callback Midtrans
exports.handleMidtransCallback = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;
    const booking = await Booking.findOne({ payment_id: order_id });
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (transaction_status === "capture" || transaction_status === "settlement") {
      booking.status_pembayaran = "paid";
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      booking.status_pembayaran = "failed";
    }
    await booking.save();
    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
