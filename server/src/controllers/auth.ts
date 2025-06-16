// src/controllers/auth.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import constants from "../lib/constants";
import utils from "../lib/utils";

import Team from "../models/Team";
import User from "../models/User";

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!utils.isValidEmail(email))
      return res.error(400, "Email is invalid");

    const existingUser = await User.findOne({ email: email })
    if (existingUser){
      res.json({ 
        user_id: existingUser._id, 
        has_password: !!existingUser.password 
      })
      return
    }

    if (await User.countDocuments() > 0)
      return res.error(401, "Your email doesn't exist with any account");

    const newUser = await User.create({ email })

    await utils.request('team/create', {
      user_id: newUser._id,
      name: 'Personal Team'
    }, 'POST')

    res.json({ 
      user_id: newUser._id, 
      has_password: false 
    })
  } catch (error: any) {
    res.error(500, error.message || "An error occurred.");
  }
}

export const verifyPassword = async (req: Request, res: Response): Promise<void>  => {
  try {
    const { user_id, name, password, team_id } = req.body

    const user = await User.findOne({ _id: user_id })
    
    if (!user)
      return res.error(401, 'Invalid User ID provided')

    if (!user.password){
      if (!name || name.trim() == '')
        return res.error(400, 'Invalid name provided')

      if (!password || password.trim() == '')
        return res.error(400, 'Invalid password provided')

      user.password = await utils.createHash(password.trim())
      user.name = name.trim()
      await user.save()
    } else if (!(await bcrypt.compareSync(password, user.password)))
      return res.error(401, 'Invalid password provided')

    // CHECK FOR TEAM AND RETURN
    const { auth_token } = await utils.request('team/sign-in', {
      user_id: user._id,
      team_id: team_id || user.teamIds[0]
    }, 'POST')

    res.json({
      auth_token: auth_token
    })
  } catch (error: any) {
    res.error(500, error.message || 'An error occured.')
  }
}