import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ForgotPasswordDTO, LoginBodyDTO, RegisterDTO, ResetPasswordDTO } from './auth.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import envConfig from 'src/config';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(@Body() body: LoginBodyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @Public()
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies.refreshToken;
    return this.authService.refreshToken(refreshToken);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.forgotPassword(body);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@AuthUser('userId') userId: number,) {

    return this.authService.logout(userId);
  }
}
