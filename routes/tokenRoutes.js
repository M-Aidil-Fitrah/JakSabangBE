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
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "62834e83253eb4b8a4c2fc05"
 *                     role:
 *                       type: string
 *                       example: "buyer"
 *                     iat:
 *                       type: number
 *                       example: 1755545789
 *                     exp:
 *                       type: number
 *                       example: 1765632389
 */
router.get("/", checkToken);

module.exports = router;