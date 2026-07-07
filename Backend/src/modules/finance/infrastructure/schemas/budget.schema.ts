import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Currency } from '../../../../common/enums/currency.enum';

export type BudgetDocument = HydratedDocument<Budget>;
@Schema({ timestamps: true, collection: 'finance_budgets' })
export class Budget {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop({ type: Types.ObjectId, index: true }) categoryId?: Types.ObjectId;
  @Prop({ required: true, min: 0 }) amount: number;
  @Prop({ enum: Currency, default: Currency.VND }) currency: Currency;
  @Prop({ required: true, index: true }) month: string;
}
export const BudgetSchema = SchemaFactory.createForClass(Budget);
BudgetSchema.index({ userId: 1, month: 1 });
