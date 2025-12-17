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
      where: uniqueObject,
      data: {
        revoked: true,
      },
    });
  }

  async revokeAllRefreshTokensForUser(userId: number) {
    return this.prismaService.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });
  }

  async updateUser(uniqueObject: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: uniqueObject,
      data,
    });
  }

  async findFristRefreshToken(where: Prisma.RefreshTokenWhereInput, orderBy?: Prisma.RefreshTokenOrderByWithRelationInput) {
    return this.prismaService.refreshToken.findFirst({
      where,
      orderBy
    });
  }
}
