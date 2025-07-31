const Booking = require("../models/Booking");
const Penginapan = require("../models/Penginapan");
const midtransClient = require("midtrans-client");
exports.createBooking = async (req, res) => {
  try {
    const { penginapan, check_in_date, check_out_date, jumlah_kamar } = req.body;

    // Step 0: Validasi input
    if (!jumlah_kamar || jumlah_kamar < 1) {
      return res.status(400).json({ error: "Jumlah kamar harus diisi minimal 1" });
    }

    const penginapanData = await Penginapan.findById(penginapan);
    if (!penginapanData) {
      return res.status(404).json({ error: "Penginapan tidak ditemukan" });
    }

    // Step 1: Cari booking lain yang overlap
    const overlappingBookings = await Booking.find({
      penginapan,
      status_pembayaran: { $in: ["pending", "paid"] },
      $or: [
        {
          check_in_date: { $lt: new Date(check_out_date) },
          check_out_date: { $gt: new Date(check_in_date) },
        },
      ],
    });

    const totalKamarTerbooking = overlappingBookings.reduce((sum, b) => sum + b.jumlah_kamar, 0);
    if (totalKamarTerbooking + jumlah_kamar > penginapanData.jumlahKamarTersedia) {
      return res.status(400).json({ error: "Kamar tidak tersedia pada tanggal tersebut" });
    }

    // Step 2: Hitung total harga
    const lamaInap = Math.ceil(
      (new Date(check_out_date) - new Date(check_in_date)) / (1000 * 60 * 60 * 24)
    );
    if (lamaInap < 1) {
      return res.status(400).json({ error: "Tanggal check-in dan check-out tidak valid" });
    }

    const total_harga = penginapanData.hargaPerMalam * lamaInap * jumlah_kamar;

    // Step 3: Buat booking di DB
    const booking = await Booking.create({
      user: req.user.id,
      penginapan,
      check_in_date,
      check_out_date,
      jumlah_kamar,
      total_harga,
    });

    // Step 4: Setup Midtrans
    if (!process.env.MIDTRANS_SERVER_KEY) {
      console.error("❌ MIDTRANS_SERVER_KEY is not set in environment variables!");
      return res.status(500).json({ error: "Server configuration error: MIDTRANS_SERVER_KEY missing" });
    }

    const isProduction = true;
    let snap = new midtransClient.Snap({
      isProduction,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    // Step 5: Buat parameter Midtrans + detail item
    let parameter = {
      transaction_details: {
        order_id: `booking-${booking._id}`,
        gross_amount: total_harga,
      },
      customer_details: {
        first_name: req.user.name || "Guest",
        email: req.user.email || "guest@example.com",
      },
      item_details: [
        {
          id: penginapanData._id.toString(),
          price: penginapanData.hargaPerMalam,
          quantity: lamaInap * jumlah_kamar,
          name: penginapanData.nama.substring(0, 50),
        },
      ],
    };

    // Step 6: Create transaction Midtrans
    let transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // Step 7: Simpan payment_id ke booking
    booking.payment_id = `booking-${booking._id}`;
    await booking.save();

    console.log("✅ Midtrans transaction created. Sending response to frontend.");

    // Step 8: Response
    res.status(201).json({
      booking,
      payment: {
        token: snapToken,
        redirect_url: transaction.redirect_url,
      },
    });

  } catch (err) {
    console.error("❌ Error in createBooking:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const data = await Booking.find({ user: req.user.id }).populate(
      "penginapan"
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "penginapan"
    );
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status_pembayaran, payment_id } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });

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
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
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
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Booking tidak ditemukan" });

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookingsForSeller = async (req, res) => {
  try {
    // Cari semua penginapan milik seller ini
    const penginapanSeller = await Penginapan.find({ penyedia: req.user.id }).select('_id');
    const penginapanIds = penginapanSeller.map(p => p._id);

    // Cari booking untuk penginapan tersebut
    const bookings = await Booking.find({ penginapan: { $in: penginapanIds } })
      .populate("user", "name email")
      .populate("penginapan", "nama lokasi");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error("[getBookingsForSeller - Penginapan]", err.message);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server"
    });
  }
};
