import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { DataStoredInUserSession, UserSessionTypes } from '../types/auth.types';
import { NextFunction } from 'express';
import { Socket } from 'socket.io';
import { UserModel } from '../models/user.model';

const jwtVerify = async (payload: DataStoredInUserSession) => {
  if (payload.type !== UserSessionTypes.ACCESS) {
    throw new Error('Invalid token type');
  }

  const user = await UserModel.getById(payload.projectId, payload.sub);

  if (!user) {
    throw new Error('Profile not found');
  }
  return user;
};

export const socketAuthMiddleware = async (socket: Socket, next: NextFunction) => {
  try {
    const { token } = socket.handshake.auth || {};

    const decoded: any = jwt.verify(token, SECRET_KEY);

    const user = await jwtVerify(decoded);

    (socket.request as any).user = user;
  } catch (err) {
    return next(new Error('NOT AUTHORIZED'));
  }
  next();
};
