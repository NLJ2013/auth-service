import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { LocalAuthGuard } from '../guards/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['/login'])
  @UseGuards(LocalAuthGuard)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('/sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
}
