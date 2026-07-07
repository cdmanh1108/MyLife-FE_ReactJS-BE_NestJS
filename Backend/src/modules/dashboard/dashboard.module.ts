import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { DebtsModule } from '../debts/debts.module';
import { TodosModule } from '../todos/todos.module';
import { LearningModule } from '../learning/learning.module';
import { JournalModule } from '../journal/journal.module';
import { TimelineModule } from '../timeline/timeline.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
@Module({
  imports: [FinanceModule, DebtsModule, TodosModule, LearningModule, JournalModule, TimelineModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
