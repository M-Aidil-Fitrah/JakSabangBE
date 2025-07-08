const PaketWisata = require("../models/PaketWisata");

// ✅ Tambah paket (seller only)
exports.createPaket = async (req, res) => {
  try {
    const { nama, deskripsi, hargaPerOrang, durasi } = req.body;
    const gambar = req.file?.path; // dari cloudinary via multer

    const paket = await PaketWisata.create({
      penyedia: req.user.id,
      nama,
      deskripsi,
      hargaPerOrang,
      durasi,
      gambar
    });

    res.status(201).json(paket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Lihat semua paket
exports.getAllPaket = async (req, res) => {
  try {
    const data = await PaketWisata.find().populate("penyedia", "name email");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Lihat satu paket
exports.getPaketById = async (req, res) => {
  try {
    const paket = await PaketWisata.findById(req.params.id).populate("penyedia", "name");
    if (!paket) return res.status(404).json({ error: "Paket tidak ditemukan" });
    res.json(paket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hapus paket (hanya pemilik)
exports.deletePaket = async (req, res) => {
  try {
    const paket = await PaketWisata.findById(req.params.id);
    if (!paket) return res.status(404).json({ error: "Paket tidak ditemukan" });

    if (paket.penyedia.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    await paket.deleteOne();
    res.json({ message: "Paket dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
