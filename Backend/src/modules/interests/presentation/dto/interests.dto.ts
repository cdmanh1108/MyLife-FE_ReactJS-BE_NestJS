import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { InterestType } from '../../domain/enums/interest.enum';
export class CreateInterestDto {
  @ApiProperty({ enum: InterestType }) @IsEnum(InterestType) type: InterestType;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(10) rating?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsUrl() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() externalUrl?: string;
}
export class UpdateInterestDto extends CreateInterestDto {}
export class InterestQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: InterestType }) @IsOptional() @IsEnum(InterestType) type?: InterestType;
  @ApiPropertyOptional() @IsOptional() @IsString() keyword?: string;
}
