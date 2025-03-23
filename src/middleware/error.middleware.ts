import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import HttpStatus from "http-status-codes";

export const errorInterceptor = (
  err: any,
  _: any,
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
