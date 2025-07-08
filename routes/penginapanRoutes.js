const express = require("express");
const {
  createPenginapan,
  getAllPenginapan,
  getPenginapanById,
  updatePenginapan,
  deletePenginapan,
} = require("../controllers/penginapanController");

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/uploadPenginapan");


const router = express.Router();

router.get("/", getAllPenginapan);
router.get("/:id", getPenginapanById);
router.post("/", verifyToken, upload.single("gambar"), createPenginapan);
router.put("/:id", verifyToken, upload.single("gambar"), updatePenginapan);
router.delete("/:id", verifyToken, deletePenginapan);

module.exports = router;
