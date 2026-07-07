import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { DateRangeQueryDto } from '../../../../common/dto/date-range-query.dto';
import { MoodType, JournalVisibility } from '../../domain/enums/journal.enum';
export class CreateJournalEntryDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty({ enum: MoodType }) @IsEnum(MoodType) mood: MoodType;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsMongoId({ each: true }) mediaIds?: string[];
  @ApiPropertyOptional({ enum: JournalVisibility })
  @IsOptional()
  @IsEnum(JournalVisibility)
  visibility?: JournalVisibility;
  @ApiProperty() @IsDateString() writtenAt: string;
}
export class UpdateJournalEntryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() content?: string;
  @ApiPropertyOptional({ enum: MoodType }) @IsOptional() @IsEnum(MoodType) mood?: MoodType;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsMongoId({ each: true }) mediaIds?: string[];
  @ApiPropertyOptional({ enum: JournalVisibility })
  @IsOptional()
  @IsEnum(JournalVisibility)
  visibility?: JournalVisibility;
  @ApiPropertyOptional() @IsOptional() @IsDateString() writtenAt?: string;
}
export class JournalQueryDto extends IntersectionType(PaginationQueryDto, DateRangeQueryDto) {
  @ApiPropertyOptional({ enum: MoodType }) @IsOptional() @IsEnum(MoodType) mood?: MoodType;
}
