const BookingPenginapan = require("../models/BookingPenginapan");
const Penginapan = require("../models/Penginapan");

exports.createBooking = async (req, res) => {
  try {
    const { penginapan, check_in_date, check_out_date, jumlah_kamar } = req.body;
    if (!jumlah_kamar || jumlah_kamar < 1) {
      return res.status(400).json({ error: "Jumlah kamar harus diisi minimal 1" });
    }

    const penginapanData = await Penginapan.findById(penginapan);
    if (!penginapanData) return res.status(404).json({ error: "Penginapan tidak ditemukan" });

    const lamaInap = Math.ceil((new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24));
    const total_harga = penginapanData.hargaPerMalam * lamaInap * jumlah_kamar;

    const booking = await BookingPenginapan.create({
      user: req.user.id,
      penginapan,
      check_in_date,
      check_out_date,
      jumlah_kamar,
      total_harga,
    });

    // TODO: Integrasi ke Midtrans: generate snapToken
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status_pembayaran, payment_id } = req.body;
    const booking = await BookingPenginapan.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (status_pembayaran) booking.status_pembayaran = status_pembayaran;
    if (payment_id) booking.payment_id = payment_id;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.handleMidtransCallback = async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;

    const booking = await Booking.findOne({ payment_id: order_id });
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (transaction_status === "capture" || transaction_status === "settlement") {
      booking.status_pembayaran = "paid";
      // Kurangi jumlahKamarTersedia
      const penginapan = await Penginapan.findById(booking.penginapan);
      if (penginapan) {
        if (penginapan.jumlahKamarTersedia >= booking.jumlah_kamar) {
          penginapan.jumlahKamarTersedia -= booking.jumlah_kamar;
          await penginapan.save();
        } else {
          return res.status(400).json({ error: "Kamar tidak cukup tersedia" });
        }
      }
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      booking.status_pembayaran = "failed";
    }

    await booking.save();
    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await BookingPenginapan.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
