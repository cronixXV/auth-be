/**
 * @swagger
 * tags:
 *   name: User
 *   description: Пользователь
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags: [User]
 *     summary: Получить профиль пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Неавторизован
 */

import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, UserController.profile);

export default router;
