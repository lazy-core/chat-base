// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import utils from "../lib/utils";

import User from "../models/User";

interface AuthenticatedRequest extends Request {
  auth_user?: any;
  auth_team_id?: string;
}

function getBearerToken(req: Request){
  const authHeader = req.headers['authorization']
  return req.body.auth_token ?? req.query.auth_token ?? authHeader?.split(' ')[1]
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = getBearerToken(req)
  const decodedToken = utils.decodeToken(token)

  try {
    if (!decodedToken && token == process.env.JWT_SECRET) {
      var user = await User.findOne({ _id: req.body.user_id || req.query.user_id })
    } else {
      var user = await User.findOne({ _id: decodedToken?.userId || '' })
      if (!user?.sessions.some(s => s.authToken == token))
        return res.error(401, 'Invalid token provided')
    }
    
    req.auth_user = user
    req.auth_team_id = decodedToken?.teamId

    next();
  } catch (error) {
    res.error(401, 'Invalid token')
  }
};