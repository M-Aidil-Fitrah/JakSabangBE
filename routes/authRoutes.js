const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  getAllUsers,
  updateProfile,
  checkPhoneNumber,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(`https://jaksabang.xyz/auth/success?token=${token}`);
  }
);

// Info login
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ message: "Login berhasil", user: req.user });
});

// ✅ new: Get all users (only admin)
router.get("/users", verifyToken, getAllUsers);

// ✅ new: Update profile sendiri
router.put("/update", verifyToken, updateProfile);

// ✅ new: Cek no_hp sudah dipakai atau belum
router.post("/check-phone", checkPhoneNumber);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints untuk autentikasi user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role, no_hp, alamat]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [buyer, seller]
 *               no_hp:
 *                 type: string
 *               alamat:
 *                 type: string
 *     responses:
 *       201:
 *         description: Register berhasil
 *       400:
 *         description: Email sudah terdaftar
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dengan email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, token dikembalikan
 *       400:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login menggunakan Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke Google login
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback dari Google login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke frontend dengan token
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Cek status login user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil, return user data
 *       401:
 *         description: Token tidak ditemukan
 *       403:
 *         description: Token tidak valid
 */

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Dapatkan semua akun yang terdaftar (hanya admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil, return list user
 *       403:
 *         description: Hanya admin yang boleh mengakses
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Update data diri sendiri
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               alamat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil diupdate
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/check-phone:
 *   post:
 *     summary: Cek apakah nomor HP sudah pernah dipakai
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [no_hp]
 *             properties:
 *               no_hp:
 *                 type: string
 *     responses:
 *       200:
 *         description:  jika sudah dipakai, else false
 *       500:
 *         description: Server error
 */
