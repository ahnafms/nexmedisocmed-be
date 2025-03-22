import { Request } from "express";

export const getPaginationUrl = (
  req: Request,
  page: number | null,
  limit: number,
): string | null => {
  if (!page) return null;

  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
  const url = new URL(baseUrl);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  return url.toString();
};
