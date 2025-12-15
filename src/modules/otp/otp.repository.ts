import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Otprepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findFirst(where: Prisma.EmailOtpWhereInput) {
    return this.prismaService.emailOtp.findFirst({
      where,
    });
  }

  async createOtp(data: Prisma.EmailOtpCreateInput) {
    return this.prismaService.emailOtp.create({
      data,
    });
  }

  async updateOtp(id: number, data: Prisma.EmailOtpUpdateInput) {
    return this.prismaService.emailOtp.update({
      where: { id },
      data,
    });
  }
}
