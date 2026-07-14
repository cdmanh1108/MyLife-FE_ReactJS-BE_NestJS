import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { TodosService } from '../application/todos.service';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto, TodoResponseDto } from './dto/todos.dto';
@ApiTags('todos')
@ApiBearerAuth('access-token')
@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  @ApiOkResponse({ type: [TodoResponseDto] })
  list(@CurrentUser() u: AuthenticatedUser, @Query() q: TodoQueryDto) {
    return this.todos.list(u.id, q);
  }

  @Post()
  @ApiCreatedResponse({ type: TodoResponseDto })
  create(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateTodoDto) {
    return this.todos.create(u.id, dto);
  }

  @Get(':id')
  @ApiOkResponse({ type: TodoResponseDto })
  get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.get(u.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TodoResponseDto })
  update(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todos.update(u.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.remove(u.id, id);
  }

  @Post(':id/complete')
  @ApiOkResponse({ type: TodoResponseDto })
  complete(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.complete(u.id, id);
  }

  @Post(':id/reopen')
  @ApiOkResponse({ type: TodoResponseDto })
  reopen(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.reopen(u.id, id);
  }
}
