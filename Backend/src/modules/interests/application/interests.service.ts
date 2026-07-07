import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { Interest, InterestDocument } from '../infrastructure/schemas/interest.schema';
import { CreateInterestDto, InterestQueryDto, UpdateInterestDto } from '../presentation/dto/interests.dto';
@Injectable()
export class InterestsService {
  constructor(@InjectModel(Interest.name) private readonly model: Model<InterestDocument>) {}
  async list(userId: string, q: InterestQueryDto) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.type) f.type = q.type;
    if (q.keyword) f.name = { $regex: q.keyword, $options: 'i' };
    const [items, total] = await Promise.all([
      this.model.find(f).sort({ createdAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      this.model.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  create(userId: string, d: CreateInterestDto) {
    return this.model.create({ ...d, userId: new Types.ObjectId(userId), tags: d.tags ?? [] });
  }
  async get(userId: string, id: string) {
    const d = await this.model.findOne({ _id: id, userId });
    if (!d) throw new NotFoundException({ code: 'INTEREST_NOT_FOUND', message: 'Interest not found' });
    return d;
  }
  async update(userId: string, id: string, d: UpdateInterestDto) {
    const doc = await this.model.findOneAndUpdate({ _id: id, userId }, d, { new: true });
    if (!doc) throw new NotFoundException({ code: 'INTEREST_NOT_FOUND', message: 'Interest not found' });
    return doc;
  }
  async remove(userId: string, id: string) {
    await this.model.deleteOne({ _id: id, userId });
    return { deleted: true };
  }
}
