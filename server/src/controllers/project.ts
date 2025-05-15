// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { generateKeyPairSync } from "crypto";

import constants from "../lib/constants";
import utils from "../lib/utils";

import Team from "../models/Team";
import User from "../models/User";
import Project from "../models/Project";

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, team_id } = req.body;

  const team = await Team.findById(team_id);

  if (!team) return res.error(404, "Team not found");

  const existingProject = await Project.findOne({
    name: name.trim(),
    teamId: team_id,
  });

  if (existingProject)
    return res.error(409, "Another project with that name already exists");

  const { privateKey, publicKey } = generateRSAKeyPair();

  await Project.create({
    name: name.trim(),
    description: description.trim(),
    teamId: team_id,
    keys: {
      secret: privateKey,
      publishable: publicKey,
    },
  });

  res.status(204).json({});
};

export const generateKeyPair = async (req: Request, res: Response) => {
  try {
    const { project_id } = req.body;
    const { publicKey, privateKey } = generateRSAKeyPair();

    const project = await Project.findById(project_id);

    if (!project) return res.error(404, "Project not found");

    project.keys.secret = privateKey;
    project.keys.publishable = publicKey;

    await project.save();

    res.status(200).json({
      message: "Keys generated successfully",
      keys: {
        publicKey,
        privateKey,
      },
    });
  } catch (error: any) {
    res.error(500, error.message || "An error occurred.");
  }
};

export const generateRSAKeyPair = () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  return {
    publicKey,
    privateKey,
  };
};
