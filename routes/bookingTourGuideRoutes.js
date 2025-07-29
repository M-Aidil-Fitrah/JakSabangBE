const express = require("express");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  handleMidtransCallback
} = require("../controllers/bookingTourGuideController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BookingTourGuide
 *   description: API untuk booking tour guide (dengan Midtrans)
 */


/**
 * @swagger
 * /api/booking/tour-guide:
 *   post:
 *     summary: Buat booking tour guide + generate payment Midtrans
 *     tags: [BookingTourGuide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourGuide
 *               - tanggalMulai
 *               - tanggalSelesai
 *               - lokasiJemput
 *               - totalHarga
 *             properties:
 *               tourGuide:
 *                 type: string
 *               tanggalMulai:
 *                 type: string
 *                 format: date
 *               tanggalSelesai:
 *                 type: string
 *                 format: date
 *               lokasiJemput:
 *                 type: string
 *               totalHarga:
 *                 type: number
 *     responses:
 *       201:
 *         description: Booking berhasil + data payment Midtrans
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking:
 *                   $ref: '#/components/schemas/BookingTourGuide'
 *                 payment:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     redirect_url:
 *                       type: string
 *       400:
 *         description: Error input
 */
router.post("/", verifyToken, createBooking);

/**
 * @swagger
 * /api/booking/tour-guide/me:
 *   get:
 *     summary: Ambil semua booking milik user saat ini
 *     tags: [BookingTourGuide]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar booking milik user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingTourGuide'
 */
router.get("/me", verifyToken, getUserBookings);

/**
 * @swagger
 * /api/booking/tour-guide:
 *   get:
 *     summary: Admin - Ambil semua booking tour guide
 *     tags: [BookingTourGuide]
 *     responses:
 *       200:
 *         description: Semua booking
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingTourGuide'
 */
router.get("/", getAllBookings);

/**
 * @swagger
 * /api/booking/tour-guide/{id}/status:
 *   patch:
 *     summary: Update status pembayaran booking (admin/manual)
 *     tags: [BookingTourGuide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID booking
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_pembayaran:
 *                 type: string
 *                 enum: [pending, paid, failed, cancelled]
 *     responses:
 *       200:
 *         description: Booking ter-update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingTourGuide'
 *       400:
 *         description: Error
 */
router.patch("/:id/status", verifyToken, updateBookingStatus);

/**
 * @swagger
 * /api/booking/tour-guide/midtrans/callback:
 *   post:
 *     summary: Endpoint callback Midtrans (tidak perlu token)
 *     tags: [BookingTourGuide]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               transaction_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Callback processed
 */
router.post("/midtrans/callback", handleMidtransCallback);

module.exports = router;
