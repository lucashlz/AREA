const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authMiddleware } = require('../middleware/middleware');

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   confirmed:
 *                     type: boolean
 *                   isGoogleAuth:
 *                     type: boolean
 *                   isFacebookAuth:
 *                     type: boolean
 *                   connectServices:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/all", usersController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a specific user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, usersController.deleteUser);

module.exports = router;
