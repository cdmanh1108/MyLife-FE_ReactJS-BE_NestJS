import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { InterestType } from '../../domain/enums/interest.enum';
export type InterestDocument = HydratedDocument<Interest>;
@Schema({ timestamps: true, collection: 'interests' })
export class Interest {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: InterestType, required: true, index: true }) type: InterestType;
  @Prop({ required: true }) name: string;
  @Prop() description?: string;
  @Prop() reason?: string;
  @Prop({ min: 0, max: 10 }) rating?: number;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() imageUrl?: string;
  @Prop() externalUrl?: string;
}
export const InterestSchema = SchemaFactory.createForClass(Interest);
InterestSchema.index({ userId: 1, type: 1, name: 1 });
