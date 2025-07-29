  const User = require("../models/User");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  exports.register = async (req, res) => {
    const { name, email, password, role, no_hp, alamat } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: "Email sudah terdaftar" });

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ 
        name, 
        email, 
        password: hashed, 
        role, 
        no_hp, 
        alamat 
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          role: user.role,
          email: user.email,
          no_hp: user.no_hp,
          alamat: user.alamat
        } 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Password salah" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.getAllUsers = async (req, res) => {
    try {
      // Cek role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Hanya admin yang boleh mengakses" });
      }
      const users = await User.find().select('-password'); // jangan tampilkan password
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // ✅ Update data diri
  exports.updateProfile = async (req, res) => {
    const { name, no_hp, alamat } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, no_hp, alamat },
        { new: true, runValidators: true }
      ).select('-password');
      res.status(200).json({ message: "Berhasil diupdate", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // ✅ Cek no_hp sudah pernah dipakai atau belum
  exports.checkPhoneNumber = async (req, res) => {
    const { no_hp } = req.body;
    try {
      const existing = await User.findOne({ no_hp });
      if (existing) {
        return res.status(200).json({ used: true });
      } else {
        return res.status(200).json({ used: false });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
        