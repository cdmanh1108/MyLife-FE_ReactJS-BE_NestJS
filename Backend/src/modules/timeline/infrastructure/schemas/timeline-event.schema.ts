import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TimelineEventType } from '../../domain/enums/timeline.enum';
export type TimelineEventDocument = HydratedDocument<TimelineEvent>;
@Schema({ timestamps: true, collection: 'timeline_events' })
export class TimelineEvent {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ required: true, index: true }) eventDate: Date;
  @Prop({ enum: TimelineEventType, default: TimelineEventType.LIFE, index: true }) type: TimelineEventType;
  @Prop() location?: string;
  @Prop({ type: [Types.ObjectId], default: [] }) mediaIds: Types.ObjectId[];
  @Prop({ type: [String], default: [] }) tags: string[];
}
export const TimelineEventSchema = SchemaFactory.createForClass(TimelineEvent);
TimelineEventSchema.index({ userId: 1, eventDate: -1 });
