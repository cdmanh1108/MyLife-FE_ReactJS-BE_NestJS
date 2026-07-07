import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Goal, GoalSchema } from './infrastructure/schemas/goal.schema';
import { GoalsService } from './application/goals.service';
import { GoalsController } from './presentation/goals.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }])],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
