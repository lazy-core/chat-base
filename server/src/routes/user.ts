// src/routes/auth.ts
import { Router } from "express";
import { createRootUser } from "../controllers/user";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/create-root", createRootUser);

export default router;