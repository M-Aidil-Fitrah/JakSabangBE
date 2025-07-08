const express = require("express");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
} = require("../controllers/bookingRentalController");

const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getUserBookings);
router.get("/", getAllBookings);
router.patch("/:id/status", verifyToken, updateBookingStatus);

module.exports = router;
