const express = require("express");
const {
  createRental,
  getAllRental,
  getRentalById,
  updateRental,
  deleteRental
} = require("../controllers/rentalController");

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getAllRental);
router.get("/:id", getRentalById);

router.put("/:id", verifyToken, updateRental);
router.delete("/:id", verifyToken, deleteRental);
router.post("/", verifyToken, upload.single("gambar"), createRental);

module.exports = router; // ✅ PENTING!
