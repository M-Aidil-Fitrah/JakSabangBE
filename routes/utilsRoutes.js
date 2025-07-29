const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2; // pastikan sudah di-setup/config sebelumnya
const mongoose = require('mongoose');        // pakai koneksi mongoose utama

// Ping Cloudinary
router.get('/ping-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Ping MongoDB
router.get('/ping-mongodb', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      res.json({ ok: true, message: 'MongoDB connected' });
    } else {
      res.status(500).json({ ok: false, message: 'MongoDB not connected' });
    }
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
