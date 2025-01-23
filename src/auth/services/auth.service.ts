import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `User with this email does not exist: ${dto.email}, ${error}`,
      );
    }
  }

  async signUp(dto: SignUpDto) {
    try {
      if (dto?.password && dto?.password !== dto?.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const user = await this.usersService.findUserByEmail(dto?.email);
      if (user) {
        throw new ConflictException(
          `User with this email already exists: ${dto.email}`,
        );
      }

      const hashedPassword = await this.generatePasswordHash(dto.password);

      const newUser: User = {
        name: dto.name,
        email: dto.email,
      };

      await this.usersService.createUser(newUser, hashedPassword);

      return { message: 'User created successfully' };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(`Error signing up: ${error}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userSecret = await this.usersService.findUserSecretByUserId(user._id);

    if (!(await this.validatePassword(password, userSecret.password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  private async generatePasswordHash(password: string): Promise<string> {
    return await this.passwordHasherService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    secretPassword: string,
  ): Promise<boolean> {
    return await this.passwordHasherService.comparePassword(
      password,
      secretPassword,
    );
  }
}
