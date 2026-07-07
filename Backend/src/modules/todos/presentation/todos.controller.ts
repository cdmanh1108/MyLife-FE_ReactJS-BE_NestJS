import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { TodosService } from '../application/todos.service';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from './dto/todos.dto';
@ApiTags('todos')
@ApiBearerAuth('access-token')
@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}
  @Get() list(@CurrentUser() u: AuthenticatedUser, @Query() q: TodoQueryDto) {
    return this.todos.list(u.id, q);
  }
  @Post() create(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateTodoDto) {
    return this.todos.create(u.id, dto);
  }
  @Get(':id') get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.get(u.id, id);
  }
  @Patch(':id') update(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todos.update(u.id, id, dto);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.remove(u.id, id);
  }
  @Post(':id/complete') complete(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.complete(u.id, id);
  }
  @Post(':id/reopen') reopen(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.todos.reopen(u.id, id);
  }
}
