import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { TimelineEvent, TimelineEventDocument } from '../infrastructure/schemas/timeline-event.schema';
import { CreateTimelineEventDto, TimelineQueryDto, UpdateTimelineEventDto } from '../presentation/dto/timeline.dto';
@Injectable()
export class TimelineService {
  constructor(@InjectModel(TimelineEvent.name) private readonly model: Model<TimelineEventDocument>) {}
  async list(userId: string, q: TimelineQueryDto) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.type) f.type = q.type;
    if (q.fromDate || q.toDate)
      f.eventDate = {
        ...(q.fromDate ? { $gte: new Date(q.fromDate) } : {}),
        ...(q.toDate ? { $lte: new Date(q.toDate) } : {}),
      };
    const [items, total] = await Promise.all([
      this.model.find(f).sort({ eventDate: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      this.model.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  create(userId: string, d: CreateTimelineEventDto) {
    return this.model.create({
      ...d,
      userId: new Types.ObjectId(userId),
      eventDate: new Date(d.eventDate),
      mediaIds: d.mediaIds?.map((x) => new Types.ObjectId(x)) ?? [],
    });
  }
  async get(userId: string, id: string) {
    const d = await this.model.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    if (!d) throw new NotFoundException({ code: 'TIMELINE_EVENT_NOT_FOUND', message: 'Timeline event not found' });
    return d;
  }
  async update(userId: string, id: string, d: UpdateTimelineEventDto) {
    const u: Record<string, unknown> = { ...d };
    if (d.eventDate) u.eventDate = new Date(d.eventDate);
    if (d.mediaIds) u.mediaIds = d.mediaIds.map((x) => new Types.ObjectId(x));
    const doc = await this.model.findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, u, { new: true });
    if (!doc) throw new NotFoundException({ code: 'TIMELINE_EVENT_NOT_FOUND', message: 'Timeline event not found' });
    return doc;
  }
  async remove(userId: string, id: string) {
    await this.model.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async latest(userId: string, limit = 5) {
    return this.model.find({ userId: new Types.ObjectId(userId) }).sort({ eventDate: -1 }).limit(limit);
  }
}
