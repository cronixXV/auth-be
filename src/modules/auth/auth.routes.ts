import { Router } from "express";
import { AuthController, refresh } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", refresh);

export default router;
