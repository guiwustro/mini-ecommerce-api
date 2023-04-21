import { UserService } from './../users/users.service';
import { IUserPayload } from './models/user.payload';
import { UserDocument } from '../users/schemas/user.schema';
import { HttpStatus } from '@nestjs/common/enums';
import { instanceToPlain } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

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
        return instanceToPlain({
          ...user,
        });
      }
    }
    throw new HttpException(
      'Wrong username or password.',
      HttpStatus.FORBIDDEN,
    );
  }

  login(userData: UserDocument): { token: string } {
    const payload: IUserPayload = {
      sub: userData._id,
      username: userData.username,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
