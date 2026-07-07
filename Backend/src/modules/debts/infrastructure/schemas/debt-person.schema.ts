import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type DebtPersonDocument = HydratedDocument<DebtPerson>;
@Schema({ timestamps: true, collection: 'debt_people' })
export class DebtPerson {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop() nickname?: string;
  @Prop() note?: string;
}
export const DebtPersonSchema = SchemaFactory.createForClass(DebtPerson);
DebtPersonSchema.index({ userId: 1, name: 1 });
