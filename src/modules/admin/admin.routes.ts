// для теста roleGuard

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Административные методы
 */

/**
 * @swagger
 * /admin/ping:
 *   get:
 *     tags: [Admin]
 *     summary: Проверка доступа администратора
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Нет прав
 */

import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.guard";

const router = Router();

router.get("/admin/ping", authMiddleware, roleGuard(["ADMIN"]), (req, res) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
  });
});

export default router;
