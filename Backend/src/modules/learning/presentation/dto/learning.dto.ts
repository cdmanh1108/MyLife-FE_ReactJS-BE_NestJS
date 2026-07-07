import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { FlashcardStatus, LearningLanguage, LearningSkill, StudyPlanStatus } from '../../domain/enums/learning.enum';
export class LearningQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: LearningLanguage }) @IsOptional() @IsEnum(LearningLanguage) language?: LearningLanguage;
  @ApiPropertyOptional() @IsOptional() @IsString() keyword?: string;
}
export class CreateVocabularyDto {
  @ApiProperty({ enum: LearningLanguage }) @IsEnum(LearningLanguage) language: LearningLanguage;
  @ApiProperty() @IsString() word: string;
  @ApiProperty() @IsString() meaning: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pronunciation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() example?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() level?: string;
}
export class UpdateVocabularyDto extends CreateVocabularyDto {}
export class CreateFlashcardDto {
  @ApiProperty({ enum: LearningLanguage }) @IsEnum(LearningLanguage) language: LearningLanguage;
  @ApiProperty() @IsString() front: string;
  @ApiProperty() @IsString() back: string;
}
export class UpdateFlashcardDto {
  @ApiPropertyOptional() @IsOptional() @IsString() front?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() back?: string;
  @ApiPropertyOptional({ enum: FlashcardStatus }) @IsOptional() @IsEnum(FlashcardStatus) status?: FlashcardStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() nextReviewAt?: string;
}
export class ReviewFlashcardDto {
  @ApiProperty({ enum: FlashcardStatus }) @IsEnum(FlashcardStatus) status: FlashcardStatus;
  @ApiPropertyOptional() @IsOptional() @IsDateString() nextReviewAt?: string;
}
export class CreateMockTestDto {
  @ApiProperty({ enum: LearningLanguage }) @IsEnum(LearningLanguage) language: LearningLanguage;
  @ApiProperty() @IsString() testName: string;
  @ApiProperty() @IsDateString() testDate: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() listeningScore?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() readingScore?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() writingScore?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() speakingScore?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() totalScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
export class UpdateMockTestDto extends CreateMockTestDto {}
export class CreateStudyPlanDto {
  @ApiProperty({ enum: LearningLanguage }) @IsEnum(LearningLanguage) language: LearningLanguage;
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetScore?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) dailyMinutes?: number;
}
export class UpdateStudyPlanDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() startDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() endDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetScore?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() dailyMinutes?: number;
  @ApiPropertyOptional({ enum: StudyPlanStatus }) @IsOptional() @IsEnum(StudyPlanStatus) status?: StudyPlanStatus;
}
export class CreateStudyLogDto {
  @ApiProperty({ enum: LearningLanguage }) @IsEnum(LearningLanguage) language: LearningLanguage;
  @ApiProperty({ enum: LearningSkill }) @IsEnum(LearningSkill) skill: LearningSkill;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(1) minutes: number;
  @ApiProperty() @IsDateString() studiedAt: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
