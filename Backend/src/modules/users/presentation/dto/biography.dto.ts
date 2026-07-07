import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class BiographyDto {
  @ApiProperty({ example: 'Software Engineer Fullstack, UIT student, builder of MyLife OS.' })
  @IsString()
  @MaxLength(5000)
  content: string;
}
