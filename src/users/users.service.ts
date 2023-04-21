import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const userAlreadyExists = await this.findByUsername(createUserDto.username);

    if (userAlreadyExists) {
      throw new HttpException(
        'Username already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = (await this.userModel.create(data)).toObject();

    return plainToInstance(User, user);
  }

  findAll(): any {
    const users = this.userModel.find().lean();
    return plainToInstance(User, users);
  }

  findOne(id: number) {
    const user = this.userModel.findOne({
      where: {
        id,
      },
      relations: {
        events: true,
      },
    });
    return plainToInstance(User, user);
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
}
