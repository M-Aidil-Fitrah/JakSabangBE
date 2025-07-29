const VerifikasiSeller = require("../models/VerifikasiSeller");
const User = require("../models/User");

exports.ajukanVerifikasi = async (req, res) => {
  try {
    console.log("Memulai ajukanVerifikasi untuk user:", req.user?.id);
    if (!req.user || !req.user.id) {
      console.log("Autentikasi gagal");
      return res.status(401).json({ error: "Autentikasi gagal" });
    }

    const userId = req.user.id;
    console.log("Mencari existing verifikasi di MongoDB...");
    const existing = await VerifikasiSeller.findOne({ user: userId });
    if (existing) {
      console.log("Pengajuan sudah ada");
      return res.status(400).json({ error: "Pengajuan verifikasi sudah ada" });
    }

    const { npwp, ktp, dokumenBisnis } = req.files;
    console.log("Files diterima dari klien:", { npwp: npwp?.length, ktp: ktp?.length, dokumenBisnis: dokumenBisnis?.length });
    if (!npwp || !npwp.length || !ktp || !ktp.length || !dokumenBisnis || !dokumenBisnis.length) {
      console.log("Dokumen tidak lengkap");
      return res.status(400).json({ error: "Semua dokumen harus diunggah" });
    }

    console.log("Mengunggah ke Cloudinary dan menyimpan ke MongoDB...");
    const newRequest = await VerifikasiSeller.create({
      user: userId,
      npwp: npwp[0].path,
      ktp: ktp[0].path,
      dokumenBisnis: dokumenBisnis[0].path,
    });
    console.log("Dokumen berhasil disimpan ke MongoDB:", newRequest);

    res.status(201).json({ message: "Pengajuan verifikasi berhasil", data: newRequest });
  } catch (err) {
    console.error("Error di ajukanVerifikasi:", err);
    if (err.name === "MongoNetworkError" || err.code === "ETIMEDOUT") {
      console.log("Timeout kemungkinan dari MongoDB atau Cloudinary");
      return res.status(503).json({ error: "Koneksi ke server gagal, coba lagi nanti" });
    }
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

exports.getStatusVerifikasi = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Autentikasi gagal" });
    }

    const userId = req.user.id;
    const status = await VerifikasiSeller.findOne({ user: userId }).select("status catatan"); // Hanya ambil status dan catatan
    if (!status) return res.status(404).json({ message: "Belum mengajukan verifikasi" });
    res.status(200).json(status);
  } catch (err) {
    console.error("Error in getStatusVerifikasi:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};