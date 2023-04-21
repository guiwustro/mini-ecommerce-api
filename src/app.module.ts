import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, AppService],
})
export class AppModule {}
