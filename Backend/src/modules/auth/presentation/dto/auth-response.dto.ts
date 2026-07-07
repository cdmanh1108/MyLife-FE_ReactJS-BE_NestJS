import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/presentation/dto/user-response.dto';

export class TokenPairDto {
  @ApiProperty() accessToken: string;
  @ApiProperty() refreshToken: string;
}

export class AuthResponseDto extends TokenPairDto {
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;
}
