import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Object> {
    try {
      const userMatchedWithUsername = await this.userModel.exists({
        username: createUserDto.username,
      });

      const userMatchedWithAddress = await this.userModel.exists({
        address: createUserDto.address,
      });

      if (userMatchedWithUsername) {
        return {
          error: true,
          body: 'User already exists! try again with another username',
        };
      }
      if (userMatchedWithAddress) {
        return {
          error: true,
          body: 'Account already exists! try again with another account',
        };
      }
      const createUserModel = new this.userModel(createUserDto);
      return {
        error: false,
        body: await createUserModel.save(),
      };
    } catch (e) {
      Logger.error('Error while creating user: ', e);
      throw new InternalServerErrorException(
        'Server error',
        'Error while creating user',
      );
    }
  }

  async getUser(address: string): Promise<any> {
    try {
      const user = await this.userModel.find({
        address: address,
      });
      if (user.length < 0) {
        return {
          error: true,
          body: 'User not found with your account!',
        };
      }
      return {
        error: false,
        body: user[0],
      };
    } catch (e) {
      Logger.error('Error while gettting user: ', e);
      throw new InternalServerErrorException(
        'Server error',
        'Error while getting user',
      );
    }
  }
}
