import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import HttpStatus from "http-status-codes";

export const errorInterceptor = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (createHttpError.isHttpError(err)) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }

  return next(err);
};
