import { verifyAccessJwt } from "@/helpers/jwt.helper";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";

export interface AuthenticatedUser extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedUser,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ");

  if (!token) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  if (token[0] != "Bearer" && token[1]) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }

  try {
    const decoded = verifyAccessJwt(token[1]);
    if (!decoded) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
    return next(error);
  }
};
