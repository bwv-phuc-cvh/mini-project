import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import envConfig from 'src/config';
import PlaidVerifyIdentityEmail from 'src/templates/otp';

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }

  async sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'Dental clinic <onboarding@resend.dev>',
      to: [payload.email],
      subject: 'Code OTP',
      react: <PlaidVerifyIdentityEmail validationCode={payload.code} />,
    });
  }
}
