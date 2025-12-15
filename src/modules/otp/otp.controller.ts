import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RequestOtpBodyDTO, VerifyOtpBodyDTO } from './otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('request')
  async requestOtp(@Body() requestDto: RequestOtpBodyDTO) {
    return this.otpService.requestOtp(requestDto);
  }

  @Post('verify')
  async verigyOtp(@Body() body: VerifyOtpBodyDTO) {
    return this.otpService.verifyOtp(body);
  }
}
