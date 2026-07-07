import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { TodoPriority, TodoStatus } from '../domain/enums/todo.enum';
import { Todo, TodoDocument } from '../infrastructure/schemas/todo.schema';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from '../presentation/dto/todos.dto';
@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {}
  async list(userId: string, q: TodoQueryDto) {
    const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.status) filter.status = q.status;
    if (q.priority) filter.priority = q.priority;
    const [items, total] = await Promise.all([
      this.todoModel
        .find(filter)
        .sort({ dueDate: 1, createdAt: -1 })
        .skip(skipOf(q.page, q.limit))
        .limit(q.limit)
        .exec(),
      this.todoModel.countDocuments(filter).exec(),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  create(userId: string, dto: CreateTodoDto) {
    return this.todoModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      status: TodoStatus.TODO,
      priority: dto.priority ?? TodoPriority.MEDIUM,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
  }
  async get(userId: string, id: string) {
    const doc = await this.todoModel.findOne({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException({ code: 'TODO_NOT_FOUND', message: 'Todo not found' });
    return doc;
  }
  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.dueDate) update.dueDate = new Date(dto.dueDate);
    const doc = await this.todoModel.findOneAndUpdate({ _id: id, userId }, update, { new: true }).exec();
    if (!doc) throw new NotFoundException({ code: 'TODO_NOT_FOUND', message: 'Todo not found' });
    return doc;
  }
  async remove(userId: string, id: string) {
    await this.todoModel.deleteOne({ _id: id, userId }).exec();
    return { deleted: true };
  }
  async complete(userId: string, id: string) {
    return this.update(userId, id, { status: TodoStatus.DONE } as UpdateTodoDto).then(async (d) => {
      d.completedAt = new Date();
      return d.save();
    });
  }
  async reopen(userId: string, id: string) {
    const doc = await this.todoModel
      .findOneAndUpdate({ _id: id, userId }, { status: TodoStatus.TODO, $unset: { completedAt: 1 } }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'TODO_NOT_FOUND', message: 'Todo not found' });
    return doc;
  }
  async todayCounts(userId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const [today, completed] = await Promise.all([
      this.todoModel.countDocuments({ userId, dueDate: { $gte: todayStart, $lte: todayEnd } }),
      this.todoModel.countDocuments({ userId, status: TodoStatus.DONE, dueDate: { $gte: todayStart, $lte: todayEnd } }),
    ]);
    return { todayTodosCount: today, completedTodosCount: completed };
  }
}
