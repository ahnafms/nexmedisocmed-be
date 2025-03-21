import { z } from "zod";
import {
  createTokenDto,
  revokeTokenDto,
  createTokenResponseDto,
  validateTokenDto,
} from "./token.dto";

export type CreateTokenDto = z.infer<typeof createTokenDto>;
export type RevokeTokenDto = z.infer<typeof revokeTokenDto>;
export type CreateTokenResponseDto = z.infer<typeof createTokenResponseDto>;
export type ValidateTokenDto = z.infer<typeof validateTokenDto>;
