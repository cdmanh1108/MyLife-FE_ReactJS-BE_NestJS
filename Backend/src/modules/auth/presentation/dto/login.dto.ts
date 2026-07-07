import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'cdmanh1108@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '@Manh11082004' })
  @IsString()
  @MinLength(8)
  password: string;
}
