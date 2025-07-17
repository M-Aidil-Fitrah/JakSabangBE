const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updatePaymentStatus,
  deleteBooking,
} = require("../controllers/bookingPenginapanController");

const verifyToken = require("../middleware/auth");
const router = express.Router();


router.post("/", verifyToken, createBooking);


router.get("/", verifyToken, getMyBookings);

router.get("/:id", verifyToken, getBookingById);

// Update status pembayaran dari admin atau callback payment gateway
router.put("/:id/payment-status", verifyToken, updatePaymentStatus);


router.delete("/:id", verifyToken, deleteBooking);

module.exports = router;
