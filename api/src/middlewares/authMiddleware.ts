import { NextFunction, Response } from 'express';
import { HttpException } from '../utils/httpException';
import httpStatus from 'http-status';
import { userPassport } from '../config/passport';
import { RequestWithUser } from '../interfaces/auth.interface';

const AUTH_ERR_MSG = 'Unauthorized access';

const verifyCallback = (req: RequestWithUser, resolve, reject, requiredRights?: string[]) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  resolve();
};

export const UserAuthMiddleware = () => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    userPassport.authenticate('user', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};
