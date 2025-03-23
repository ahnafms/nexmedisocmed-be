import { AuthenticatedUser } from "@/middleware/auth.middleware";
import { CommentServices } from "@/services/comment.service";
import { NextFunction, Response } from "express";
import HttpStatus from "http-status-codes";

export class CommentController {
  private commentServices: CommentServices;

  constructor(commentServices = new CommentServices()) {
    this.commentServices = commentServices;
  }

  public createPostComment = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.commentServices.createPostComment({
        userId: req.userId,
        postId: req.params.id,
        ...req.body,
      });
      res
        .status(HttpStatus.CREATED)
        .json({ message: "success create comment", data: result });
    } catch (err) {
      next(err);
    }
  };

  public getPostComment = async (
    req: AuthenticatedUser,
    res: Response,
    next: NextFunction,
  ) => {
    const { limit, page } = req.query;
    try {
      const result = await this.commentServices.getPostComments(
        req,
        req.params.id,
        {
          limit: Number(limit) || 10,
          page: Number(page) || 1,
        },
      );
      res
        .status(HttpStatus.OK)
        .json({ message: "success get comments", data: result });
    } catch (err) {
      next(err);
    }
  };
}
