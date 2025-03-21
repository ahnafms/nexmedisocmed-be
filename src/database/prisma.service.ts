import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
  private static instance: PrismaClient;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PrismaClient();
    }
    return this.instance;
  }
}
