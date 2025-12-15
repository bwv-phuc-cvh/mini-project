import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otprepository } from './otp.repository';
import { MailModule } from 'src/common/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [OtpController],
  providers: [OtpService, Otprepository],
  exports: [OtpService],
})
export class OtpModule {}
