
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import {JwtStrategy} from './jwt.strategy.js';


@Module({
  imports: [
    UsersModule,
    PassportModule.register({
  defaultStrategy: 'jwt',
}),
    JwtModule.register({
      secret: 'my-secret-key',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService ,JwtStrategy],
})
export class AuthModule {}
