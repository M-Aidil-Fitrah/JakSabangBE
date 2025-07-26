const VerifikasiSeller = require("../models/VerifikasiSeller");
const User = require("../models/User");

exports.ajukanVerifikasi = async (req, res) => {
  try {
    const userId = req.user.id;  // pastikan sudah pakai verifyToken di route
    const existing = await VerifikasiSeller.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: "Pengajuan sudah ada" });
    }

    const { npwp, ktp, dokumenBisnis } = req.files;

    if (!npwp || !ktp || !dokumenBisnis) {
      return res.status(400).json({ error: "Semua dokumen harus diupload" });
    }

    const newRequest = await VerifikasiSeller.create({
      user: userId,
      npwp: npwp[0].path,
      ktp: ktp[0].path,
      dokumenBisnis: dokumenBisnis[0].path
    });

    res.status(201).json({ message: "Pengajuan verifikasi berhasil", data: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatusVerifikasi = async (req, res) => {
  try {
    const userId = req.user.id;
    const status = await VerifikasiSeller.findOne({ user: userId });
    if (!status) return res.status(404).json({ message: "Belum mengajukan verifikasi" });
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
