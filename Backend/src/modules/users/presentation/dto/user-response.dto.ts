import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Locale } from '../../domain/enums/locale.enum';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'cdmanh1108@gmail.com' }) email: string;
  @ApiProperty({ example: 'Mạnh' }) displayName: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
  @ApiProperty({ enum: Locale }) locale: Locale;
  @ApiProperty({ example: 'Asia/Ho_Chi_Minh' }) timezone: string;
  @ApiPropertyOptional() bio?: string;
  @ApiPropertyOptional() avatarUrl?: string;
  @ApiPropertyOptional({ type: Object }) socialLinks?: Record<string, string>;
}
