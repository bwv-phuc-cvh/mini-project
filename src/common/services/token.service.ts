import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from 'src/config';
import { uuidv4 } from 'zod';
import { JwtPayload, RefreshTokenPayload } from '../types/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(
      { ...payload, uuid: uuidv4() },
      {
        algorithm: 'HS256',
        secret: envConfig.ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as any,
      },
    );
  }

  signRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.signAsync(
      { ...payload, uuid: uuidv4() },
      {
        algorithm: 'HS256',
        secret: envConfig.REFRESH_TOKEN_SECRET,
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as any,
      },
    );
  }

  verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    });
  }
}
