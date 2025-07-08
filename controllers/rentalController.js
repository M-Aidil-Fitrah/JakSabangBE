const Rental = require("../models/Rental");
exports.createRental = async (req, res) => {
      console.log("👉 BODY:", req.body);
  console.log("👉 FILE:", req.file);
  try {
    const { name, type, harga, deskripsi } = req.body;

    const rental = await Rental.create({
      name,
      type,
      harga,
      deskripsi,
      gambar: req.file?.path || "",
      penyedia: req.user.id,
    });

 
    const populated = await rental.populate("penyedia", "name email");

    res.status(201).json({
      _id: populated._id,
      name: populated.name,
      type: populated.type,
      harga: populated.harga,
      deskripsi: populated.deskripsi,
      gambar: populated.gambar,
      penyedia: populated.penyedia,
      createdAt: populated.createdAt,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ✅ Ambil semua rental
exports.getAllRental = async (req, res) => {
  try {
    const data = await Rental.find().populate("penyedia", "name email");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Ambil 1 rental
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ error: "Rental tidak ditemukan" });
    res.json(rental);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update rental (hanya jika pemilik)
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ error: "Rental tidak ditemukan" });
    if (rental.penyedia.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Akses ditolak" });

    Object.assign(rental, req.body);
    await rental.save();
    res.json(rental);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hapus rental (hanya jika pemilik)
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ error: "Rental tidak ditemukan" });
    if (rental.penyedia.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Akses ditolak" });

    await rental.deleteOne();
    res.json({ message: "Rental dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
