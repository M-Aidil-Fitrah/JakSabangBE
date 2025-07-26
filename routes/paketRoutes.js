const express = require("express");
const {
  createPaket,
  getAllPaket,
  getPaketById,
  deletePaket
} = require("../controllers/paketController");

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/uploadPaket"); // pakai upload cloudinary

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PaketWisata
 *   description: API untuk paket wisata (Snorkeling, Diving, dll)
 */

/**
 * @swagger
 * /api/paket:
 *   get:
 *     summary: Ambil semua paket wisata
 *     tags: [PaketWisata]
 *     responses:
 *       200:
 *         description: Daftar paket wisata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaketWisata'
 */
router.get("/", getAllPaket);

/**
 * @swagger
 * /api/paket/{id}:
 *   get:
 *     summary: Ambil detail paket wisata berdasarkan ID
 *     tags: [PaketWisata]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID paket wisata
 *     responses:
 *       200:
 *         description: Detail paket wisata ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaketWisata'
 *       404:
 *         description: Paket wisata tidak ditemukan
 */
router.get("/:id", getPaketById);

/**
 * @swagger
 * /api/paket:
 *   post:
 *     summary: Tambah paket wisata baru
 *     tags: [PaketWisata]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - hargaPerOrang
 *               - penyedia
 *             properties:
 *               nama:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               hargaPerOrang:
 *                 type: number
 *               durasi:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *               penyedia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paket wisata berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaketWisata'
 *       400:
 *         description: Error input
 */
router.post("/", verifyToken, upload.single("gambar"), createPaket);

/**
 * @swagger
 * /api/paket/{id}:
 *   delete:
 *     summary: Hapus paket wisata berdasarkan ID
 *     tags: [PaketWisata]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID paket wisata
 *     responses:
 *       200:
 *         description: Paket wisata berhasil dihapus
 *       404:
 *         description: Paket wisata tidak ditemukan
 */
router.delete("/:id", verifyToken, deletePaket);

module.exports = router;
