import { AuthenticatedUser } from "@/middleware/auth.middleware";
import { PostServices } from "@/services/post.service";
import { Response } from "express";
import HttpStatus from "http-status-codes";

export class PostController {
  private postServices: PostServices;

  constructor(postServices = new PostServices()) {
    this.postServices = postServices;
  }

  public createPost = async (req: AuthenticatedUser, res: Response) => {
    try {
      const result = await this.postServices.createPost({
        userId: req.userId,
        ...req.body,
      });
      return res.status(HttpStatus.CREATED).json(result);
    } catch (err) {
      throw err;
    }
  };

  public getPost = async (req: AuthenticatedUser, res: Response) => {
    try {
      const result = await this.postServices.getPost({
        ...req.body,
      });
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      throw err;
    }
  };

  public getPosts = async (req: AuthenticatedUser, res: Response) => {
    const { limit, page } = req.query;
    try {
      const result = await this.postServices.getPosts(req, {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
      });
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      throw err;
    }
  };
}
