const express = require("express");
const { createBooking, getMyBookings, getAllBookings } = require("../controllers/bookingPaketController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getMyBookings);
router.get("/", verifyToken, getAllBookings); // bisa dibatasi hanya admin

module.exports = router;
