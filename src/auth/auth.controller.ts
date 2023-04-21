import { AuthGuard } from '@nestjs/passport';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthService } from './auth.service';
import { Controller, Post, HttpCode, UseGuards } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Request } from '@nestjs/common/decorators';
import { AuthRequest } from './models/user.request';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiTags('*login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      example: {
        username: 'guilherme',
        password: '12348562',
      },
    },
  })
  async login(@Request() request: AuthRequest) {
    return this.authService.login(request.user);
  }
}
