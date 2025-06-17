// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import utils from "../lib/utils";

import Team from "../models/Team";
import User from "../models/User";
import Project from "../models/Project";

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!utils.isValidEmail(email)) return res.error(400, "Email is invalid");

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.json({
        user_id: existingUser._id,
        has_password: !!existingUser.password,
      });
      return;
    }

    if ((await User.countDocuments()) > 0)
      return res.error(401, "Your email doesn't exist with any account");

    const newUser = await User.create({ email });

    const team = await utils.request(
      "team/create",
      {
        user_id: newUser._id,
        name: "Personal Team",
      },
      "POST"
    );

    res.json({
      user_id: newUser._id,
      team_id: team.team_id,
      has_password: false,
    });
  } catch (error: any) {
    res.error(500, error.message || "An error occurred.");
  }
};

export const verifyPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, name, password, team_id } = req.body;

    const user = await User.findOne({ _id: user_id });

    if (!user) return res.error(401, "Invalid User ID provided");

    const team = await Team.findOne({
      _id: team_id,
    });

    if (!team) return res.error(401, "Invalid Team ID provided");

    const isUserInTeam = team.members.some(
      (member) => (member as any).userId.toString() === user._id.toString()
    );

    if (!isUserInTeam) return res.error(401, "User is not part of the team");

    if (!user.password) {
      if (!name || name.trim() == "")
        return res.error(400, "Invalid name provided");

      if (!password || password.trim() == "")
        return res.error(400, "Invalid password provided");

      user.password = await utils.createHash(password.trim());
      user.name = name.trim();
      await user.save();
    } else if (!(await bcrypt.compareSync(password, user.password)))
      return res.error(401, "Invalid password provided");

    const { auth_token } = await utils.request(
      "team/sign-in",
      {
        user_id: user?._id?.toString(),
        team_id: team_id || user.teamIds[0],
      },
      "POST"
    );

    res.json({
      auth_token: auth_token,
    });
  } catch (error: any) {
    res.error(500, error.message || "An error occured.");
  }
};

export const verifyKeys = async (req: Request, res: Response): Promise<any> => {
  try {
    const { apiKey, secretKey } = req.body;

    if (!apiKey || !secretKey) {
      return res
        .status(400)
        .json({ error: "API Key and Secret Key are required." });
    }

    const project = await Project.findOne({
      "keys.publishable": apiKey,
      "keys.secret": secretKey,
    });

    if (!project) {
      return res.status(401).json({ error: "Invalid API Key or Secret Key." });
    }

    return res.status(200).json({
      projectId: project._id,
      teamId: project.teamId,
      projectName: project.name,
    });
  } catch (error) {
    console.error("Error verifying keys:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while verifying keys." });
  }
};
