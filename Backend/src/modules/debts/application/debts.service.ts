import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { DebtDirection, DebtStatus } from '../domain/enums/debt.enum';
import { DebtPerson, DebtPersonDocument } from '../infrastructure/schemas/debt-person.schema';
import { DebtRecord, DebtRecordDocument } from '../infrastructure/schemas/debt-record.schema';
import {
  CreateDebtPersonDto,
  CreateDebtRecordDto,
  DebtRecordQueryDto,
  UpdateDebtPersonDto,
  UpdateDebtRecordDto,
} from '../presentation/dto/debts.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(DebtPerson.name) private readonly personModel: Model<DebtPersonDocument>,
    @InjectModel(DebtRecord.name) private readonly recordModel: Model<DebtRecordDocument>,
  ) {}
  listPeople(userId: string) {
    return this.personModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ name: 1 })
      .exec();
  }
  createPerson(userId: string, dto: CreateDebtPersonDto) {
    return this.personModel.create({ ...dto, userId: new Types.ObjectId(userId) });
  }
  async getPerson(userId: string, id: string) {
    const doc = await this.personModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'DEBT_PERSON_NOT_FOUND', message: 'Debt person not found' });
    return doc;
  }
  async updatePerson(userId: string, id: string, dto: UpdateDebtPersonDto) {
    const doc = await this.personModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'DEBT_PERSON_NOT_FOUND', message: 'Debt person not found' });
    return doc;
  }
  async deletePerson(userId: string, id: string) {
    await this.personModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    return { deleted: true };
  }

  async listRecords(userId: string, query: DebtRecordQueryDto) {
    const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (query.personId) filter.personId = new Types.ObjectId(query.personId);
    if (query.status) filter.status = query.status;
    if (query.direction) filter.direction = query.direction;
    if (query.fromDate || query.toDate) {
      filter.occurredAt = {
        ...(query.fromDate ? { $gte: new Date(query.fromDate) } : {}),
        ...(query.toDate ? { $lte: new Date(query.toDate) } : {}),
      };
    }
    const [items, total] = await Promise.all([
      this.recordModel
        .find(filter)
        .sort({ occurredAt: -1 })
        .skip(skipOf(query.page, query.limit))
        .limit(query.limit)
        .exec(),
      this.recordModel.countDocuments(filter).exec(),
    ]);
    return paginated(items, query.page, query.limit, total);
  }
  createRecord(userId: string, dto: CreateDebtRecordDto) {
    return this.recordModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      personId: new Types.ObjectId(dto.personId),
      occurredAt: new Date(dto.occurredAt),
      status: DebtStatus.OPEN,
    });
  }
  async getRecord(userId: string, id: string) {
    const doc = await this.recordModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'DEBT_RECORD_NOT_FOUND', message: 'Debt record not found' });
    return doc;
  }
  async updateRecord(userId: string, id: string, dto: UpdateDebtRecordDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.personId) update.personId = new Types.ObjectId(dto.personId);
    if (dto.occurredAt) update.occurredAt = new Date(dto.occurredAt);
    const doc = await this.recordModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, update, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'DEBT_RECORD_NOT_FOUND', message: 'Debt record not found' });
    return doc;
  }
  async deleteRecord(userId: string, id: string) {
    await this.recordModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    return { deleted: true };
  }
  async settleRecord(userId: string, id: string) {
    return this.updateRecord(userId, id, { status: DebtStatus.SETTLED } as UpdateDebtRecordDto);
  }
  async bulkSettle(userId: string) {
    const res = await this.recordModel
      .updateMany(
        { userId: new Types.ObjectId(userId), status: DebtStatus.OPEN },
        { status: DebtStatus.SETTLED, settledAt: new Date() },
      )
      .exec();
    return { modified: res.modifiedCount };
  }

  async summary(userId: string) {
    return this.calculate(userId);
  }
  async calculate(userId: string) {
    const rows = await this.recordModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), status: DebtStatus.OPEN } },
      {
        $group: {
          _id: { personId: '$personId', direction: '$direction', currency: '$currency' },
          total: { $sum: '$amount' },
        },
      },
    ]);
    const people = await this.personModel.find({ userId: new Types.ObjectId(userId) }).exec();
    const nameMap = new Map(people.map((p) => [p._id.toString(), p.name]));
    const netByPerson = new Map<string, { amount: number; currency: string; personId: string; personName: string }>();
    let totalIOwe = 0;
    let totalOwedToMe = 0;
    for (const row of rows) {
      const personId = row._id.personId.toString();
      const direction = row._id.direction as DebtDirection;
      const signed = direction === DebtDirection.OWES_ME ? row.total : -row.total;
      if (direction === DebtDirection.OWES_ME) totalOwedToMe += row.total;
      else totalIOwe += row.total;
      const cur = netByPerson.get(personId) ?? {
        amount: 0,
        currency: row._id.currency,
        personId,
        personName: nameMap.get(personId) ?? 'Unknown',
      };
      cur.amount += signed;
      netByPerson.set(personId, cur);
    }
    const byPerson = Array.from(netByPerson.values())
      .filter((v) => v.amount !== 0)
      .map((v) => ({
        personId: v.personId,
        personName: v.personName,
        direction: v.amount > 0 ? DebtDirection.OWES_ME : DebtDirection.I_OWE,
        amount: Math.abs(v.amount),
        currency: v.currency,
      }));
    return { totalIOwe, totalOwedToMe, netBalance: totalOwedToMe - totalIOwe, byPerson };
  }
}
