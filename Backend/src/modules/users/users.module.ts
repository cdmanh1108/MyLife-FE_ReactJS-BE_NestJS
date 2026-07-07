import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersService } from './application/users.service';
import { ProfileController } from './presentation/profile.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  controllers: [ProfileController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
