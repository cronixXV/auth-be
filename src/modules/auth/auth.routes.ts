import { Router } from "express";
import { AuthController, logout, refresh } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
