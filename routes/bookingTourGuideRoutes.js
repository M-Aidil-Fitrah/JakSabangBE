const express = require("express");
const {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingTourGuideController");

const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/", verifyToken, getAllBooking);
router.get("/:id", verifyToken, getBookingById);
router.post("/", verifyToken, createBooking);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);

module.exports = router;
