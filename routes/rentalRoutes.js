const express = require("express");
const {
  createRental,
  getAllRental,
  getRentalById,
  updateRental,
  deleteRental
} = require("../controllers/rentalController");

const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rental
 *   description: API untuk kelola data rental kendaraan
 */

/**
 * @swagger
 * /api/rental:
 *   get:
 *     summary: Ambil semua data rental
 *     tags: [Rental]
 *     responses:
 *       200:
 *         description: Daftar rental
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 */
router.get("/", getAllRental);

/**
 * @swagger
 * /api/rental/{id}:
 *   get:
 *     summary: Ambil detail rental berdasarkan ID
 *     tags: [Rental]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rental
 *     responses:
 *       200:
 *         description: Detail rental
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       404:
 *         description: Rental tidak ditemukan
 */
router.get("/:id", getRentalById);

/**
 * @swagger
 * /api/rental:
 *   post:
 *     summary: Tambah rental baru
 *     tags: [Rental]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - harga
 *               - namaPenyedia
 *               - penyedia
 *               - no_telepon
 *               - gambar
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: ["motor", "mobil", "driver"]
 *               harga:
 *                 type: number
 *               deskripsi:
 *                 type: string
 *               namaPenyedia:
 *                 type: string
 *               penyedia:
 *                 type: string
 *               no_telepon:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Rental berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Error input
 */
router.post("/", verifyToken, upload.single("gambar"), createRental);

/**
 * @swagger
 * /api/rental/{id}:
 *   put:
 *     summary: Update data rental berdasarkan ID
 *     tags: [Rental]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rental
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               harga:
 *                 type: number
 *               deskripsi:
 *                 type: string
 *               namaPenyedia:
 *                 type: string
 *               no_telepon:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Rental berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       404:
 *         description: Rental tidak ditemukan
 */
router.put("/:id", verifyToken, upload.single("gambar"), updateRental);

/**
 * @swagger
 * /api/rental/{id}:
 *   delete:
 *     summary: Hapus rental berdasarkan ID
 *     tags: [Rental]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID rental
 *     responses:
 *       200:
 *         description: Rental berhasil dihapus
 *       404:
 *         description: Rental tidak ditemukan
 */
router.delete("/:id", verifyToken, deleteRental);

module.exports = router;
