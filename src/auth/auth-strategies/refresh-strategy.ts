import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import configuration from 'src/config/configuration';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenService } from '../services/refresh-token.service';

export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.refreshSecret,
    });
  }

  async validate(payload, request) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const hashedToken = await this.authService.generateHash(refreshToken);

    const storedToken = await this.refreshTokenService.findValidRefreshToken(
      payload._id,
      hashedToken,
    );

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { ...payload, refreshToken };
  }
}
