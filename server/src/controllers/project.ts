// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import constants from "../lib/constants";
import utils from "../lib/utils";

import Team from "../models/Team";
import User from "../models/User";

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { auth_user, name } = req.body

  const existingTeam = await Team.findOne({ _id: { $in: auth_user.teamIds }, name: name.trim() })
  if (existingTeam) 
    return res.error(409, 'Another team with that name already exists')

  const newTeam = await Team.create({ name: name.trim(), members: [{ userId: auth_user._id }] })
  
  auth_user.teamIds.push(newTeam._id)
  await auth_user.save()

  res.json({
    team_id: newTeam._id
  })
}

export const generateSecretKey = async (req: Request, res: Response): Promise<void> => {
  
}

export const generatePublishableKey = async (req: Request, res: Response): Promise<void> => {
  
}