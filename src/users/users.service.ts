import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import {
  createErrorResponse,
  updateErrorResponse,
} from 'src/common/methods/errors';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    createUserDto: Partial<CreateUserDto>,
  ): Promise<Partial<User> | null> {
    try {
      const newUser = await this.userModel.create(createUserDto);

      return this.sanitizeUser(newUser);
    } catch (error) {
      return createErrorResponse('User', error);
    }
  }

  async findAll(): Promise<Partial<User>[]> {
    return await this.userModel
      .find()
      .select('email firstName lastName profilePicture');
  }

  async findOne(id: string): Promise<Partial<User> | null> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return this.sanitizeUser(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User> | null> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        { ...updateUserDto },
        { new: true },
      );

      return this.sanitizeUser(updatedUser);
    } catch (error) {
      return updateErrorResponse('User', error);
    }
  }

  async incrementSessionVersion(userId: string): Promise<Partial<User> | null> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $inc: { sessionVersion: 1 } },
        { new: true },
      );

      if (!updatedUser) throw new NotFoundException('User not found');

      return this.sanitizeUser(updatedUser);
    } catch (error) {
      return updateErrorResponse('User', error);
    }
  }

  async remove(id: string): Promise<Partial<User> | null> {
    const removedUser = await this.userModel.findByIdAndDelete(id);

    return this.sanitizeUser(removedUser);
  }

  private sanitizeUser(user: User | null): Partial<User> | null {
    if (!user) return null;

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };
  }
}
