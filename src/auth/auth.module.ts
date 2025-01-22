import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordHasherService } from './services/password-hasher.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordHasherService],
})
export class AuthModule {}
