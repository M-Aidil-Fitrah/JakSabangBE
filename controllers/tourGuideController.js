const TourGuide = require("../models/TourGuide");

exports.createTourGuide = async (req, res) => {
  try {
    const fotoUrl = req.file?.path;
    const tourGuide = await TourGuide.create({
      ...req.body,
      penyedia: req.user.id,
      foto: fotoUrl
    });
    res.status(201).json(tourGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTourGuides = async (req, res) => {
  try {
    const guides = await TourGuide.find().populate("penyedia", "name email");
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTourGuideById = async (req, res) => {
  try {
    const guide = await TourGuide.findById(req.params.id);
    if (!guide) return res.status(404).json({ error: "Tour guide tidak ditemukan" });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
