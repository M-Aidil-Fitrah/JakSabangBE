const express = require("express");
const { createBooking, getMyBookings, getAllBookings } = require("../controllers/bookingPaketController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getMyBookings);
router.get("/", verifyToken, getAllBookings); // bisa dibatasi hanya admin

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: BookingPaket
 *   description: API untuk booking paket wisata
 */

/**
 * @swagger
 * /api/booking/paket:
 *   post:
 *     summary: Buat booking paket wisata
 *     tags: [BookingPaket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paket
 *               - tanggal
 *               - jumlahOrang
 *               - totalHarga
 *               - penyedia
 *             properties:
 *               paket:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *               jumlahOrang:
 *                 type: number
 *               totalHarga:
 *                 type: number
 *               penyedia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingPaket'
 *       400:
 *         description: Input tidak lengkap
 */
/**
 * @swagger
 * /api/booking/paket/me:
 *   get:
 *     summary: Ambil semua booking paket milik user saat ini
 *     tags: [BookingPaket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List booking milik user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingPaket'
 */
/**
 * @swagger
 * /api/booking/paket:
 *   get:
 *     summary: Ambil semua booking paket (hanya admin / super admin)
 *     tags: [BookingPaket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List semua booking paket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingPaket'
 */
    