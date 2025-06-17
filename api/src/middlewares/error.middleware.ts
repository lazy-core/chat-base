import { NextFunction, Request, Response } from 'express';
import { HttpException } from '..//utils/httpException';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = status === 500 ? 'Something went wrong' : error.message || 'Something went wrong';
    console.log(JSON.stringify(error.stack, null, 2));

    console.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
