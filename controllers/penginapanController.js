const Penginapan = require("../models/Penginapan");

//  Create penginapan
exports.createPenginapan = async (req, res) => {
  try {
    const penginapan = await Penginapan.create({
      ...req.body,
      penyedia: req.user.id,
      gambar: req.file?.path,
    });
    res.status(201).json(penginapan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Get all
exports.getAllPenginapan = async (req, res) => {
  try {
    const data = await Penginapan.find().populate("penyedia", "name email");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get by ID
exports.getPenginapanById = async (req, res) => {
  try {
    const penginapan = await Penginapan.findById(req.params.id).populate(
      "penyedia",
      "name email"
    );
    if (!penginapan)
      return res.status(404).json({ error: "Penginapan tidak ditemukan" });
    res.json(penginapan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update
exports.updatePenginapan = async (req, res) => {
  try {
    const penginapan = await Penginapan.findById(req.params.id);
    if (!penginapan)
      return res.status(404).json({ error: "Penginapan tidak ditemukan" });

    // Jika user pemilik atau admin => boleh update semua
    if (penginapan.penyedia.toString() === req.user.id || req.user.role === "admin") {
      Object.assign(penginapan, req.body);
    }
    // Kalau user biasa => boleh update hanya kolom tertentu, misalnya add_review
    else if (req.body.add_review) {
      // Contoh logika: update rating dan jumlah_review
      const newRating = req.body.add_review.rating;
      const userId = req.user.id;

      // Misalnya: tambahkan ke array review / hitung rata-rata baru
      // (kode sesuai schema kamu, ini hanya contoh sederhana)
      penginapan.jumlah_review += 1;
      penginapan.rating = 
        (penginapan.rating * (penginapan.jumlah_review - 1) + newRating) / penginapan.jumlah_review;
    }
    else {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    if (req.file) penginapan.gambar = req.file.path;

    await penginapan.save();
    res.json(penginapan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  Delete
exports.deletePenginapan = async (req, res) => {
  try {
    const penginapan = await Penginapan.findById(req.params.id);
    if (!penginapan)
      return res.status(404).json({ error: "Penginapan tidak ditemukan" });
    if (
      penginapan.penyedia.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ error: "Akses ditolak" });

    await penginapan.deleteOne();
    res.json({ message: "Penginapan dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
