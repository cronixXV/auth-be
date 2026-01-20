// для теста middleware
/**
/**
 * @swagger
 * /me:
 *   get:
 *     tags: [Debug]
 *     summary: Проверка authMiddleware
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Пользователь авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are authorized
 *                 user:
 *                   $ref: '#/components/schemas/TokenPayload'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    message: "You are authorized",
    user: req.user,
  });
});

export default router;
