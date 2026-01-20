// для теста middleware

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
