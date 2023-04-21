import { UserModule } from './../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy.';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { LoginValidationMiddleware } from './middlewares/login-validation.middleware';

// dotenv.config();

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('login');
  }
}
