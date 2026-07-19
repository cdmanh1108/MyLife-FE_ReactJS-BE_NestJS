import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '../../../../common/enums/currency.enum';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { DateRangeQueryDto } from '../../../../common/dto/date-range-query.dto';
import { TransactionType } from '../../domain/enums/finance.enum';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType }) @IsEnum(TransactionType) type: TransactionType;
  @ApiProperty({ example: 50000 }) @Type(() => Number) @IsNumber() @Min(0) amount: number;
  @ApiProperty({ enum: Currency, default: Currency.VND }) @IsEnum(Currency) currency: Currency;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() walletId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) note?: string;
  @ApiProperty({ example: '2026-07-04T10:00:00.000Z' }) @IsDateString() occurredAt: string;
}
export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: TransactionType }) @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @ApiPropertyOptional({ example: 50000 }) @IsOptional() @Type(() => Number) @IsNumber() @Min(0) amount?: number;
  @ApiPropertyOptional({ enum: Currency }) @IsOptional() @IsEnum(Currency) currency?: Currency;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() walletId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) note?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() occurredAt?: string;
}
export class TransactionQueryDto extends IntersectionType(PaginationQueryDto, DateRangeQueryDto) {
  @ApiPropertyOptional({ enum: TransactionType }) @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() walletId?: string;
}
export class CreateCategoryDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ enum: TransactionType }) @IsEnum(TransactionType) type: TransactionType;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
}
export class UpdateCategoryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional({ enum: TransactionType }) @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
}
export class CreateBudgetDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() categoryId?: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) amount: number;
  @ApiProperty({ enum: Currency }) @IsEnum(Currency) currency: Currency;
  @ApiProperty({ example: '2026-07' }) @IsString() month: string;
}
export class UpdateBudgetDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) amount?: number;
  @ApiPropertyOptional({ enum: Currency }) @IsOptional() @IsEnum(Currency) currency?: Currency;
  @ApiPropertyOptional({ example: '2026-07' }) @IsOptional() @IsString() month?: string;
}
export class TransactionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: TransactionType }) type: TransactionType;
  @ApiProperty() amount: number;
  @ApiProperty({ enum: Currency }) currency: Currency;
  @ApiPropertyOptional() categoryId?: string;
  @ApiPropertyOptional() walletId?: string;
  @ApiPropertyOptional() note?: string;
  @ApiProperty() occurredAt: Date;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
