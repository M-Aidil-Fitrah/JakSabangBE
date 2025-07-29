const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/auth");
const { updateRoleUserByAdmin, getAllUsersWithVerifikasi } = require("../controllers/userAdminController");
const { verifyAdmin } = require("../middleware/auth");


/**
 * @swagger
 * tags:
 *   name: AdminUser
 *   description: API khusus admin untuk kelola user & verifikasi
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Dapatkan semua user + data verifikasi mereka
 *     tags: [AdminUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil
 *       403:
 *         description: Hanya admin
 *       500:
 *         description: Server error
 */
router.get("/users", verifyToken, verifyAdmin, getAllUsersWithVerifikasi);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   put:
 *     summary: Update role user (misalnya buyer → seller)
 *     tags: [AdminUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *     responses:
 *       200:
 *         description: Berhasil diupdate
 *       400:
 *         description: Role tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put("/users/:userId/role", verifyToken, updateRoleUserByAdmin);

module.exports = router;
