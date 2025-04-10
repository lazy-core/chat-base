// src/routes/team.ts
import express, { Router, Request, Response } from 'express';

import { verifyEmail, verifyPassword } from "./controllers/auth";
import { createProject, generateSecretKey, generatePublishableKey } from "./controllers/project";
import { createTeam, signInToTeam, updateTeamName } from "./controllers/team";
import { createRootUser } from "./controllers/user";
import { getSettingsInfo, setRootDomain, setApiDomain } from "./controllers/settings";

import { authenticate } from "./middlewares/auth";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Node.js Server with TypeScript!');
});

router.post('/auth/email', verifyEmail)
router.post('/auth/password', verifyPassword)

router.post("/project/create", authenticate, createProject);
router.post("/project/secret-key", authenticate, generateSecretKey);
router.post("/project/publishable-key", authenticate, generatePublishableKey);

router.post("/team/create", authenticate, createTeam);
router.post("/team/sign-in", authenticate, signInToTeam);
router.post("/team/update-name", authenticate, updateTeamName);

router.get("/settings", authenticate, getSettingsInfo);
router.post("/settings/root-domain", authenticate, setRootDomain);
router.post("/settings/api-domain", authenticate, setApiDomain);

export default router;