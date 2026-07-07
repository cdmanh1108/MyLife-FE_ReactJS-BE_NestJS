import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, JwtAuthGuard, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
