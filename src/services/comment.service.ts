import { PrismaService } from "@/database/prisma.service";
import { CreatePostCommentServiceDto } from "@/dto/comment";
import { PaginationDto } from "@/dto/pagination";
import { getPaginationUrl } from "@/helpers/pagination.helper";
import { prismaError } from "@/helpers/prismaError.helper";
import { Prisma } from "@prisma/client";
import { Request } from "express";
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

  public async getPostComments(
    request: Request,
    postId: string,
    params: PaginationDto,
  ) {
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
        next: getPaginationUrl(
          request,
          params.page < totalComments / params.limit ? params.page + 1 : null,
          params.limit,
        ),
        previous: getPaginationUrl(
          request,
          params.page > 1 ? params.page - 1 : null,
          params.limit,
        ),
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
