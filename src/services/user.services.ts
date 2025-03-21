import {
  CreateUserDto,
  GetUserDto,
  GetUserResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
} from "@/dto/user";
import { PrismaService } from "../database/prisma.service";
import { compare, hash } from "@/helpers/hash.helper";
import { signAccessJwt } from "@/helpers/jwt.helper";
import { TokenServices } from "./token.service";

export class UserServices {
  private prisma: PrismaService;
  private tokenService: TokenServices;

  constructor(tokenService: TokenServices = new TokenServices()) {
    this.prisma = PrismaService.getInstance();
    this.tokenService = tokenService;
  }

  public async createUser(data: CreateUserDto): Promise<GetUserResponseDto> {
    try {
      const hashedPassword = await hash(data.password);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async loginUser({
    email,
    password,
  }: LoginUserDto): Promise<LoginUserResponseDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.password) return null;

      const isMatch = await compare(password, user.password);

      if (isMatch) {
        const accessToken = signAccessJwt({
          userId: user.id,
          email: user.email,
        });
        const refreshToken = await this.tokenService.create({
          userId: user.id,
          email: user.email,
        });

        return { access_token: accessToken, refresh_token: refreshToken };
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  public async getUser(data: GetUserDto): Promise<GetUserResponseDto | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });

      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}
