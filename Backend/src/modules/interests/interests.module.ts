import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Interest, InterestSchema } from './infrastructure/schemas/interest.schema';
import { InterestsService } from './application/interests.service';
import { InterestsController } from './presentation/interests.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: Interest.name, schema: InterestSchema }])],
  providers: [InterestsService],
  controllers: [InterestsController],
})
export class InterestsModule {}
