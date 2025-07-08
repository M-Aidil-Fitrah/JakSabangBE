const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require("../controllers/bookingPenginapanController");

const verifyToken = require("../middleware/auth");
const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getMyBookings);
router.get("/:id", verifyToken, getBookingById);

module.exports = router;
