// src/routes/auth.ts
import { Router } from "express";
import { signup, login, invite } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.post("/invite", authenticate, invite);

export default router;