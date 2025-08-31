const express = require("express");
const { checkToken } = require("../controllers/tokenController");

const router = express.Router();

/**
 * @swagger
 * /api/token:
 *   post:
 *     summary: Cek masa aktif token
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status token dikembalikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 */
router.get("/", checkToken);

module.exports = router;