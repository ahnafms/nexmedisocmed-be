import { AuthenticatedUser } from "@/middleware/auth.middleware";
import { PostServices } from "@/services/post.service";
import { NextFunction, Response } from "express";
import HttpStatus from "http-status-codes";

export class PostController {
  private postServices: PostServices;

  constructor(postServices = new PostServices()) {
    this.postServices = postServices;
  }

  public createPost = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.postServices.createPost({
        userId: req.userId,
        file: req.file,
        ...req.body,
      });
      res
        .status(HttpStatus.CREATED)
        .json({ message: "success create post", data: result });
    } catch (err) {
      next(err);
    }
  };

  public getPost = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.postServices.getPost({
        id: req.params.id,
      });
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getPosts = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    const { limit, page } = req.query;
    try {
      const result = await this.postServices.getPosts(req, {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
      });
      res
        .status(HttpStatus.OK)
        .json({ message: "success get posts", data: result });
    } catch (err) {
      next(err);
    }
  };

  public likePost = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.postServices.likePost({
        userId: req.userId,
        id: req.params.id,
      });
      res
        .status(HttpStatus.OK)
        .json({ message: "success like post", data: result });
    } catch (err) {
      next(err);
    }
  };

  public unlikePost = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.postServices.unlikePost({
        userId: req.userId,
        id: req.params.id,
      });
      res
        .status(HttpStatus.OK)
        .json({ message: "success unlike post", data: result });
    } catch (err) {
      next(err);
    }
  };
}
