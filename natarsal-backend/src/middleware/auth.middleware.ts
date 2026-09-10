import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UnauthorizedError, ForbiddenError } from "./error-handler.middleware";
import { AuthUser } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
      return;
    }
    next(new UnauthorizedError("Invalid token"));
  }
};

export const isAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next(new UnauthorizedError("Authentication required"));
    return;
  }
  if (req.user.role !== "ADMIN") {
    next(new ForbiddenError("Admin access required"));
    return;
  }
  next();
};
