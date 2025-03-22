import { z } from "zod";
import {
  createPostAuthenticatedDto,
  createPostAuthenticatedResponseDto,
  createPostDto,
  getPostDto,
  getPostResponseDto,
} from "./post.dto";

export type CreatePostDto = z.infer<typeof createPostDto>;
export type CreatePostResponseDto = z.infer<typeof createPostDto>;
export type CreatePostAuthenticatedDto = z.infer<
  typeof createPostAuthenticatedDto
>;
export type CreatePostAuthenticatedResponseDto = z.infer<
  typeof createPostAuthenticatedResponseDto
>;

export type GetPostDto = z.infer<typeof getPostDto>;
export type GetPostResponseDto = z.infer<typeof getPostResponseDto>;
