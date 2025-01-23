import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordHasherService } from './services/password-hasher.service';
import { LocalStrategy } from './auth-strategies/local-strategy';
import { LocalAuthGuard } from './guards/local-auth-guard';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasherService,
    LocalStrategy,
    LocalAuthGuard,
  ],
})
export class AuthModule {}
