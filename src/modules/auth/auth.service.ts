import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ForgotPasswordBodyType, LoginBodyType, RegisterBodyType, ResetPasswordBodyType } from './auth.type';
import { AuthRepository } from './auth.repository';
import { HashingService } from 'src/common/services/hashing.service';
import { TokenService } from 'src/common/services/token.service';
import { JwtPayload, RefreshTokenPayload } from 'src/common/types/jwt-payload.type';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from 'generated/prisma';
import { AUTH_MESSAGE, COMMON_MESSAGE } from 'src/common/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenSerivce: TokenService,
    private readonly otpService: OtpService,
  ) {}

  private async generateTokens(payload: JwtPayload, uuid: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenSerivce.signAccessToken(payload),
      this.tokenSerivce.signRefreshToken({
        sub: payload.sub,
        tokenId: uuid,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async loginByUserId(userId: number) {
    const user = await this.authRepo.findUniqueUser({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException(COMMON_MESSAGE.NOT_FOUND('User'));
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const uuid = uuidv4();

    const { accessToken, refreshToken } = await this.generateTokens(payload, uuid);

    await this.authRepo.createRefreshToken({
      id: uuid,
      userId: user.id,
      tokenHash: await this.hashingService.hash(refreshToken),
      expiresAt: moment().add(7, 'days').toDate(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(body: LoginBodyType) {
    const user = await this.authRepo.findUniqueUser({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException(COMMON_MESSAGE.INVALID('Email or password'));
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new UnauthorizedException(COMMON_MESSAGE.INVALID('Email or password'));
    }

    return await this.loginByUserId(user.id);
  }

  async register(body: RegisterBodyType) {
    const exists = await this.authRepo.findUniqueUser({
      email: body.email,
    });

    if (exists) {
      throw new ConflictException(COMMON_MESSAGE.ALREADY_EXISTS('Email'));
    }

    const otpValid = await this.otpService.verifyOtp({
      email: body.email,
      code: body.code,
      purpose: OtpPurpose.REGISTER,
    });

    if (!otpValid.verified) {
      throw new UnauthorizedException(AUTH_MESSAGE.OTP_INVALID);
    }

    const hashedPassword = await this.hashingService.hash(body.password);

    const user = await this.authRepo.createUser({
      email: body.email,
      passwordHash: hashedPassword,
      name: body.name,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const uuid = uuidv4();

    const { accessToken, refreshToken } = await this.generateTokens(payload, uuid);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.tokenSerivce.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(COMMON_MESSAGE.INVALID('Refresh token'));
    }

    const token = await this.authRepo.findRefreshToken({
      id: payload.tokenId,
    });

    if (!token || token.revoked) {
      throw new UnauthorizedException(AUTH_MESSAGE.REFRESH_TOKEN_REVOKED);
    }

    const isValid = await this.hashingService.compare(refreshToken, token.tokenHash);

    if (!isValid) {
      throw new UnauthorizedException(COMMON_MESSAGE.INVALID('Refresh token'));
    }

    await this.authRepo.revokeRefreshToken({
      id: token.id,
    });

    return this.loginByUserId(payload.sub);
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const user = await this.authRepo.findUniqueUser({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException(COMMON_MESSAGE.NOT_FOUND('User'));
    }

    return await this.otpService.requestOtp({
      email: body.email,
      purpose: OtpPurpose.RESET_PASSWORD,
    });
  }

  async resetPassword(body: ResetPasswordBodyType) {
    const user = await this.authRepo.findUniqueUser({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException(COMMON_MESSAGE.NOT_FOUND('User'));
    }

    const otpValid = await this.otpService.verifyOtp({
      email: body.email,
      code: body.code,
      purpose: OtpPurpose.RESET_PASSWORD,
    });

    if (!otpValid.verified) {
      throw new UnauthorizedException(AUTH_MESSAGE.OTP_INVALID);
    }

    const hashedPassword = await this.hashingService.hash(body.newPassword);

    await this.authRepo.updateUser(
      {
        id: user.id,
      },
      {
        passwordHash: hashedPassword,
      },
    );

    await this.authRepo.revokeAllRefreshTokensForUser(user.id);

    return {
      message: 'Password reset successful',
    };
  }

  async logout(userId: number) {
    const refreshToken = await this.authRepo.findFristRefreshToken({
      userId,
      revoked: false
    },{
      expiresAt: 'desc',
    })

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGE.REFRESH_TOKEN_REVOKED);
    }

    await this.authRepo.revokeAllRefreshTokensForUser(userId);

    return {
      message: AUTH_MESSAGE.LOGOUT_SUCCESS,
    };
  }
}
