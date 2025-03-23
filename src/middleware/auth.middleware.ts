import { verifyAccessJwt } from "@/helpers/jwt.helper";
import { NextFunction, Response, Request } from "express";
import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(createHttpError(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  try {
    const decoded = verifyAccessJwt(token);
    if (!decoded) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    throw createHttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }
};
