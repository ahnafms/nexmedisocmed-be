import { PrismaService } from "@/database/prisma.service";
import {
  PaginationDto,
  PaginationResponseDto,
} from "@/dto/pagination/pagination.types";
import {
  CreatePostAuthenticatedDto,
  CreatePostAuthenticatedResponseDto,
  GetPostDto,
  GetPostResponseDto,
  LikePostServiceDto,
  UnlikePostDto,
} from "@/dto/post";
import { prismaError } from "@/helpers/prismaError.helper";
import createHttpError from "http-errors";
import { Prisma } from "@prisma/client";
import { UploadFileServices } from "./upload-file.services";
import { LikePost } from "@/entities/like.entities";
import { Request } from "express";

export class PostServices {
  private prisma: PrismaService;

  constructor() {
    this.prisma = PrismaService.getInstance();
  }

  public async createPost(
    data: CreatePostAuthenticatedDto,
  ): Promise<CreatePostAuthenticatedResponseDto> {
    try {
      let imageUrl: string | null = null;

      if (data.file) {
        const uploadResult = await UploadFileServices.uploadFile(data.file);
        imageUrl = uploadResult.url;
      }
      const res = await this.prisma.post.create({
        data: {
          userId: data.userId,
          title: data.title,
          content: data.content,
          image: imageUrl,
        },
      });

      const formattedRes = { ...res, likes: 0 };

      return formattedRes;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }

  public async getPost({ id }: GetPostDto): Promise<GetPostResponseDto> {
    try {
      const res = await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      const formattedRes = {
        ...res,
        likes: res._count.likes > 0 ? true : false,
      };
      return formattedRes;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }

  public async getPosts(
    request: Request,
    params: PaginationDto,
  ): Promise<PaginationResponseDto<GetPostResponseDto>> {
    try {
      const { posts, totalPosts } = await this.prisma.$transaction(
        async (tx) => {
          const totalPosts = await tx.post.count();

          const posts = await tx.post.findMany({
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              likes_count: true,
              image: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
              likes: {
                where: {
                  userId: request.userId,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            skip: params.limit * (params.page - 1),
            take: params.limit,
          });

          return { posts, totalPosts };
        },
      );

      const formattedRes = {
        results: posts.map((post) => ({
          ...post,
          likes: post.likes.length > 0 ? true : false,
        })),
        total: totalPosts,
        next: params.page < totalPosts / params.limit ? params.page + 1 : null,
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

  public async likePost(data: LikePostServiceDto): Promise<LikePost> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const res = await tx.like.create({
          data: {
            userId: data.userId,
            postId: data.id,
          },
        });

        await tx.post.update({
          where: { id: data.id },
          data: { likes_count: { increment: 1 } },
        });

        return res;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }

  public async unlikePost(data: UnlikePostDto): Promise<LikePost> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const res = await tx.like.delete({
          where: {
            postId_userId: {
              userId: data.userId,
              postId: data.id,
            },
          },
        });

        await tx.post.update({
          where: { id: data.id },
          data: { likes_count: { decrement: 1 } },
        });

        return res;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }
}
