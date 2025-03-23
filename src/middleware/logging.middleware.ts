import { Request, Response } from "express";
import morgan, { TokenIndexer } from "morgan";

export const loggingMiddleware = morgan(function (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response,
) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});
