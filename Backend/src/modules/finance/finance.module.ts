import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceService } from './application/finance.service';
import { FinanceController } from './presentation/finance.controller';
import { Transaction, TransactionSchema } from './infrastructure/schemas/transaction.schema';
import { FinanceCategory, FinanceCategorySchema } from './infrastructure/schemas/category.schema';
import { Budget, BudgetSchema } from './infrastructure/schemas/budget.schema';
import { Wallet, WalletSchema } from './infrastructure/schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: FinanceCategory.name, schema: FinanceCategorySchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  providers: [FinanceService],
  controllers: [FinanceController],
  exports: [FinanceService],
})
export class FinanceModule {}
