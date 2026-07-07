import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GoalStatus } from '../../domain/enums/goal.enum';
export type GoalDocument = HydratedDocument<Goal>;
@Schema({ _id: true })
export class Milestone {
  @Prop({ required: true }) title: string;
  @Prop({ default: false }) completed: boolean;
  @Prop() dueDate?: Date;
}
export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
@Schema({ timestamps: true, collection: 'goals' })
export class Goal {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ enum: GoalStatus, default: GoalStatus.NOT_STARTED, index: true }) status: GoalStatus;
  @Prop({ default: 0, min: 0, max: 100 }) progress: number;
  @Prop() targetDate?: Date;
  @Prop({ type: [MilestoneSchema], default: [] }) milestones: Milestone[];
}
export const GoalSchema = SchemaFactory.createForClass(Goal);
GoalSchema.index({ userId: 1, status: 1, targetDate: 1 });
