import { CommentController } from "@/controllers/comment.controllers";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { createPostCommentDto, getPostCommentDto } from "@/dto/comment";

export const commentRouter = Router();
const commentController = new CommentController();

commentRouter.use(authMiddleware);

commentRouter.post(
  "/:id",
  validate(createPostCommentDto),
  commentController.createPostComment,
);
commentRouter.get(
  "/:id",
  validate(getPostCommentDto, "params"),
  commentController.getPostComment,
);
