import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { SignInDto } from '../dto/sign-in.dto';
import { User } from 'src/users/models/user.model';
import { SignUpDto } from '../dto/sign-up.dto';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async signIn(dto: SignInDto) {
    try {
      const user = await this.usersService.findUserByEmail(dto.email);
      const userSecret = await this.usersService.findUserSecretByUserId(
        user._id,
      );
      if (
        !(await this.passwordHasherService.comparePassword(
          dto.password,
          userSecret.password,
        ))
      ) {
        throw new UnauthorizedException('Invalid password');
      }
      return user;
    } catch (error) {
      throw new Error(
        `User with this email does not exist: ${dto.email}, ${error}`,
      );
    }
  }

  async signUp(dto: SignUpDto) {
    try {
      const user = await this.usersService.findUserByEmail(dto?.email);
      if (user) {
        throw new ConflictException(
          `User with this email already exists: ${dto.email}`,
        );
      }

      const hashedPassword = await this.passwordHasherService.hashPassword(
        dto.password,
      );

      const newUser: User = {
        name: dto.name,
        email: dto.email,
      };

      await this.usersService.createUser(newUser, hashedPassword);

      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error signing up: ${error}`);
    }
  }
}
