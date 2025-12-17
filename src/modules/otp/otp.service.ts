import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestOtpBodyType, VerifyOtpBodyType } from './otp.type';
import { Otprepository } from './otp.repository';
import moment from 'moment';
import envConfig from 'src/config';
import * as crypto from 'crypto';
import { EmailService } from 'src/common/services/email.service';
import { COMMON_MESSAGE, OTP_MESSAGE } from 'src/common/messages';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepo: Otprepository,
    private readonly emailService: EmailService,
  ) {}
  private hashOtp(otp: string) {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async requestOtp(body: RequestOtpBodyType) {
    const recentOtp = await this.otpRepo.findFirst({
      email: body.email,
      purpose: body.purpose,
      expiresAt: { gt: moment().toDate() },
    });

    if (recentOtp) {
      return { message: OTP_MESSAGE.OTP_REQUESTED_RECENTLY };
    }

    await this.otpRepo.updateMany(
      {
        email: body.email,
        purpose: body.purpose,
        verifiedAt: null,
      },
      {
        verifiedAt: moment().toDate(),
      },
    );

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);

    await this.otpRepo.createOtp({
      email: body.email,
      otpHash,
      purpose: body.purpose,
      expiresAt: moment().add(5, 'minutes').toDate(),
    });

    const { error } = await this.emailService.sendOTP({ email: body.email, code: otp });

    if (error) {
      throw new BadRequestException({
        field: 'code',
        message: OTP_MESSAGE.OTP_SENT_FAILED,
      });
    }

    return { message: OTP_MESSAGE.OTP_SENT_EMAIL_SUCCESS };
  }

  async verifyOtp({ email, code, purpose }: VerifyOtpBodyType) {
    const record = await this.otpRepo.findFirst(
      {
        email,
        purpose,
        verifiedAt: null,
      },
      {
        createdAt: 'desc',
      },
    );

    if (!record) throw new BadRequestException(COMMON_MESSAGE.INVALID('OTP'));
    if (moment().isAfter(record.expiresAt)) throw new BadRequestException(COMMON_MESSAGE.EXPIRED('OTP'));
    if (record.attempts >= Number(envConfig.MAX_ATTEMPTS)) throw new BadRequestException(OTP_MESSAGE.TOO_MANY_REQUESTS);

    const isValid = this.hashOtp(code) === record.otpHash;
    if (!isValid) {
      await this.otpRepo.updateOtp(record.id, {
        attempts: { increment: 1 },
      });

      throw new BadRequestException(COMMON_MESSAGE.INVALID('OTP'));
    }

    await this.otpRepo.updateOtp(record.id, {
      verifiedAt: moment().toDate(),
    });

    return { verified: true };
  }
}
