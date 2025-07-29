const express = require("express");
const {
  createPenginapan,
  getAllPenginapan,
  getPenginapanById,
  updatePenginapan,
  deletePenginapan,
} = require("../controllers/penginapanController");

const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/uploadPenginapan");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Penginapan
 *   description: API untuk kelola data penginapan
 */

/**
 * @swagger
 * /api/penginapan:
 *   get:
 *     summary: Ambil semua data penginapan
 *     tags: [Penginapan]
 *     responses:
 *       200:
 *         description: Daftar penginapan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Penginapan'
 */
router.get("/", getAllPenginapan);

/**
 * @swagger
 * /api/penginapan/{id}:
 *   get:
 *     summary: Ambil detail penginapan berdasarkan ID
 *     tags: [Penginapan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penginapan
 *     responses:
 *       200:
 *         description: Detail penginapan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Penginapan'
 *       404:
 *         description: Penginapan tidak ditemukan
 */
router.get("/:id", getPenginapanById);

/**
 * @swagger
 * /api/penginapan:
 *   post:
 *     summary: Tambah penginapan baru
 *     tags: [Penginapan]
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
 *               - lokasi
 *               - tipePeningapan
 *               - hargaPerMalam
 *               - jumlahKamarTersedia
 *               - namaPenyedia
 *               - penyedia
 *             properties:
 *               nama:
 *                 type: string
 *               lokasi:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               tipePeningapan:
 *                 type: string
 *                 enum: ["hotel", "villa", "guest house", "resort", "homestay", "boutique hotel", "inn", "motel"]
 *               hargaPerMalam:
 *                 type: number
 *               jumlahKamarTersedia:
 *                 type: number
 *               namaPenyedia:
 *                 type: string
 *               penyedia:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               no_telepon:
 *                 type: string
 *               email:
 *                 type: string
 *               fasilitas:
 *                 type: array
 *                 items:
 *                   type: string
 *               kebijakan:
 *                 type: string
 *               check_in_time:
 *                 type: string
 *               check_out_time:
 *                 type: string
 *               lokasi_maps:
 *                 type: string
 *     responses:
 *       201:
 *         description: Penginapan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Penginapan'
 *       400:
 *         description: Error input
 */
router.post("/", verifyToken, upload.single("gambar"), createPenginapan);

/**
 * @swagger
 * /api/penginapan/{id}:
 *   put:
 *     summary: Update data penginapan berdasarkan ID
 *     tags: [Penginapan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penginapan
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               lokasi:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               tipePeningapan:
 *                 type: string
 *               hargaPerMalam:
 *                 type: number
 *               jumlahKamarTersedia:
 *                 type: number
 *               namaPenyedia:
 *                 type: string
 *               gambar:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               no_telepon:
 *                 type: string
 *               email:
 *                 type: string
 *               fasilitas:
 *                 type: array
 *                 items:
 *                   type: string
 *               kebijakan:
 *                 type: string
 *               check_in_time:
 *                 type: string
 *               check_out_time:
 *                 type: string
 *               lokasi_maps:
 *                 type: string
 *     responses:
 *       200:
 *         description: Penginapan berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Penginapan'
 *       404:
 *         description: Penginapan tidak ditemukan
 */
router.put("/:id", verifyToken, upload.single("gambar"), updatePenginapan);

/**
 * @swagger
 * /api/penginapan/{id}:
 *   delete:
 *     summary: Hapus penginapan berdasarkan ID
 *     tags: [Penginapan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penginapan
 *     responses:
 *       200:
 *         description: Penginapan berhasil dihapus
 *       404:
 *         description: Penginapan tidak ditemukan
 */
router.delete("/:id", verifyToken, deletePenginapan);

module.exports = router;
