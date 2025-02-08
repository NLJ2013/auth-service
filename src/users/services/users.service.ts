import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserSecret } from '../models/user-secret.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSecret.name) private userSecretModel: Model<UserSecret>,
  ) {}

  async createUser(user: Partial<User>, hashedPassword: string): Promise<User> {
    try {
      const foundUser = await this.userModel
        .findOne({ email: user.email })
        .lean();
      if (foundUser) {
        throw new Error(`User with this email already exists: ${user.email}`);
      }

      const savedUser = await this.userModel.create(user);

      await this.userSecretModel.create({
        userId: savedUser._id,
        password: hashedPassword,
      });

      return savedUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      this.logger.error(`Error creating user: ${error}`);
      throw new Error(error);
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).lean();
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async findUserSecretByUserId(userId: string): Promise<UserSecret> {
    return this.userSecretModel.findOne({ userId });
  }
}
