// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Team from "../models/Team";

export const getSettingsInfo = async (req: Request, res: Response): Promise<void> => {

};

export const setRootDomain = async (req: Request, res: Response): Promise<void> => {

};

export const setApiDomain = async (req: Request, res: Response): Promise<void> => {

};