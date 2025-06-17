// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User";
import Team from "../models/Team";

export const createRootUser = async (req: Request, res: Response): Promise<void> => {
  // try {
  //   const { email } = req.body;
  //   if (!email) {
  //     res.error(400, "Email is required.");
  //     return
  //   }

  //   // CREATE ROOT USER
  //   let rootUser = await User.findOne({ $or: [
  //     { _id: process.env.ROOT_USER_ID },
  //     { email: email },
  //   ]})
  //   if (!rootUser)
  //     rootUser = await User.create({ email })

  //   // CREATE ROOT TEAM
  //   res.status(200).json({ id: rootUser._id });
  // } catch (error: any) {
  //   res.error(500, error.message || "An error occurred.");
  // }
};