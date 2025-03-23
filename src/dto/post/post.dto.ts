import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp"];

export const createPostDto = z.object({
  title: z.string().min(5).max(100),
  content: z.string(),
});

export const createPostAuthenticatedDto = z.object({
  userId: z.string().uuid(),
  title: z.string().min(5).max(100),
  content: z.string(),
});

export const createPostAuthenticatedResponseDto = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(100),
  content: z.string(),
  likes: z.number(),
});

export const getPostDto = z.object({
  id: z.string().uuid(),
});

export const getPostResponseDto = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(100),
  content: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  likes: z.boolean(),
  likes_count: z.number(),
});

export const likePostControllerDto = z.object({
  id: z.string().uuid(),
});

export const likePostServiceDto = likePostControllerDto.extend({
  userId: z.string().uuid(),
});

export const likePostResponseDto = likePostServiceDto.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const unlikePostServiceDto = likePostServiceDto;
