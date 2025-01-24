import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordHasherService } from './services/password-hasher.service';
import { LocalStrategy } from './auth-strategies/local-strategy';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from '../config/configuration';
import { JwtStrategy } from './auth-strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.default().jwt.secret,
      signOptions: { expiresIn: config.default().jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasherService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    //make all endpoints protected by jwt
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
