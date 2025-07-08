const express = require("express");
const router = express.Router();

const {
  createTourGuide,
  getAllTourGuides,
  getTourGuideById,
} = require("../controllers/tourGuideController");

const verifyToken = require("../middleware/auth"); // middleware untuk autentikasi
const upload = require("../middleware/uploadTourGuide");    // multer + cloudinary

// POST /api/tourguides - Buat Tour Guide baru (butuh token dan upload foto)
router.post("/", verifyToken, upload.single("foto"), createTourGuide);

// GET /api/tourguides - Ambil semua tour guide (public)
router.get("/", getAllTourGuides);

// GET /api/tourguides/:id - Ambil tour guide berdasarkan ID (public)
router.get("/:id", getTourGuideById);

module.exports = router;
