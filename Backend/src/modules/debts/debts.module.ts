import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DebtsService } from './application/debts.service';
import { DebtsController } from './presentation/debts.controller';
import { DebtPerson, DebtPersonSchema } from './infrastructure/schemas/debt-person.schema';
import { DebtRecord, DebtRecordSchema } from './infrastructure/schemas/debt-record.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DebtPerson.name, schema: DebtPersonSchema },
      { name: DebtRecord.name, schema: DebtRecordSchema },
    ]),
  ],
  providers: [DebtsService],
  controllers: [DebtsController],
  exports: [DebtsService],
})
export class DebtsModule {}
