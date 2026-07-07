import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Locale } from '../../domain/enums/locale.enum';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Mạnh' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @ApiPropertyOptional({ enum: Locale })
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;

  @ApiPropertyOptional({ example: 'Asia/Ho_Chi_Minh' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
