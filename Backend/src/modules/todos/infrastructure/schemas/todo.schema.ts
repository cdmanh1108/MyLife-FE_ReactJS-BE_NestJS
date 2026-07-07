import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TodoPriority, TodoStatus } from '../../domain/enums/todo.enum';
export type TodoDocument = HydratedDocument<Todo>;
@Schema({ timestamps: true, collection: 'todos' })
export class Todo {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ enum: TodoStatus, default: TodoStatus.TODO, index: true }) status: TodoStatus;
  @Prop({ enum: TodoPriority, default: TodoPriority.MEDIUM, index: true }) priority: TodoPriority;
  @Prop({ index: true }) dueDate?: Date;
  @Prop() repeatRule?: string;
  @Prop() completedAt?: Date;
}
export const TodoSchema = SchemaFactory.createForClass(Todo);
TodoSchema.index({ userId: 1, dueDate: 1, status: 1 });
