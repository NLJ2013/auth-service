import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//Added to avoid the magic string 'local' in the controller
export class LocalAuthGuard extends AuthGuard('local') {}
