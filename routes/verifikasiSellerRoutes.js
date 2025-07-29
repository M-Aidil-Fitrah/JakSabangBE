const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  ajukanVerifikasi,
  getStatusVerifikasi,
} = require("../controllers/verifikasiSellerController");
const upload = require("../middleware/uploadVerifikasi"); // multer config

/**
 * @swagger
 * tags:
 *   name: VerifikasiSeller
 *   description: API untuk verifikasi penjual (seller)
 */

/**
 * @swagger
 * /api/verifikasi:
 *   post:
 *     summary: Ajukan verifikasi seller (upload NPWP, KTP, dokumen bisnis)
 *     tags: [VerifikasiSeller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               npwp:
 *                 type: string
 *                 format: binary
 *               ktp:
 *                 type: string
 *                 format: binary
 *               dokumenBisnis:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Berhasil diajukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifikasiSeller'
 *       400:
 *         description: Input tidak valid
 *       500:
 *         description: Error server
 */
router.post(
  "/",
    
  upload.fields([
    { name: "npwp", maxCount: 1 },
    { name: "ktp", maxCount: 1 },
    { name: "dokumenBisnis", maxCount: 1 },
  ]),
  ajukanVerifikasi
);



/**
 * @swagger
 * /api/verifikasi/status:
 *   get:
 *     summary: Cek status verifikasi seller
 *     tags: [VerifikasiSeller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status verifikasi seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                 catatan:
 *                   type: string
 *       404:
 *         description: Data verifikasi tidak ditemukan
 *       500:
 *         description: Error server
 */
router.get("/status", verifyToken, getStatusVerifikasi);

module.exports = router;