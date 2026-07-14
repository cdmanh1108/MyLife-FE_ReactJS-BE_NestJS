
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardLatestMoodDto {
  @ApiProperty({ example: 'HAPPY' })
  mood: string;

  @ApiProperty({ example: '2026-07-14T00:00:00.000Z' })
  occurredAt: string;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ example: 15000000 })
  balance: number;

  @ApiProperty({ example: 20000000 })
  monthlyIncome: number;

  @ApiProperty({ example: 5000000 })
  monthlyExpense: number;

  @ApiProperty({ example: 'VND' })
  currency: string;

  @ApiProperty({ example: 1000000 })
  debtsIOwe: number;

  @ApiProperty({ example: 500000 })
  debtsOwedToMe: number;

  @ApiProperty({ example: 5 })
  todayCount: number;

  @ApiProperty({ example: 3 })
  doneToday: number;

  @ApiProperty({ example: 7 })
  learningStreak: number;

  @ApiProperty({ example: 'TOPIK' })
  learningLanguage: string;

  @ApiPropertyOptional({ type: DashboardLatestMoodDto })
  latestMood?: DashboardLatestMoodDto;

  @ApiProperty({ example: [] })
  latestTimelineEvents: any[];

  @ApiProperty({ example: [] })
  recentTransactions: any[];
}
