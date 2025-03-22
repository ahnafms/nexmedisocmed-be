import { z } from "zod";

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

export const getPostDto = z.string().uuid();

export const getPostResponseDto = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(100),
  content: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  likes: z.number(),
});
