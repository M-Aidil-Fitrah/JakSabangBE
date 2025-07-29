const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2; // pastikan sudah import sesuai config kamu

router.get('/ping-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
