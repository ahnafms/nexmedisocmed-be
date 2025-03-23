import { z } from "zod";

export const getPostCommentDto = z.object({ id: z.string().uuid() });
export const createPostCommentDto = z.object({
  content: z.string(),
});

export const createPostCommentServiceDto = createPostCommentDto.extend({
  userId: z.string().uuid(),
  postId: z.string().uuid(),
});

export const getPostCommentResponseDto = z.array(
  z.object({
    id: z.string().uuid(),
    content: z.string(),
    user: z.object({
      id: z.string(),
      username: z.string(),
    }),
    createdAt: z.coerce.date(),
  }),
);
