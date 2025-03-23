import { NextFunction, Request, Response } from "express";
import z from "zod";
import HttpStatus from "http-status-codes";

export const validate =
  (schema: z.ZodSchema, input: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req["body"]);
    const result = schema.safeParse(req[input]);
    if (!result.success) {
      const errors = result.error.errors.map(({ path, message }) => ({
        path,
        message,
      }));

      return res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }

    return next();
  };
