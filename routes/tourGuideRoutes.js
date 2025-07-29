const express = require("express");
const { createTourGuide, getAllTourGuides, getTourGuideById } = require("../controllers/tourGuideController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/uploadTourGuide"); // multer config

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TourGuide
 *   description: API untuk kelola tour guide
 */

/**
 * @swagger
 * /api/tourguides:
 *   post:
 *     summary: Tambah tour guide baru
 *     tags: [TourGuide]
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
 *               - no_hp
 *               - kataKata
 *               - harga
 *               - penyedia
 *               - foto
 *             properties:
 *               name:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               instagram:
 *                 type: string
 *               kataKata:
 *                 type: string
 *               wilayah:
 *                 type: string
 *               harga:
 *                 type: number
 *               penyedia:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tour guide berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       400:
 *         description: Error input
 */
router.post("/", verifyToken, upload.single("foto"), createTourGuide);

/**
 * @swagger
 * /api/tourguides:
 *   get:
 *     summary: Ambil semua tour guide
 *     tags: [TourGuide]
 *     responses:
 *       200:
 *         description: Daftar tour guide
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TourGuide'
 */
router.get("/", getAllTourGuides);

/**
 * @swagger
 * /api/tourguides/{id}:
 *   get:
 *     summary: Ambil detail tour guide berdasarkan ID
 *     tags: [TourGuide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID tour guide
 *     responses:
 *       200:
 *         description: Detail tour guide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       404:
 *         description: Tour guide tidak ditemukan
 */
router.get("/:id", getTourGuideById);

module.exports = router;
