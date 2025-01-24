import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { LocalAuthGuard } from '../guards/local-auth-guard';
import { Public } from 'src/shared/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(['/login'])
  @Public()
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('/sign-up')
  @Public()
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
}
