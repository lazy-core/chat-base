// src/middlewares/responseErrorHandler.ts
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      error: (status: number, message: string) => void;
    }
  }
}

export const responseErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.error = (status: number, message: string): void => {
    res.status(status).json({ error: message, status });
  };
  next();
};