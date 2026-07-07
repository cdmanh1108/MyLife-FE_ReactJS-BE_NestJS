import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { JournalEntry, JournalEntryDocument } from '../infrastructure/schemas/journal-entry.schema';
import { CreateJournalEntryDto, JournalQueryDto, UpdateJournalEntryDto } from '../presentation/dto/journal.dto';
@Injectable()
export class JournalService {
  constructor(@InjectModel(JournalEntry.name) private readonly model: Model<JournalEntryDocument>) {}
  async list(userId: string, q: JournalQueryDto) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.mood) f.mood = q.mood;
    if (q.fromDate || q.toDate)
      f.writtenAt = {
        ...(q.fromDate ? { $gte: new Date(q.fromDate) } : {}),
        ...(q.toDate ? { $lte: new Date(q.toDate) } : {}),
      };
    const [items, total] = await Promise.all([
      this.model.find(f).sort({ writtenAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      this.model.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  create(userId: string, d: CreateJournalEntryDto) {
    return this.model.create({
      ...d,
      userId: new Types.ObjectId(userId),
      writtenAt: new Date(d.writtenAt),
      mediaIds: d.mediaIds?.map((x) => new Types.ObjectId(x)) ?? [],
    });
  }
  async get(userId: string, id: string) {
    const d = await this.model.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    if (!d) throw new NotFoundException({ code: 'JOURNAL_ENTRY_NOT_FOUND', message: 'Journal entry not found' });
    return d;
  }
  async update(userId: string, id: string, d: UpdateJournalEntryDto) {
    const u: Record<string, unknown> = { ...d };
    if (d.writtenAt) u.writtenAt = new Date(d.writtenAt);
    if (d.mediaIds) u.mediaIds = d.mediaIds.map((x) => new Types.ObjectId(x));
    const doc = await this.model.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      u,
      { new: true },
    );
    if (!doc) throw new NotFoundException({ code: 'JOURNAL_ENTRY_NOT_FOUND', message: 'Journal entry not found' });
    return doc;
  }
  async remove(userId: string, id: string) {
    await this.model.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async moodStatistics(userId: string) {
    return this.model.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }
  async latestMood(userId: string) {
    const d = await this.model.findOne({ userId: new Types.ObjectId(userId) }).sort({ writtenAt: -1 });
    return d?.mood ?? null;
  }
}
