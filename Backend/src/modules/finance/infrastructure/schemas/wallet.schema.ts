import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Currency } from '../../../../common/enums/currency.enum';
import { WalletType } from '../../domain/enums/finance.enum';

export type WalletDocument = HydratedDocument<Wallet>;
@Schema({ timestamps: true, collection: 'finance_wallets' })
export class Wallet {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop({ enum: WalletType, default: WalletType.CASH }) type: WalletType;
  @Prop({ enum: Currency, default: Currency.VND }) currency: Currency;
  @Prop({ default: 0 }) initialBalance: number;
}
export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({ userId: 1, name: 1 }, { unique: true });
