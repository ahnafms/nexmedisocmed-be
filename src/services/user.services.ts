import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserDto,
  GetUserResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
} from "@/dto/user";
import { PrismaService } from "@/database/prisma.service";
import { compare, hash } from "@/helpers/hash.helper";
import { signAccessJwt } from "@/helpers/jwt.helper";
import createHttpError from "http-errors";
import { Prisma } from "@prisma/client";
import { prismaError } from "@/helpers/prismaError.helper";

export class UserServices {
  private prisma: PrismaService;

  constructor() {
    this.prisma = PrismaService.getInstance();
  }

  public async createUser(data: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const hashedPassword = await hash(data.password);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      });

      const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }

  public async loginUser({
    email,
    password,
  }: LoginUserDto): Promise<LoginUserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.password)
        throw createHttpError.Unauthorized("Invalid email or password");

      const isMatch = await compare(password, user.password);

      if (isMatch) {
        const accessToken = signAccessJwt({
          userId: user.id,
          email: user.email,
        });

        return { access_token: accessToken };
      }

      throw createHttpError.Unauthorized("Invalid email or password");
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }

  public async getUser(data: GetUserDto): Promise<GetUserResponseDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });

      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw prismaError(error);
      }
      throw createHttpError.InternalServerError("An unexpected error occurred");
    }
  }
}
