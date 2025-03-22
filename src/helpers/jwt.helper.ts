import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_ACCESS_SECRET as string;
const secretRefreshKey = process.env.JWT_REFRESH_SECRET as string;

if (!secretKey) throw new Error("JWT_SECRET is not defined");
if (!secretRefreshKey) throw new Error("JWT_REFRESH_SECRET is not defined");

export interface JwtPayload {
  userId: string;
  email: string;
}

export const signAccessJwt = (data: JwtPayload) => {
  return jwt.sign(data, secretKey, { expiresIn: "1d" });
};

export const signRefreshJwt = (data: JwtPayload) => {
  return jwt.sign(data, secretRefreshKey, { expiresIn: "1d" });
};

export const verifyAccessJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (error) {
    console.error("Invalid JWT :", error);
    throw error;
  }
};

export const verifyRefreshJwt = (token: string) => {
  try {
    return jwt.verify(token, secretRefreshKey) as JwtPayload;
  } catch (error) {
    console.error("Invalid JWT REFRESH :", error);
    throw error;
  }
};
