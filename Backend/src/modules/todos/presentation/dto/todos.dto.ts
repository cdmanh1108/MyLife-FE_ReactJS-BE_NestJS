import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { TodoPriority, TodoStatus } from '../../domain/enums/todo.enum';

export class CreateTodoDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repeatRule?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() order?: number;
}

export class UpdateTodoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: TodoStatus }) @IsOptional() @IsEnum(TodoStatus) status?: TodoStatus;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repeatRule?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() order?: number;
}

export class TodoQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: TodoStatus }) @IsOptional() @IsEnum(TodoStatus) status?: TodoStatus;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
}

export class TodoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: TodoStatus })
  status: TodoStatus;

  @ApiProperty({ enum: TodoPriority })
  priority: TodoPriority;

  @ApiPropertyOptional()
  dueDate?: string;

  @ApiPropertyOptional()
  repeatRule?: string;

  @ApiPropertyOptional()
  completedAt?: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

