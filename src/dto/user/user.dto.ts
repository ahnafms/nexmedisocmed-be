import { z } from "zod";

export const createUserDto = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export const createUserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const loginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export const loginUserResponseDto = z.object({
  access_token: z
    .string()
    .length(64)
    .regex(/^[a-fA-F0-9]{64}$/),
});

export const getUserDto = z.object({
  userId: z.string(),
});

export const getUserResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
