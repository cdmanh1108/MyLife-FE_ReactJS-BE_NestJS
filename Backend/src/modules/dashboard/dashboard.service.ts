import { Injectable } from '@nestjs/common';
import { FinanceService } from '../finance/application/finance.service';
import { DebtsService } from '../debts/application/debts.service';
import { TodosService } from '../todos/application/todos.service';
import { LearningService } from '../learning/application/learning.service';
import { JournalService } from '../journal/application/journal.service';
import { TimelineService } from '../timeline/application/timeline.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly finance: FinanceService,
    private readonly debts: DebtsService,
    private readonly todos: TodosService,
    private readonly learning: LearningService,
    private readonly journal: JournalService,
    private readonly timeline: TimelineService,
  ) {}
  async summary(userId: string) {
    const [finance, debt, todo, learning, latestMood, latestTimelineEvents] = await Promise.all([
      this.finance.monthlyStatistics(userId),
      this.debts.summary(userId),
      this.todos.todayCounts(userId),
      this.learning.statistics(userId),
      this.journal.latestMood(userId),
      this.timeline.latest(userId, 5),
    ]);
    return {
      ...finance,
      debtsIOwe: debt.totalIOwe,
      debtsOwedToMe: debt.totalOwedToMe,
      ...todo,
      learningStreak: learning.learningStreak,
      latestMood,
      latestTimelineEvents,
      recentTransactions: [],
    };
  }
}
