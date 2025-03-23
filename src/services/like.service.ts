import { PrismaService } from "@/database/prisma.service";
import { CreatePostCommentServiceDto } from "@/dto/comment/comment.types";
import { prismaError } from "@/helpers/prismaError.helper";
import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";

export class CommentServices {
  private prisma: PrismaService;

  constructor() {
    this.prisma = PrismaService.getInstance();
  }

  public async createPostComment(data: CreatePostCommentServiceDto) {
    try {
      const res = await this.prisma.comment.create({
        data: {
          userId: data.userId,
          content: data.content,
          postId: data.postId,
        },
        select: {
          postId: true,
          userId: true,
          content: true,
        },
      });

      return res;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }
}
