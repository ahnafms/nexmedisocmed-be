import { z } from "zod";
import {
  createPostCommentDto,
  createPostCommentServiceDto,
} from "./comment.dto";

export type CreatePostCommentDto = z.infer<typeof createPostCommentDto>;
export type CreatePostCommentServiceDto = z.infer<
  typeof createPostCommentServiceDto
>;
