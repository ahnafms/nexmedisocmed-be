import { verifyAccessJwt } from "@/helpers/jwt.helper";
import { NextFunction, Response, Request } from "express";
import HttpStatus from "http-status-codes";
import createHttpError from "http-errors";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(createHttpError(HttpStatus.UNAUTHORIZED, "Unauthorized"));
  }

  const extractToken = token.split(" ");

  if (extractToken[0] != "Bearer" && extractToken[1]) {
    return res.status(403).json({ message: "Invalid token" });
  }

  try {
    const decoded = verifyAccessJwt(extractToken[1]);
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
