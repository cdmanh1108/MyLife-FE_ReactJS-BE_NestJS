import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Currency } from '../../../../common/enums/currency.enum';
import { DebtDirection, DebtStatus } from '../../domain/enums/debt.enum';
export type DebtRecordDocument = HydratedDocument<DebtRecord>;
@Schema({ timestamps: true, collection: 'debt_records' })
export class DebtRecord {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true }) personId: Types.ObjectId;
  @Prop({ enum: DebtDirection, required: true, index: true }) direction: DebtDirection;
  @Prop({ required: true, min: 0 }) amount: number;
  @Prop({ enum: Currency, default: Currency.VND }) currency: Currency;
  @Prop() note?: string;
  @Prop({ required: true, index: true }) occurredAt: Date;
  @Prop({ enum: DebtStatus, default: DebtStatus.OPEN, index: true }) status: DebtStatus;
  @Prop() settledAt?: Date;
}
export const DebtRecordSchema = SchemaFactory.createForClass(DebtRecord);
DebtRecordSchema.index({ userId: 1, personId: 1, status: 1 });
