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
} from "@/dto/post";
import { getPaginationUrl } from "@/helpers/pagination.helper";
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
      const res = await this.prisma.post.create({
        data: {
          userId: data.userId,
          title: data.title,
          content: data.content,
        },
      });

      const formattedRes = { ...res, likes: 0 };

      return formattedRes;
    } catch (err) {
      throw err;
    }
  }

  public async getPost(id: GetPostDto): Promise<GetPostResponseDto> {
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

      const { _count, ...rest } = res;
      const formattedRes = { ...rest, likes: _count.likes };

      return formattedRes;
    } catch (err) {
      throw err;
    }
  }

  public async getPosts(
    request: Request,
    params: PaginationDto,
  ): Promise<PaginationResponseDto<GetPostResponseDto>> {
    try {
      const totalPosts = await this.prisma.post.count();
      const res = await this.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        skip: params.limit * (params.page - 1),
        take: params.limit,
      });

      const formattedRes = {
        data: res.map((post) => {
          const { _count, ...rest } = post;
          return { ...rest, likes: _count.likes };
        }),
        total: totalPosts,
        next: getPaginationUrl(
          request,
          params.page < totalPosts / params.limit ? params.page + 1 : null,
          params.limit,
        ),
        previous: getPaginationUrl(
          request,
          params.page > 1 ? params.page - 1 : null,
          params.limit,
        ),
      };

      return formattedRes;
    } catch (err) {
      throw err;
    }
  }
}
