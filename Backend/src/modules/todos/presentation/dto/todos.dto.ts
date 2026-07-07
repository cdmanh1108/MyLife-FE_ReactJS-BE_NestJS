import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { TodoPriority, TodoStatus } from '../../domain/enums/todo.enum';
export class CreateTodoDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repeatRule?: string;
}
export class UpdateTodoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: TodoStatus }) @IsOptional() @IsEnum(TodoStatus) status?: TodoStatus;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dueDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repeatRule?: string;
}
export class TodoQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: TodoStatus }) @IsOptional() @IsEnum(TodoStatus) status?: TodoStatus;
  @ApiPropertyOptional({ enum: TodoPriority }) @IsOptional() @IsEnum(TodoPriority) priority?: TodoPriority;
}
