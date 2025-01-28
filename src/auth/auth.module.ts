import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { HasherService } from './services/hasher.service';
import { LocalStrategy } from './auth-strategies/local-strategy';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from '../config/configuration';
import { JwtStrategy } from './auth-strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { APP_GUARD } from '@nestjs/core';
import { RefreshTokenService } from './services/refresh-token.service';
import { RefreshStrategy } from './auth-strategies/refresh-strategy';
import { RefreshAuthGuard } from './guards/refresh-auth-guard';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      secret: config.default().jwt.secret,
      signOptions: { expiresIn: config.default().jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HasherService,
    RefreshTokenService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    RefreshStrategy,
    RefreshAuthGuard,
    //make all endpoints protected by jwt
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RefreshTokenService,
  ],
})
export class AuthModule {}
