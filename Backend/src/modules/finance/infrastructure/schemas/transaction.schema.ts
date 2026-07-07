import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Currency } from '../../../../common/enums/currency.enum';
import { TransactionType } from '../../domain/enums/finance.enum';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true, collection: 'finance_transactions' })
export class Transaction {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: TransactionType, required: true, index: true }) type: TransactionType;
  @Prop({ required: true, min: 0 }) amount: number;
  @Prop({ enum: Currency, default: Currency.VND }) currency: Currency;
  @Prop({ type: Types.ObjectId, index: true }) categoryId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, index: true }) walletId?: Types.ObjectId;
  @Prop() note?: string;
  @Prop({ required: true, index: true }) occurredAt: Date;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ userId: 1, occurredAt: -1 });
TransactionSchema.index({ userId: 1, type: 1, occurredAt: -1 });
