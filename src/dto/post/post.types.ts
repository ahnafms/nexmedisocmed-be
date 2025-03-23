import { z } from "zod";
import {
  createPostAuthenticatedDto,
  createPostAuthenticatedResponseDto,
  createPostDto,
  getPostDto,
  getPostResponseDto,
  likePostControllerDto,
  likePostResponseDto,
  likePostServiceDto,
} from "./post.dto";

export type CreatePostDto = z.infer<typeof createPostDto>;
export type CreatePostResponseDto = z.infer<typeof createPostDto>;
export type CreatePostAuthenticatedDto = z.infer<
  typeof createPostAuthenticatedDto
> & { file: Express.Multer.File };
export type CreatePostAuthenticatedResponseDto = z.infer<
  typeof createPostAuthenticatedResponseDto
>;

export type GetPostDto = z.infer<typeof getPostDto>;
export type GetPostResponseDto = z.infer<typeof getPostResponseDto>;

export type LikePostControllerDto = z.infer<typeof likePostControllerDto>;
export type LikePostServiceDto = z.infer<typeof likePostServiceDto>;
export type LikePostResponseDto = z.infer<typeof likePostResponseDto>;

export type UnlikePostDto = LikePostServiceDto;
export type UnlikePostResponseDto = LikePostResponseDto;
