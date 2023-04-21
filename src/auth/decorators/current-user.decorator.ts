import { AuthRequest } from './../models/user.request';
import { User } from '../../users/schemas/user.schema';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
