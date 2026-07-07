import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelineEvent, TimelineEventSchema } from './infrastructure/schemas/timeline-event.schema';
import { TimelineService } from './application/timeline.service';
import { TimelineController } from './presentation/timeline.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: TimelineEvent.name, schema: TimelineEventSchema }])],
  providers: [TimelineService],
  controllers: [TimelineController],
  exports: [TimelineService],
})
export class TimelineModule {}
