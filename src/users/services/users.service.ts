import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (error) {
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

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
}
