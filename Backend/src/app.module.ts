import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { TraceIdInterceptor } from './common/interceptors/trace-id.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FinanceModule } from './modules/finance/finance.module';
import { DebtsModule } from './modules/debts/debts.module';
import { TodosModule } from './modules/todos/todos.module';
import { GoalsModule } from './modules/goals/goals.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { JournalModule } from './modules/journal/journal.module';
import { MediaModule } from './modules/media/media.module';
import { InterestsModule } from './modules/interests/interests.module';
import { LearningModule } from './modules/learning/learning.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate: validateEnv }),
    LoggerModule,
    DatabaseModule,
    RedisModule,
    UsersModule,
    AuthModule,
    HealthModule,
    DashboardModule,
    FinanceModule,
    DebtsModule,
    TodosModule,
    GoalsModule,
    TimelineModule,
    JournalModule,
    MediaModule,
    InterestsModule,
    LearningModule,
    NotificationsModule,
    PortfolioModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TraceIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
