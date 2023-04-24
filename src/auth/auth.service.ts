import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { UserDocument } from '../users/schemas/user.schema';
import { UserService } from './../users/users.service';
import { IUserPayload } from './models/user.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
    }
    throw new HttpException(
      'Wrong username or password.',
      HttpStatus.FORBIDDEN,
    );
  }

  login(userData: UserDocument): { token: string; type: 'admin' | 'common' } {
    const payload: IUserPayload = {
      sub: userData._id.toString(),
      username: userData.username,
      type: userData.type,
    };
    const token = this.jwtService.sign(payload);
    return { token, type: userData.type };
  }
}
