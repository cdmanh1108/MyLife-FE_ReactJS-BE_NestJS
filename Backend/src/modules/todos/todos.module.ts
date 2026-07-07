import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './infrastructure/schemas/todo.schema';
import { TodosController } from './presentation/todos.controller';
import { TodosService } from './application/todos.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodosModule {}
