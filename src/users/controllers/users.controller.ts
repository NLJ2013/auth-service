import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
