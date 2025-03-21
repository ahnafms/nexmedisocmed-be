import { z } from "zod";

export const createTokenDto = z.object({
  userId: z.string().min(2).max(255),
  email: z.string().email(),
});

export const revokeTokenDto = z.string().length(60);

export const createTokenResponseDto = z.string().length(60);

export const validateTokenDto = z
  .string()
  .length(64)
  .regex(/^[a-fA-F0-9]{64}$/);
