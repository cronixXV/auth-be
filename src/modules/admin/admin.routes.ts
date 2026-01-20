// для теста roleGuard

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
