import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Currency } from '../../../../common/enums/currency.enum';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { DateRangeQueryDto } from '../../../../common/dto/date-range-query.dto';
import { DebtDirection, DebtStatus } from '../../domain/enums/debt.enum';

export class CreateDebtPersonDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nickname?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
export class UpdateDebtPersonDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nickname?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
export class CreateDebtRecordDto {
  @ApiProperty() @IsMongoId() personId: string;
  @ApiProperty({ enum: DebtDirection }) @IsEnum(DebtDirection) direction: DebtDirection;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) amount: number;
  @ApiProperty({ enum: Currency }) @IsEnum(Currency) currency: Currency;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) note?: string;
  @ApiProperty() @IsDateString() occurredAt: string;
}
export class UpdateDebtRecordDto {
  @ApiPropertyOptional() @IsOptional() @IsMongoId() personId?: string;
  @ApiPropertyOptional({ enum: DebtDirection }) @IsOptional() @IsEnum(DebtDirection) direction?: DebtDirection;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) amount?: number;
  @ApiPropertyOptional({ enum: Currency }) @IsOptional() @IsEnum(Currency) currency?: Currency;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() occurredAt?: string;
  @ApiPropertyOptional({ enum: DebtStatus }) @IsOptional() @IsEnum(DebtStatus) status?: DebtStatus;
}
export class DebtRecordQueryDto extends IntersectionType(PaginationQueryDto, DateRangeQueryDto) {
  @ApiPropertyOptional() @IsOptional() @IsMongoId() personId?: string;
  @ApiPropertyOptional({ enum: DebtDirection }) @IsOptional() @IsEnum(DebtDirection) direction?: DebtDirection;
  @ApiPropertyOptional({ enum: DebtStatus }) @IsOptional() @IsEnum(DebtStatus) status?: DebtStatus;
}
export class SettlementPersonDto {
  @ApiProperty() personId: string;
  @ApiProperty() personName: string;
  @ApiProperty({ enum: DebtDirection }) direction: DebtDirection;
  @ApiProperty() amount: number;
  @ApiProperty({ enum: Currency }) currency: Currency;
}
export class SettlementResponseDto {
  @ApiProperty() totalIOwe: number;
  @ApiProperty() totalOwedToMe: number;
  @ApiProperty() netBalance: number;
  @ApiProperty({ type: [SettlementPersonDto] }) byPerson: SettlementPersonDto[];
}

export class DebtPersonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class DebtRecordResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  personId: string;

  @ApiProperty({ enum: DebtDirection })
  direction: DebtDirection;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: Currency })
  currency: Currency;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  occurredAt: string;

  @ApiProperty({ enum: DebtStatus })
  status: DebtStatus;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}


