import { PostController } from "@/controllers/post.controllers";
import { validate } from "@/middleware/validate.middleware";
import { Router } from "express";
import { createPostDto, getPostDto } from "@/dto/post";
import { authMiddleware } from "@/middleware/auth.middleware";
import { paginationDto } from "@/dto/pagination/pagination.dto";

export const postRouter = Router();
const postController = new PostController();

postRouter.use(authMiddleware);

postRouter.post("/", validate(createPostDto), postController.createPost);
postRouter.get("/:id", validate(getPostDto), postController.getPost);
postRouter.get("/", validate(paginationDto), postController.getPosts);
