import { z } from "zod";
import {
  createUserDto,
  createUserResponseDto,
  getUserDto,
  getUserResponseDto,
  loginUserDto,
  loginUserResponseDto,
} from "./user.dto";

export type CreateUserDto = z.infer<typeof createUserDto>;
export type CreateUserResponseDto = z.infer<typeof createUserResponseDto>;
export type LoginUserDto = z.infer<typeof loginUserDto>;
export type LoginUserResponseDto = z.infer<typeof loginUserResponseDto>;
export type GetUserDto = z.infer<typeof getUserDto>;
export type GetUserResponseDto = z.infer<typeof getUserResponseDto>;
