import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUniqueUser(uniqueObject: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: uniqueObject,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
    });
  }

  async createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput) {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(uniqueObject: Prisma.RefreshTokenWhereUniqueInput) {
    return this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
    });
  }

  async revokeRefreshToken(uniqueObject: Prisma.RefreshTokenWhereUniqueInput) {
    return this.prismaService.refreshToken.update({
      where: {
        id: uniqueObject.id,
      },
      data: {
        revoked: true,
      },
    });
  }
}
