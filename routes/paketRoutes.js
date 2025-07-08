const express = require("express");
const {
  createPaket,
  getAllPaket,
  getPaketById,
  deletePaket
} = require("../controllers/paketController");

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/uploadPaket"); // pakai upload cloudinary

const router = express.Router();

router.get("/", getAllPaket);
router.get("/:id", getPaketById);
router.post("/", verifyToken, upload.single("gambar"), createPaket);
router.delete("/:id", verifyToken, deletePaket);

module.exports = router;
