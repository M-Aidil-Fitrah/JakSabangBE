const express = require("express");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  handleMidtransCallback,
  getBookingsForSeller,
} = require("../controllers/bookingRentalController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BookingRental
 *   description: API untuk booking rental kendaraan
 */

/**
 * @swagger
 * /api/booking/rental:
 *   post:
 *     summary: Buat booking rental & generate pembayaran Midtrans
 *     tags: [BookingRental]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rental
 *               - tanggalMulai
 *               - tanggalSelesai
 *             properties:
 *               rental:
 *                 type: string
 *               tanggalMulai:
 *                 type: string
 *                 format: date
 *               tanggalSelesai:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingRental'
 */
router.post("/", verifyToken, createBooking);

/**
 * @swagger
 * /api/booking/rental/me:
 *   get:
 *     summary: Ambil semua booking rental milik user saat ini
 *     tags: [BookingRental]
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
 *                 $ref: '#/components/schemas/BookingRental'
 */
router.get("/me", verifyToken, getUserBookings);
router.get("/seller", verifyToken, getBookingsForSeller);


/**
 * @swagger
 * /api/booking/rental:
 *   get:
 *     summary: Ambil semua booking rental (admin)
 *     tags: [BookingRental]
 *     responses:
 *       200:
 *         description: Semua booking rental
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingRental'
 */
router.get("/", getAllBookings);

/**
 * @swagger
 * /api/booking/rental/{id}/payment-status:
 *   put:
 *     summary: Update status pembayaran booking rental
 *     tags: [BookingRental]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_pembayaran:
 *                 type: string
 *                 enum: [pending, paid, failed, cancelled]
 *               payment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking ter-update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingRental'
 */
router.put("/:id/payment-status", verifyToken, updateBookingStatus);

/**
 * @swagger
 * /api/booking/rental/midtrans/callback:
 *   post:
 *     summary: Callback Midtrans untuk update status otomatis
 *     tags: [BookingRental]
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
