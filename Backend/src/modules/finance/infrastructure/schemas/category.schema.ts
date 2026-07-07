import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionType } from '../../domain/enums/finance.enum';

export type FinanceCategoryDocument = HydratedDocument<FinanceCategory>;
@Schema({ timestamps: true, collection: 'finance_categories' })
export class FinanceCategory {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop({ enum: TransactionType, required: true }) type: TransactionType;
  @Prop() icon?: string;
  @Prop() color?: string;
}
export const FinanceCategorySchema = SchemaFactory.createForClass(FinanceCategory);
FinanceCategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });
