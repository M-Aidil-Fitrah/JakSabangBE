const express = require("express");
const { register, login, googleLogin } = require("../controllers/authController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// 📝 Register user (buyer / seller)
router.post("/register", register);

// 🔐 Login dengan email dan password
router.post("/login", login);


// 🔎 Verifikasi login JWT token
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Login berhasil",
    user: req.user,
  });
});

module.exports = router;
