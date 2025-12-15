import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginBodyDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginBodyDTO) {
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
