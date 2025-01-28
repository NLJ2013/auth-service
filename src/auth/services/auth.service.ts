import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/user.model';
import { SignUpDto } from '../dto/sign-up.dto';
import { HasherService } from './hasher.service';
import { JwtService } from '@nestjs/jwt';
import * as config from '../../config/configuration';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hasherService: HasherService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async signIn(user: User) {
    try {
      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: await this.generateRefreshToken(user),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occurred signing in: ${error}`,
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

      const hashedPassword = await this.generateHash(dto.password);

      const newUser: Partial<User> = {
        name: dto.name,
        email: dto.email,
      };

      const createdUser = await this.usersService.createUser(
        newUser,
        hashedPassword,
      );

      return this.signIn(createdUser);
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

  async refreshToken(user: User, oldRefreshToken: string) {
    try {
      await this.refreshTokenService.revokeRefreshToken(oldRefreshToken);
      const newRefreshToken = await this.generateRefreshToken(user);
      const payload = { email: user.email, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occurred refreshing token: ${error}`,
      );
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userSecret = await this.usersService.findUserSecretByUserId(user._id);

    if (!(await this.validatePassword(password, userSecret.password))) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }

  async generateHash(password: string): Promise<string> {
    return await this.hasherService.hash(password);
  }

  private async validatePassword(
    password: string,
    secretPassword: string,
  ): Promise<boolean> {
    return await this.hasherService.comparePassword(password, secretPassword);
  }

  async generateRefreshToken(user: Partial<User>): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: config.default().jwt.refreshExpiresIn,
      secret: config.default().jwt.refreshSecret,
    });

    try {
      await this.refreshTokenService.saveRefreshToken({
        userId: user._id,
        tokenHash: await this.generateHash(refreshToken),
        expiresAt: new Date(
          Number(Date.now()) +
            Number(config.default().jwt.refreshTokenExpiresInNumber) *
              24 *
              60 *
              60 *
              1000,
        ),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occurred generating refresh token: ${error}`,
      );
    }

    return refreshToken;
  }
}
