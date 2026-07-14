import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { DateRangeQueryDto } from '../../../../common/dto/date-range-query.dto';
import { TimelineEventType } from '../../domain/enums/timeline.enum';
export class CreateTimelineEventDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() eventDate: string;
  @ApiProperty({ enum: TimelineEventType }) @IsEnum(TimelineEventType) type: TimelineEventType;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsMongoId({ each: true }) mediaIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
export class UpdateTimelineEventDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() eventDate?: string;
  @ApiPropertyOptional({ enum: TimelineEventType }) @IsOptional() @IsEnum(TimelineEventType) type?: TimelineEventType;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsMongoId({ each: true }) mediaIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
}
export class TimelineQueryDto extends IntersectionType(PaginationQueryDto, DateRangeQueryDto) {
  @ApiPropertyOptional({ enum: TimelineEventType }) @IsOptional() @IsEnum(TimelineEventType) type?: TimelineEventType;
}

export class TimelineEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  eventDate: string;

  @ApiProperty({ enum: TimelineEventType })
  type: TimelineEventType;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional({ type: [String] })
  mediaIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

