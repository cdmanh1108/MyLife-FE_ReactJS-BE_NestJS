import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { GoalStatus } from '../../domain/enums/goal.enum';
export class CreateGoalDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
}
export class UpdateGoalDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: GoalStatus }) @IsOptional() @IsEnum(GoalStatus) status?: GoalStatus;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100) progress?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() targetDate?: string;
}
export class GoalQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: GoalStatus }) @IsOptional() @IsEnum(GoalStatus) status?: GoalStatus;
}
export class CreateMilestoneDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}
export class UpdateMilestoneDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
}
