const TourGuide = require("../models/TourGuide");

// Buat tour guide
exports.createTourGuide = async (req, res) => {
  try {
    const fotoUrl = req.file?.path || "";
    const guide = await TourGuide.create({
      ...req.body,
      penyedia: req.user.id,
      foto: fotoUrl,
    });
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Ambil semua tour guide
exports.getAllTourGuides = async (req, res) => {
  try {
    const guides = await TourGuide.find().populate("penyedia", "name email");
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ambil tour guide by ID
exports.getTourGuideById = async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id).populate("penyedia", "name email");
    if (!guide) return res.status(404).json({ error: "Tour guide tidak ditemukan" });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update rental (hanya jika pemilik)
exports.updateTourGuide = async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ error: "Tour Guide tidak ditemukan" });
    if (tourGuide.penyedia.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Akses ditolak" });

    Object.assign(tourGuide, req.body);
    if (req.file) tourGuide.gambar = req.file.path;

    await tourGuide.save();
    res.json(tourGuide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Hapus rental
exports.deleteTourGuide = async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ error: "Tour Guide tidak ditemukan" });
    if (tourGuide.penyedia.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Akses ditolak" });

    await tourGuide.deleteOne();
    res.json({ message: "Tour Guide dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
