import { PrismaService } from "@/database/prisma.service";
import {
  CreateTokenDto,
  CreateTokenResponseDto,
  ValidateTokenDto,
} from "@/dto/token";
import { hash } from "@/helpers/hash.helper";
import { signRefreshJwt, verifyRefreshJwt } from "@/helpers/jwt.helper";

export class TokenServices {
  private prisma: PrismaService;

  constructor() {
    this.prisma = PrismaService.getInstance();
  }

  public async create(data: CreateTokenDto): Promise<CreateTokenResponseDto> {
    const jwt = signRefreshJwt(data);
    try {
      const refreshToken = await hash(jwt);
      const result = await this.prisma.token.upsert({
        where: { userId: data.userId },
        update: {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        },
        create: {
          token: refreshToken,
          userId: data.userId,
          expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        },
      });

      return result.token;
    } catch (error) {
      throw error;
    }
  }

  public async validate(token: ValidateTokenDto): Promise<boolean> {
    try {
      const isVerified = verifyRefreshJwt(token);
      if (!isVerified) return false;

      const storedToken = await this.prisma.token.findUnique({
        where: { token },
      });

      return !!storedToken;
    } catch (error) {
      throw error;
    }
  }

  public async revoke(token: string): Promise<boolean> {
    try {
      const result = await this.prisma.token.delete({
        where: { token },
      });

      return !!result;
    } catch (error) {
      throw error;
    }
  }
}
