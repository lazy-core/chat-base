// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import constants from "../lib/constants";
import utils from "../lib/utils";

import Team from "../models/Team";
import User from "../models/User";

export const signInToTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, team_id } = req.body;

  const user = await User.findOne({
    _id: user_id,
    teamIds: { $in: [team_id] },
  });

  const authToken = utils.createToken({
    userId: user?._id,
    teamId: team_id,
  });

  user?.sessions?.push({
    authToken: authToken,
  });

  (user as any).sessions = user?.sessions.slice(-constants.MAX_SESSIONS) || [];

  await (user as any).save();

  res.json({
    auth_token: authToken,
  });
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { auth_user, name } = req.body;

  const existingTeam = await Team.findOne({
    _id: { $in: auth_user.teamIds },
    name: name.trim(),
  });
  if (existingTeam)
    return res.error(409, "Another team with that name already exists");

  const newTeam = await Team.create({
    name: name.trim(),
    members: [{ userId: auth_user._id, role: "admin" }],
  });

  auth_user.teamIds.push(newTeam._id);
  await auth_user.save();

  res.json({
    team_id: newTeam._id,
  });
};

export const updateTeamName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { auth_user, auth_team_id, name } = req.body;

  const existingTeam = await Team.findOne({
    _id: { $ne: auth_team_id },
    name: name.trim(),
  });
  if (existingTeam)
    return res.error(409, "Another team with that name already exists");

  await Team.updateOne({ _id: auth_team_id }, { $set: { name: name.trim() } });

  res.json({});
};
