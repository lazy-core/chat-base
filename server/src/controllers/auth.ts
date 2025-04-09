// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User"; // your Mongoose model for users

// Signup: create a new user
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // try {
  //   const { name, email, password } = req.body;
  //   if (!name || !email || !password) {
  //     res.status(400).json({ message: "Name, email, and password are required." });
  //     return;
  //   }

  //   // Check if user already exists
  //   const existingUser: IUser | null = await User.findOne({ email });
  //   if (existingUser) {
  //     res.status(400).json({ message: "Email already exists." });
  //     return;
  //   }

  //   // Hash the password
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   // Create the user record in the database
  //   const newUser: IUser = await User.create({ name, email, password: hashedPassword });
  //   res.status(201).json({ message: "User created", user: newUser });
  // } catch (error) {
  //   next(error);
  // }
};

// Login: authenticate the user and return a JWT
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // try {
  //   const { email, password } = req.body;
  //   if (!email || !password) {
  //     res.status(400).json({ message: "Email and password are required." });
  //     return;
  //   }

  //   const user: IUser | null = await User.findOne({ email });
  //   if (!user) {
  //     res.status(401).json({ message: "Invalid email or password." });
  //     return;
  //   }

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     res.status(401).json({ message: "Invalid email or password." });
  //     return;
  //   }

  //   // Create a JWT token. The authConfig should contain jwtSecret and jwtExpiry properties.
  //   const token = jwt.sign({ id: user._id, email: user.email }, authConfig.jwtSecret, {
  //     expiresIn: authConfig.jwtExpiry,
  //   });
  //   res.status(200).json({ message: "Login successful", token });
  // } catch (error) {
  //   next(error);
  // }
};

// Invite: generate an invitation token for inviting another user
export const invite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // try {
  //   // In this example, we assume a logged in user is available in req.user via the authentication middleware.
  //   // Also assume invitee's email is provided in the body.
  //   const { email: inviteeEmail } = req.body;
  //   if (!inviteeEmail) {
  //     res.status(400).json({ message: "Invitee email is required." });
  //     return;
  //   }

  //   // Generate an invitation token; here we use JWT (you might choose a different strategy)
  //   const inviteToken = jwt.sign({ inviteeEmail }, authConfig.inviteSecret, {
  //     expiresIn: authConfig.inviteExpiry,
  //   });
  //   res.status(200).json({ message: "Invitation generated", inviteToken });
  // } catch (error) {
  //   next(error);
  // }
};