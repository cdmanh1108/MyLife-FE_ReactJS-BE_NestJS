import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { Goal, GoalDocument } from '../infrastructure/schemas/goal.schema';
import {
  CreateGoalDto,
  CreateMilestoneDto,
  GoalQueryDto,
  UpdateGoalDto,
  UpdateMilestoneDto,
} from '../presentation/dto/goals.dto';
@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private readonly model: Model<GoalDocument>) {}
  async list(userId: string, q: GoalQueryDto) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.status) f.status = q.status;
    const [items, total] = await Promise.all([
      this.model.find(f).sort({ targetDate: 1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      this.model.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  create(userId: string, dto: CreateGoalDto) {
    return this.model.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
    });
  }
  async get(userId: string, id: string) {
    const d = await this.model.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    if (!d) throw new NotFoundException({ code: 'GOAL_NOT_FOUND', message: 'Goal not found' });
    return d;
  }
  async update(userId: string, id: string, dto: UpdateGoalDto) {
    const u: Record<string, unknown> = { ...dto };
    if (dto.targetDate) u.targetDate = new Date(dto.targetDate);
    const d = await this.model.findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, u, { new: true });
    if (!d) throw new NotFoundException({ code: 'GOAL_NOT_FOUND', message: 'Goal not found' });
    return d;
  }
  async remove(userId: string, id: string) {
    await this.model.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async addMilestone(userId: string, id: string, dto: CreateMilestoneDto) {
    const d = await this.get(userId, id);
    d.milestones.push({ title: dto.title, completed: false, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined });
    return d.save();
  }
  async updateMilestone(userId: string, id: string, milestoneId: string, dto: UpdateMilestoneDto) {
    const d = await this.get(userId, id);
    const m = (d.milestones as any).id(milestoneId);
    if (!m) throw new NotFoundException({ code: 'MILESTONE_NOT_FOUND', message: 'Milestone not found' });
    Object.assign(m, { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : m.dueDate });
    return d.save();
  }
  async removeMilestone(userId: string, id: string, milestoneId: string) {
    const d = await this.get(userId, id);
    (d.milestones as any).id(milestoneId)?.deleteOne();
    return d.save();
  }
}
