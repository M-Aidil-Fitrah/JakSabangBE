const User = require("../models/User");
const VerifikasiSeller = require("../models/VerifikasiSeller");


exports.updateRoleUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Role tidak valid" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ error: "User tidak ditemukan" });

    res.status(200).json({ message: "Role user berhasil diupdate", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllUsersWithVerifikasi = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const verifikasiMap = await VerifikasiSeller.find().lean();
    const verifikasiByUserId = {};
    verifikasiMap.forEach(v => {
      verifikasiByUserId[v.user.toString()] = v;
    });

    const combined = users.map(user => ({
      ...user.toObject(),
      verifikasi: verifikasiByUserId[user._id.toString()] || null
    }));

    res.status(200).json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
