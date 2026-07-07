import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({ example: 'Human readable message' })
  message: string;

  @ApiPropertyOptional({ type: Object })
  details?: Record<string, unknown>;

  @ApiProperty({ example: 'e2a60fe2-92c7-4f6c-a750-0a00d1b3ee7d' })
  traceId: string;
}

export class ApiResponseDto<TData = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ nullable: true })
  data: TData | null;

  @ApiProperty({ nullable: true, type: ApiErrorDto })
  error: ApiErrorDto | null;

  @ApiProperty({ type: Object, required: false })
  meta?: Record<string, unknown>;
}
