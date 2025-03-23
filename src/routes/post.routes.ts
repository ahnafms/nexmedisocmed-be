import { PostController } from "@/controllers/post.controllers";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { createPostDto, getPostDto, likePostControllerDto } from "@/dto/post";
import { authMiddleware } from "@/middleware/auth.middleware";
import { paginationDto } from "@/dto/pagination/pagination.dto";
import { UploadFileServices } from "@/services/upload-file.services";
import multer from "multer";

export const postRouter = Router();
const postController = new PostController();
const m = multer({ storage: multer.memoryStorage() });
postRouter.use(authMiddleware);

postRouter.post(
  "/",
  m.single("image"),
  validate(createPostDto),
  postController.createPost,
);
postRouter.get("/:id", validate(getPostDto, "params"), postController.getPost);
postRouter.get("/", validate(paginationDto), postController.getPosts);
postRouter.post(
  "/:id/like",
  validate(likePostControllerDto, "params"),
  postController.likePost,
);
postRouter.delete(
  "/:id/like",
  validate(likePostControllerDto, "params"),
  postController.unlikePost,
);
