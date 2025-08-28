const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updatePaymentStatus,
  handleMidtransCallback,
  deleteBooking,
  getBookingsForSeller,
} = require("../controllers/bookingPenginapanController");

const { verifyToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BookingPenginapan
 *   description: API untuk booking penginapan (dengan Midtrans)
 */

/**
 * @swagger
 * /api/booking/penginapan:
 *   post:
 *     summary: Buat booking penginapan + generate payment Midtrans
 *     tags: [BookingPenginapan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - penginapan
 *               - check_in_date
 *               - check_out_date
 *               - jumlah_kamar
 *             properties:
 *               penginapan:
 *                 type: string
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               jumlah_kamar:
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
 *                   $ref: '#/components/schemas/BookingPenginapan'
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
 * /api/booking/penginapan:
 *   get:
 *     summary: Ambil semua booking milik user saat ini
 *     tags: [BookingPenginapan]
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
 *                 $ref: '#/components/schemas/BookingPenginapan'
 */
router.get("/", verifyToken, getMyBookings);

/**
 * @swagger
 * /api/booking/penginapan/seller:
 *   get:
 *     summary: Ambil semua booking yang masuk untuk penginapan (sebagai seller)
 *     tags: [BookingPenginapan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar booking untuk penginapan ini
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingPenginapan'
 */
router.get("/seller", verifyToken, getBookingsForSeller);

/**
 * @swagger
 * /api/booking/penginapan/midtrans/callback:
 *   post:
 *     summary: Endpoint callback Midtrans (tidak perlu token)
 *     tags: [BookingPenginapan]
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

/**
 * @swagger
 * /api/booking/penginapan/{id}:
 *   get:
 *     summary: Ambil detail booking penginapan berdasarkan ID
 *     tags: [BookingPenginapan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     responses:
 *       200:
 *         description: Detail booking ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingPenginapan'
 *       404:
 *         description: Booking tidak ditemukan
 */
router.get("/:id", verifyToken, getBookingById);

/**
 * @swagger
 * /api/booking/penginapan/{id}:
 *   delete:
 *     summary: Hapus booking penginapan
 *     tags: [BookingPenginapan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking
 *     responses:
 *       200:
 *         description: Booking dihapus
 *       404:
 *         description: Booking tidak ditemukan
 */
router.delete("/:id", verifyToken, deleteBooking);

/**
 * @swagger
 * /api/booking/penginapan/{id}/payment-status:
 *   put:
 *     summary: Update status pembayaran booking (admin/manual/callback)
 *     tags: [BookingPenginapan]
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
 *       required: false
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
 *               $ref: '#/components/schemas/BookingPenginapan'
 *       400:
 *         description: Error
 */
router.put("/:id/payment-status", verifyToken, updatePaymentStatus);


module.exports = router;
