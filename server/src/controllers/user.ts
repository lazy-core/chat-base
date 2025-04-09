// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export const createRootUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Creating Root User...')

  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    // Retrieve the current root user id from env (if it exists)
    const existingRootUserId = process.env.ROOT_USER_ID;
    let existingUser = null;

    if (existingRootUserId) {
      existingUser = await User.findById(existingRootUserId);
    }

    // If no root user exists or the email is different, create a new root user:
    if (!existingUser || existingUser.email !== email) {
      // If an old record exists (with a different email), remove it.
      if (existingUser) {
        await User.findByIdAndDelete(existingRootUserId);
      }

      // Create the new root user. We're hardcoding the name as "Root User" and using an empty password.
      const newUser = await User.create({
        name: "Root User",
        email,
      });

      // // Update the environment variable with the new root user's id.
      // process.env.ROOT_USER_ID = newUser._id.toString();

      res.json({ id: newUser._id });
    } else {
      // If the existing root user record is found and the email matches, simply return the id.
      res.json({ id: existingUser._id });
    }
  } catch (error) {
    // next(error);
    console.log(error)
    res.status(400).send('An error occured')
  }
};