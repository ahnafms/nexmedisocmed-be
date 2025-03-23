import { PrismaService } from "@/database/prisma.service";
import { CreatePostCommentServiceDto } from "@/dto/comment";
import { PaginationDto } from "@/dto/pagination";
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

  public async getPostComments(postId: string, params: PaginationDto) {
    try {
      const [comments, totalComments] = await Promise.all([
        this.prisma.comment.findMany({
          where: {
            postId,
          },
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            createdAt: true,
          },
          skip: params.limit * (params.page - 1),
          take: params.limit,
        }),
        this.prisma.comment.count({
          where: {
            postId,
          },
        }),
      ]);

      const formattedRes = {
        results: comments,
        total: totalComments,
        next:
          params.page < totalComments / params.limit ? params.page + 1 : null,
        previous: params.page > 1 ? params.page - 1 : null,
      };

      return formattedRes;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }
}
